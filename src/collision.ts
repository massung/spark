// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // callback sent whenever a collision occurs
  type CollisionCallback = (a: Collider, b: Collider) => void;

  // spacial hash
  export class Quadtree {
    rect: Rect;
    nodes: Quadtree[];
    shapes: Shape[];
    depth: number;

    // maximum subdivisions and shapes per node
    static DEPTH_LIMIT: number = 3;
    static SHAPE_LIMIT: number = 8;

    // default constructor
    constructor(rect: Rect, depth?: number) {
      this.rect = rect;
      this.shapes = [];
      this.nodes = [];
      this.depth = depth || 0;
    }

    // add a new shape to the hash
    addShape(shape: Shape): boolean {
      var i;

      // fail if this shape not completely within the bounds of this node
      if (this.depth > 0 && !shape.within(this.rect)) {
        return false;
      }

      // if this node has children, try adding it to a child
      for (i = 0;i < this.nodes.length;i++) {
        if (this.nodes[i].addShape(shape)) {
          return true;
        }
      }

      // add this shape to this node
      this.shapes.push(shape);

      // does this node need subdividied?
      if (this.depth < Quadtree.DEPTH_LIMIT && this.shapes.length >= Quadtree.SHAPE_LIMIT && this.nodes.length === 0) {
        var w = this.rect.width / 2;
        var h = this.rect.height / 2;
        var l = this.rect.left;
        var t = this.rect.top;

        // split into 4 nodes
        this.nodes = [
          new Quadtree(new Rect(l,     t,     w, h), this.depth + 1),
          new Quadtree(new Rect(l + w, t,     w, h), this.depth + 1),
          new Quadtree(new Rect(l,     t + h, w, h), this.depth + 1),
          new Quadtree(new Rect(l + w, t + h, w, h), this.depth + 1),
        ];

        // move all shapes in this node to the children node
        this.shapes = this.shapes.filter((function(shape) {
          for (var i = 0;i < this.nodes.length;i++) {
            if (this.nodes[i].addShape(shape)) {
              return false;
            }
          }

          // keep the shape in this node
          return true;
        }).bind(this));
      }

      return true;
    }

    // return a list of all objects overlapping a shape
    collect(shape: Shape): Collider[] {
      if (this.depth > 0 && !shape.within(this.rect)) {
        return [];
      }

      // all overlapping colliders
      var i, m = [];

      // run over the shapes in this tree and find overlaps
      for (i = 0;i < this.shapes.length;i++) {
        var s = this.shapes[i];

        if (m.indexOf(s.collider) < 0 && shapeQuery(s, shape)) {
          m.push(s.collider);
        }
      }

      // run over the subtrees as well
      for (i = 0;i < this.nodes.length;i++) {
        m.concat(this.nodes[i].collect(shape));
      }

      return m;
    }

    // find all overlapping shapes and call the collision callback on them
    processCollisions() {
      var nodes: Quadtree[] = [this];
      var contacts: Object[] = [];

      // breadth-first run over all the nodes in the spacial hash
      while (nodes.length > 0) {
        var node: Quadtree = nodes.pop();

        for (var i = 0;i < node.shapes.length;i++) {
          var a = node.shapes[i];
          var m = [];

          // search this node for any collisions
          for (var j = i + 1;j < node.shapes.length;j++) {
            var b = node.shapes[j];

            if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && shapeQuery(a, b)) {
              m.push(b.collider);
            }
          }

          // create a copy of all the child nodes to search
          var children = node.nodes.concat([]);

          // walk all child nodes until they are all tested
          while (children.length > 0) {
            var child = children.pop();

            // test against all the shapes in the child node
            for (var k = 0;k < child.shapes.length;k++) {
              var b = child.shapes[k];

              // if different colliders and intersecting there's a collision
              if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && shapeQuery(a, b)) {
                m.push(b.collider);
              }
            }

            // append all the child nodes and keep searching
            if (child.nodes.length > 0) {
              children = children.concat(child.nodes);
            }
          }

          // add the manifold to the list of contacts
          if (m.length > 0) {
            contacts.push([a.collider, m]);
          }
        }

        // collect collisions in the child nodes
        nodes = nodes.concat(node.nodes);
      }

      // loop over all the contact manifolds and call callbacks
      for (var i = 0;i < contacts.length;i++) {
        var ca = contacts[i][0];
        var cm = contacts[i][1];

        for (var j = 0;j < m.length;j++) {
          ca.collide(cm[j]);
          cm[j].collide(ca);
        }
      }
    }
  }

  // colliders track shapes and collision callbacks
  export class Collider {
    oncollision: CollisionCallback;
    shapes: Shape[];
    filter: any;

    // create a new collider
    constructor() {
      this.filter = null;
      this.oncollision = null;
      this.shapes = [];
    }

    // calculate all world space coordinates for each shape
    updateShapes(m: Mat) {
      for (var i = 0;i < this.shapes.length;i++) {
        this.shapes[i].updateShapeCache(m);
      }
    }

    // add all the shapes into a spacial hash
    addToQuadtree(space: Quadtree) {
      for (var i = 0;i < this.shapes.length;i++) {
        space.addShape(this.shapes[i]);
      }
    }

    // create a new segment shape and attach it
    addSegment(x1: number, y1: number, x2: number, y2: number) {
      this.shapes.push(new Segment(this, x1, y1, x2, y2));
    }

    // create a new circle shape and attach it
    addCircle(x: number, y: number, radius: number) {
      this.shapes.push(new Circle(this, x, y, radius));
    }

    // create a new box shape and attach it
    addBox(x: number, y: number, width: number, height: number) {
      this.shapes.push(new Box(this, x, y, width, height));
    }

    // process a collision
    collide(c: Collider): void {
      if (this.oncollision) {
        this.oncollision(this, c);
      }
    }
  }

  // true if two shapes are overlapping
  export function shapeQuery(a: Shape, b: Shape): boolean {
    if (b instanceof Segment) return a.segmentQuery(<Segment>b);
    if (b instanceof Circle) return a.circleQuery(<Circle>b);
    if (b instanceof Box) return a.boxQuery(<Box>b);

    return false;
  }

  // abstract collision shape
  interface Shape {
    collider: Collider;

    // calculate the world space points of the shape
    updateShapeCache(m: Mat): void;

    // true if this shape is completely within a rectangle
    within(rect: Rect): boolean;

    // true if this shape overlaps a collision shape
    segmentQuery(shape: Segment): boolean;
    circleQuery(shape: Circle): boolean;
    boxQuery(shape: Box): boolean;
  }

  // line segment collision shape
  export class Segment implements Shape {
    collider: Collider;
    p1: Vec;
    p2: Vec;
    tp1: Vec;
    tp2: Vec;

    // create a line from <x1,y1> to <x2,y2>
    constructor(collider: Collider, x1: number, y1: number, x2: number, y2: number) {
      this.collider = collider;

      // create the local points
      this.p1 = new Vec(x1, y1);
      this.p2 = new Vec(x2, y2);
    }

    // calculate the world space points of the shape
    updateShapeCache(m: Mat): void {
      this.tp1 = m.transform(this.p1);
      this.tp2 = m.transform(this.p2);
    }

    // true if this shape is completely within a rectangle
    within(rect: Rect): boolean {
      return rect.contains(this.tp1.x, this.tp1.y) &&
             rect.contains(this.tp2.x, this.tp2.y);
    }

    // true if this shape overlaps a line segment
    segmentQuery(s: Segment): boolean {
      if (Math.min(s.tp1.x, s.tp2.x) > Math.max(this.tp1.x, this.tp2.x) ||
          Math.min(s.tp1.y, s.tp2.y) > Math.max(this.tp1.y, this.tp2.y) ||
          Math.max(s.tp1.x, s.tp2.x) < Math.min(this.tp1.x, this.tp2.x) ||
          Math.max(s.tp1.y, s.tp2.y) < Math.min(this.tp1.y, this.tp2.y)) {
            return false;
      }

      var sa = signum(this.tp1.cross(s.tp1));
      var sb = signum(this.tp1.cross(s.tp2));

      // each point must be on opposite sides of the shape
      if (sa === sb && sa !== 0 && sb !== 0) {
        return false;
      }

      var da = signum(s.tp1.cross(this.tp1));
      var db = signum(s.tp1.cross(this.tp2));

      // each point of this segment must be on opposite sides of the shape
      if (da === db && da !== 0 && db !== 0) {
        return false;
      }

      return true;
    }

    // true if this shape overlaps a circle
    circleQuery(s: Circle): boolean {
      return s.tc.proj(this.tp1, this.tp2).distsq(s.tc) < s.r * s.r;
    }

    // true if this shape overlaps a box
    boxQuery(s: Box): boolean {
      if (this.tp1.x < s.tp1.x && this.tp2.x < s.tp1.x) return false;
      if (this.tp1.x > s.tp2.x && this.tp2.x > s.tp2.x) return false;
      if (this.tp1.y < s.tp1.y && this.tp2.y < s.tp1.y) return false;
      if (this.tp1.y > s.tp2.y && this.tp2.y > s.tp2.y) return false;

      return true;
    }
  }

  // circle collision shape
  export class Circle implements Shape {
    collider: Collider;
    c: Vec;
    tc: Vec;
    r: number;

    // create a new circle shape at <x,y> with a given radius
    constructor(collider: Collider, x: number, y: number, radius: number) {
      this.collider = collider;
      this.c = new Vec(x, y);
      this.r = radius;
    }

    // calculate the world space points of the shape
    updateShapeCache(m: Mat): void {
      this.tc = m.transform(this.c);
    }

    // true if this shape is completely within a rectangle
    within(rect: Rect): boolean {
      if (this.tc.x + this.r < rect.left) return false;
      if (this.tc.x - this.r > rect.right) return false;
      if (this.tc.y + this.r < rect.top) return false;
      if (this.tc.y - this.r > rect.bottom) return false;

      return true;
    }

    // true if this shape overlaps a line segment
    segmentQuery(s: Segment): boolean {
      return s.circleQuery(this);
    }

    // true if this shape overlaps a circle
    circleQuery(s: Circle): boolean {
      return this.tc.distsq(s.tc) < (this.r * this.r) + (s.r * s.r);
    }

    // true if this shape overlaps a box
    boxQuery(s: Box): boolean {

      // circle is above, below, or inside
      if (this.tc.x > s.tp1.x && this.tc.x <= s.tp2.x) {
        return this.tc.y + this.r >= s.tp1.y && this.tc.y - this.r <= s.tp2.y;
      }

      // circle is left, right, or inside
      if (this.tc.y >= s.tp1.y && this.tc.y <= s.tp2.y) {
        return this.tc.x + this.r >= s.tp1.x && this.tc.x - this.r <= s.tp2.x;
      }

      // above and to the left of the box
      if (this.tc.x < s.tp1.x && this.tc.y < s.tp1.y) {
        return this.tc.distsq(s.tp1) <= this.r * this.r;
      }

      // above and to the right of the box
      if (this.tc.x > s.tp2.x && this.tc.y < s.tp1.y) {
        return this.tc.distsq(new Vec(s.tp2.x, s.tp1.y)) <= this.r * this.r;
      }

      // below and to the left of the box
      if (this.tc.x < s.tp1.x && this.tc.y > s.tp2.y) {
        return this.tc.distsq(new Vec(s.tp1.x, s.tp2.y)) <= this.r * this.r;
      }

      // below and to the right of the box
      return this.tc.distsq(s.tp2) <= this.r * this.r;
    }
  }

  // axis-aligned bounding box collision shape
  export class Box implements Shape {
    collider: Collider;
    p1: Vec;
    p2: Vec;
    p3: Vec;
    p4: Vec;
    tp1: Vec;
    tp2: Vec;

    // create an axis-aligned box from <x,y> with size <width,height>
    constructor(collider: Collider, x: number, y: number, width: number, height: number) {
      this.collider = collider;
      this.p1 = new Vec(x, y);
      this.p2 = new Vec(x + width, y);
      this.p3 = new Vec(x + width, y + height);
      this.p4 = new Vec(x, y + height);
    }

    // calculate the world space points of the shape
    updateShapeCache(m: Mat) {
      var v1 = m.transform(this.p1);
      var v2 = m.transform(this.p2);
      var v3 = m.transform(this.p3);
      var v4 = m.transform(this.p4);

      // find the extents of each vertex
      this.tp1.x = Math.min(v1.x, v2.x, v3.x, v4.x);
      this.tp1.y = Math.min(v1.y, v2.y, v3.y, v4.y);
      this.tp2.x = Math.max(v1.x, v2.x, v3.x, v4.x);
      this.tp2.y = Math.max(v1.y, v2.y, v3.y, v4.y);
    }

    // true if this shape is completely within a rectangle
    within(rect: Rect): boolean {
      if (this.tp2.x < rect.left) return false;
      if (this.tp1.x > rect.right) return false;
      if (this.tp2.y < rect.top) return false;
      if (this.tp1.y > rect.bottom) return false;

      return true;
    }

    // true if this shape overlaps a line segment
    segmentQuery(s: Segment): boolean {
      return s.boxQuery(this);
    }

    // true if this shape overlap a circle
    circleQuery(s: Circle): boolean {
      return s.boxQuery(this);
    }

    // true if this shape overlaps a box
    boxQuery(s: Box): boolean {
      if (this.tp2.x < s.tp1.x || this.tp1.x > s.tp2.x) return false;
      if (this.tp2.y < s.tp1.y || this.tp1.y > s.tp2.y) return false;

      return true;
    }
  }
}
