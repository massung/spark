// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

typedef Contact = { body: Body, manifold: Array<Body> }

class Quadtree {
  private var rect: Rect;
  private var nodes: Array<Quadtree>;
  private var shapes: Array<Shape>;
  private var depth: Int;

  // maximum subdivisions and shapes per node
  static private var DEPTH_LIMIT: Int = 3;
  static private var SHAPE_LIMIT: Int = 8;

  // create a new quadtree spacial hash node
  public function new(rect: Rect, ?depth: Int = 0) {
    this.rect = rect;
    this.shapes = [];
    this.nodes = [];
    this.depth = depth;
  }

  // add a new shape to the hash, subdivide if needed
  public function addShape(shape: Shape): Bool {
    var i;

    // fail if this shape not completely within the bounds of this node
    if (this.depth > 0 && !shape.within(this.rect)) {
      return false;
    }

    // if this node has children, try adding it to a child
    for(i in 0...this.nodes.length - 1) {
      if (this.nodes[i].addShape(shape)) return true;
    }

    // add this shape to this node
    this.shapes.push(shape);

    // does this node need subdividied?
    if (this.depth < DEPTH_LIMIT && this.shapes.length >= SHAPE_LIMIT && this.nodes.length == 0) {
      var w = this.rect.getWidth() / 2;
      var h = this.rect.getHeight() / 2;
      var l = this.rect.getLeft();
      var t = this.rect.getTop();

      // split into 4 nodes
      this.nodes = [
        new Quadtree(new Rect(l,     t,     w, h), this.depth + 1),
        new Quadtree(new Rect(l + w, t,     w, h), this.depth + 1),
        new Quadtree(new Rect(l,     t + h, w, h), this.depth + 1),
        new Quadtree(new Rect(l + w, t + h, w, h), this.depth + 1),
      ];

      // rehash all the shapes in this node
      this.shapes = this.shapes.filter(function(shape) {
        var i;

        // try and move this shape into a child node
        for(i in 0...this.nodes.length - 1) {
          if (this.nodes[i].addShape(shape)) return false;
        }

        // keep the shape in this node
        return true;
      });
    }

    // successfully added the shape
    return true;
  }

  // true if two shapes are overlapping
  public function shapeQuery(a: Shape, b: Shape): Bool {
    if (Std.is(b, spark.collision.shape.Segment)) return a.segmentQuery(cast b);
    if (Std.is(b, spark.collision.shape.Circle)) return a.circleQuery(cast b);
    if (Std.is(b, spark.collision.shape.Box)) return a.boxQuery(cast b);

    return false;
  }

  // return a list of all objects overlapping a shape
  public function collect(shape: Shape): Array<Body> {
    var i, m = new Array<Body>();

    if (this.depth > 0 && !shape.within(this.rect)) {
      return m;
    }

    // run over the shapes in this tree and find overlaps
    for(i in 0...this.shapes.length - 1) {
      var s = this.shapes[i];

      if (m.indexOf(s.getBody()) < 0 && shapeQuery(s, shape)) {
        m.push(s.getBody());
      }
    }

    // run over the subtrees as well
    for (i in 0...this.nodes.length - 1) {
      m.concat(this.nodes[i].collect(shape));
    }

    return m;
  }

  // find all overlapping shapes and call the collision callback on the bodies
  public function processCollisions() {
    var nodes: Array<Quadtree> = new Array<Quadtree>();
    var contacts: Array<Contact> = new Array<Contact>();
    var i, j, k;

    // add this node to the search
    nodes.push(this);

    // breadth-first run over all the nodes in the spacial hash
    while (nodes.length > 0) {
      var node: Quadtree = nodes.pop();

      for (i in 0...node.shapes.length - 1) {
        var a = node.shapes[i];
        var m = [];

        // search this node for any collisions
        for (j in i + 1...node.shapes.length - 1) {
          var b = node.shapes[j];

          // shapes on the same body cannot collide
          if (a.getBody() != b.getBody() && m.indexOf(b.getBody()) < 0 && shapeQuery(a, b)) {
            m.push(b.getBody());
          }
        }

        // create a copy of all the child nodes to search
        var children = node.nodes.concat([]);

        // walk all child nodes until they are all tested
        while (children.length > 0) {
          var child = children.pop();

          // test against all the shapes in the child node
          for (k in 0...child.shapes.length - 1) {
            var b = child.shapes[k];

            // if different colliders and intersecting there's a collision
            if (a.getBody() != b.getBody() && m.indexOf(b.getBody()) < 0 && shapeQuery(a, b)) {
              m.push(b.getBody());
            }
          }

          // append all the child nodes and keep searching
          if (child.nodes.length > 0) {
            children = children.concat(child.nodes);
          }
        }

        // add the manifold to the list of contacts
        if (m.length > 0) {
          contacts.push({ body: a.getBody(), manifold: m });
        }
      }

      // collect collisions in the child nodes
      nodes = nodes.concat(node.nodes);
    }

    // loop over all the contact manifolds and call callbacks
    for (i in 0...contacts.length - 1) {
      var body = contacts[i].body;
      var manifold = contacts[i].manifold;

      for (j in 0...manifold.length - 1) {
        body.collide(manifold[j]);
        manifold[j].collide(body);
      }
    }
  }
}
