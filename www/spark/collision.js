/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec');

// Collision spacial hash.
__MODULE__.Quadtree = function(x, y, w, h, depth) {
  this.x1 = x;
  this.y1 = y;
  this.x2 = x + w;
  this.y2 = y + h;

  // Once the depth === QUADTREE_DEPTH_LIMIT, this tree cannot be subdivided.
  this.depth = depth || 0;

  // All the shapes and child tree nodes.
  this.shapes = [];
  this.nodes = [];
};

// A collider can have many shapes.
__MODULE__.Collider = function(owner, filter, oncollision) {
  this.owner = owner;
  this.filter = filter;
  this.oncollision = oncollision;
  this.shapes = [];
};

// Root shape class.
__MODULE__.Shape = function(collider) {
  this.collider = collider;
};

// A line segment shape.
__MODULE__.Segment = function(collider, p1, p2) {
  spark.collision.Shape.call(this, collider);

  // Set the end-points.
  this.p1 = p1;
  this.p2 = p2;
};

// A circle shape.
__MODULE__.Circle = function(collider, c, r) {
  spark.collision.Shape.call(this, collider);

  // Set origin and radius.
  this.c = c;
  this.r = r;
};

// An axis-aligned, box shape.
__MODULE__.Box = function(collider, x, y, w, h) {
  spark.collision.Shape.call(this, collider);

  // Set bounds.
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

// Extend shapes.
__MODULE__.Segment.prototype = Object.create(__MODULE__.Shape.prototype);
__MODULE__.Circle.prototype = Object.create(__MODULE__.Shape.prototype);
__MODULE__.Box.prototype = Object.create(__MODULE__.Shape.prototype);

// Set constructors.
__MODULE__.Quadtree.prototype.constructor = __MODULE__.Quadtree;
__MODULE__.Collider.prototype.constructor = __MODULE__.Collider;
__MODULE__.Shape.prototype.constructor = __MODULE__.Shape;
__MODULE__.Segment.prototype.constructor = __MODULE__.Segment;
__MODULE__.Circle.prototype.constructor = __MODULE__.Circle;
__MODULE__.Box.prototype.constructor = __MODULE__.Box;

// Maximum depth and split limits.
__MODULE__.Quadtree.prototype.DEPTH_LIMIT = 3;
__MODULE__.Quadtree.prototype.SHAPE_LIMIT = 8;

// Add a shape to the quadtree.
__MODULE__.Quadtree.prototype.push = function(shape) {
  if (this.depth > 0 && shape.within(this.x1, this.y1, this.x2, this.y2) === false) {
    return false;
  }

  // If this node has children, try adding it to a child.
  for(var i = 0;i < this.nodes.length;i++) {
    if (this.nodes[i].push(shape)) {
      return true;
    }
  }

  // Add this shape to this node.
  this.shapes.push(shape);

  // Are there too many shapes in this tree node?
  if (this.depth < spark.collision.Quadtree.prototype.DEPTH_LIMIT && this.shapes.length > spark.collision.Quadtree.prototype.SHAPE_LIMIT && this.nodes.length === 0) {
    var w = (this.x2 - this.x1) / 2;
    var h = (this.y2 - this.y1) / 2;

    // Split this node into 4 nodes.
    this.nodes = [
      new spark.collision.Quadtree(this.x1,     this.y1,     w, h, this.depth + 1),
      new spark.collision.Quadtree(this.x1 + w, this.y1,     w, h, this.depth + 1),
      new spark.collision.Quadtree(this.x1,     this.y1 + h, w, h, this.depth + 1),
      new spark.collision.Quadtree(this.x1 + w, this.y1 + h, w, h, this.depth + 1),
    ];

    // Try and move all the shapes into child nodes.
    this.shapes = this.shapes.filter((function(shape) {
      for(var i = 0;i < this.nodes.length;i++) {
        if (this.nodes[i].push(shape) == true) {
          return false;
        }
      }

      // No child node could hold it, keep it in this node.
      return true;
    }).bind(this));
  }

  return true;
};

// Find all collision objects at a given a shape in world space.
__MODULE__.Quadtree.prototype.collect = function(shape) {
  if (this.depth > 0 && shape.within(this.x1, this.y1, this.x2, this.y2) === false) {
    return [];
  }

  // All overlapping colliders.
  var m = [];

  // Run over all the shapes in this tree and find overlaps.
  for(var i = 0;i < this.shapes.length;i++) {
    var s = this.shapes[i];

    if (m.indexOf(s.collider) < 0 && s.shapeQuery(shape)) {
      m.push(s.collider);
    }
  }

  // Run over all the sub-trees and recurse.
  for(var i = 0;i < this.nodes.length;i++) {
    m.concat(this.nodes[i].collect(shape));
  }

  return m;
};

// Collect and process all collisions.
__MODULE__.Quadtree.prototype.processCollisions = function() {
  var contacts = [];
  var nodes = [this];

  // Breadth-first run over all the nodes in the spacial hash.
  while(nodes.length > 0) {
    var node = nodes.pop();

    for(var i = 0;i < node.shapes.length;i++) {
      var a = node.shapes[i];
      var m = [];

      // Search this node for any collisions.
      for(var j = i + 1;j < node.shapes.length;j++) {
        var b = node.shapes[j];

        if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && a.shapeQuery(b)) {
          m.push(b.collider);
        }
      }

      // Create a copy of all the child nodes to search.
      var children = node.nodes.concat([]);

      // Walk all child nodes until they are all tested.
      while(children.length > 0) {
        var child = children.pop();

        // Test against all the shapes in the child node.
        child.shapes.forEach(function(b) {
          if (a.collider !== b.collider && m.indexOf(b.collider) < 0 && a.shapeQuery(b)) {
            m.push(b.collider);
          }
        });

        // Append all the child nodes and keep searching.
        if (child.nodes.length > 0) {
          children = children.concat(child.nodes);
        }
      }

      // Add the manifold to the list of contacts.
      if (m.length > 0) {
        contacts.push([a.collider, m]);
      }
    }

    // Collect collisions in the child nodes.
    nodes = nodes.concat(node.nodes);
  }

  // Loop over all the contact manifolds and call callbacks.
  for(var i = 0;i < contacts.length;i++) {
    var a = contacts[i][0];
    var m = contacts[i][1];

    for(var j = 0;j < m.length;j++) {
      a.collide(m[j]);
      m[j].collide(a);
    }
  }
};

// Debug render the quadtree.
__MODULE__.Quadtree.prototype.draw = function(color) {
  spark.view.save();

  // Render the bounding area of this quadtree node.
  spark.view.strokeStyle = color || '#f00';
  spark.view.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);

  // Render all the child nodes.
  this.nodes.forEach(function(node) {
    node.draw(color);
  });

  // Render all the shapes.
  this.shapes.forEach(function(shape) {
    shape.draw();
  });

  // Done.
  spark.view.restore();
};

// Add all the shapes of a collider to a spacial hash.
__MODULE__.Collider.prototype.addToQuadtree = function(space) {
  for(var i = 0;i < this.shapes.length;i++) {
    space.push(this.shapes[i]);
  }
};

// Add a segment collision shape to the entity.
__MODULE__.Collider.prototype.addSegment = function(p1, p2) {
  this.shapes.push(new spark.collision.Segment(this, p1, p2));
};

// Add a circle collision shape to the entity.
__MODULE__.Collider.prototype.addCircle = function(c, r) {
  this.shapes.push(new spark.collision.Circle(this, c, r));
};

// Add an axis-aligned, bounding box collision shape to the entity.
__MODULE__.Collider.prototype.addBox = function(x, y, w, h) {
  this.shapes.push(new spark.collision.Box(this, x, y, w, h));
};

// Called once per frame to transform shapes from local to world space.
__MODULE__.Collider.prototype.updateShapes = function(m) {
  for(var i = 0;i < this.shapes.length;i++) {
    this.shapes[i].updateShapeCache(m);
  }
};

// Call the collision callback of the shape body if there is one.
__MODULE__.Collider.prototype.collide = function(collider) {
  if (this.oncollision !== undefined) {
    this.oncollision.call(this.owner, collider);
  }
};

// True if this shape intersects the shape argument.
__MODULE__.Shape.prototype.shapeQuery = function(shape) {
  if (shape.constructor === spark.collision.Segment) return this.segmentQuery(shape);
  if (shape.constructor === spark.collision.Circle) return this.circleQuery(shape);
  if (shape.constructor === spark.collision.Box) return this.boxQuery(shape);

  return false;
};

// Base prototype shape querying functions.
__MODULE__.Shape.prototype.draw = function() { };
__MODULE__.Shape.prototype.updateShapeCache = function(m) { };
__MODULE__.Shape.prototype.within = function(x1, y1, x2, y2) { return false; };
__MODULE__.Shape.prototype.segmentQuery = function(s) { return false; };
__MODULE__.Shape.prototype.circleQuery = function(s) { return false; };
__MODULE__.Shape.prototype.boxQuery = function(s) { return false; };

// Render the segment shape.
__MODULE__.Segment.prototype.draw = function() {
  spark.view.strokeStyle = '#ff0';
  spark.view.beginPath();
  spark.view.moveTo(this.tp1.x, this.tp1.y);
  spark.view.lineTo(this.tp2.x, this.tp2.y);
  spark.view.stroke();
};

// Update the world coordinates of the segment shape.
__MODULE__.Segment.prototype.updateShapeCache = function(m) {
  this.tp1 = m.vtransform(this.p1);
  this.tp2 = m.vtransform(this.p2);
};

// True if the shape is completely within the bounding box.
__MODULE__.Segment.prototype.within = function(x1, y1, x2, y2) {
  return this.x1 >= x1 && this.x1 <= x2 && this.x2 >= x1 && this.x2 <= x2 &&
         this.y1 >= y1 && this.y1 <= y2 && this.y2 >= y1 && this.y2 <= y2;
};

// Segment/segment shape query.
__MODULE__.Segment.prototype.segmentQuery = function(s) {
  if (Math.min(s.tp1.x, s.tp2.x) > Math.max(this.tp1.x, this.tp2.x) ||
      Math.min(s.tp1.y, s.tp2.y) > Math.max(this.tp1.y, this.tp2.y) ||
      Math.max(s.tp1.x, s.tp2.x) < Math.min(this.tp1.x, this.tp2.x) ||
      Math.max(s.tp1.y, s.tp2.y) < Math.min(this.tp1.y, this.tp2.y)) {
    return false;
  }

  var sa = Math.sign(spark.vec.vcross(this.tp1, s.tp1));
  var sb = Math.sign(spark.vec.vcross(this.tp1, s.tp2));

  // Each point must be on opposite sides of the shape.
  if (sa === sb && sa !== 0 && sb !== 0) {
    return false;
  }

  var da = Math.sign(spark.vec.vcross(s.tp1, this.tp1));
  var db = Math.sign(spark.vec.vcross(s.tp1, this.tp2));

  // Each point of this segment must be on opposite sides of the shape.
  if (da === db && da !== 0 && db !== 0) {
    return false;
  }

  return true;
};

// Segment/circle shape query.
__MODULE__.Segment.prototype.circleQuery = function(s) {
  var p = spark.vec.vproj(this.tp1, s.tc, this.tp2);

  // If the projected point is within the radius, a collision occurs.
  return spark.vec.vdistsq(p, s.tc) < s.r * s.r;
};

// Segment/box shape query.
__MODULE__.Segment.prototype.boxQuery = function(s) {
  if (this.tp1.x < s.tp1.x && this.tp2.x < s.tp1.x) return false;
  if (this.tp1.x > s.tp2.x && this.tp2.x > s.tp2.x) return false;
  if (this.tp1.y < s.tp1.y && this.tp2.y < s.tp1.y) return false;
  if (this.tp1.y > s.tp2.y && this.tp2.y > s.tp2.y) return false;

  return true;
};

// Render the circle shape.
__MODULE__.Circle.prototype.draw = function() {
  spark.view.strokeStyle = '#ff0';
  spark.view.beginPath();
  spark.view.arc(this.tc.x, this.tc.y, this.r, 0, 360);
  spark.view.stroke();
};

// Update the world coordinates of the circle shape.
__MODULE__.Circle.prototype.updateShapeCache = function(m) {
  this.tc = m.vtransform(this.c);
};

// Is a circle shape completely within the bounds.
__MODULE__.Circle.prototype.within = function(x1, y1, x2, y2) {
  if (this.tc.x + this.r < x1) return false;
  if (this.tc.x - this.r > x2) return false;
  if (this.tc.y + this.r < y1) return false;
  if (this.tc.y - this.r > y2) return false;

  return true;
};

// Circle/segment shape query.
__MODULE__.Circle.prototype.segmentQuery = function(s) {
  return s.circleQuery(this);
};

// Circle/circle shape query.
__MODULE__.Circle.prototype.circleQuery = function(s) {
  return spark.vec.vdistsq(s.tc, this.tc) < (this.r + s.r) * (this.r + s.r);
};

// Circle/box shape query.
__MODULE__.Circle.prototype.boxQuery = function(s) {

  // Circle is above, below, or inside.
  if (this.tc.x >= s.tp1.x && this.tc.x <= s.tp2.x) {
    return this.tc.y + this.r >= s.tp1.y && this.tc.y - this.r <= s.tp2.y;
  }

  // Circle is left, right, or inside.
  if (this.tc.y >= s.tp1.y && this.tc.y <= s.tp2.y) {
    return this.tc.x + this.r >= s.tp1.x && this.tc.x - this.r <= s.tp2.y;
  }

  // Top-left corner.
  if (this.tc.x < s.tp1.x && this.tc.y < s.tp1.y) {
    return spark.vec.vdistsq(this.tc, s.tp1) <= this.r * this.r;
  }

  // Top-right corner.
  if (this.tc.x > s.tp2.x && this.tc.y < s.tp1.y) {
    return spark.vec.vdistsq(this.tc, [s.tp2.x, s.tp1.y]) <= this.r * this.r;
  }

  // Bottom-left corner.
  if (this.tc.x < s.tp1.x && this.tc.y > s.tp2.y) {
    return spark.vec.vdistsq(this.tc, [s.tp1.x, s.tp2.y]) <= this.r * this.r;
  }

  // Bottom-right corner.
  return spark.vec.vdistsq(this.tc, s.tp2) <= this.r * this.r;
};

// Render the box shape.
__MODULE__.Box.prototype.draw = function() {
  spark.view.strokeStyle = '#ff0';
  spark.view.beginPath();
  spark.view.moveTo(this.tp1.x, this.tp1.y);
  spark.view.lineTo(this.tp2.x, this.tp1.y);
  spark.view.lineTo(this.tp2.x, this.tp2.y);
  spark.view.lineTo(this.tp1.x, this.tp2.y);
  spark.view.closePath();
  spark.view.stroke();
};

// Update the world coordinates of the circle shape.
__MODULE__.Box.prototype.updateShapeCache = function(m) {
  var v0 = m.vtransform([this.x,          this.y]);
  var v1 = m.vtransform([this.x + this.w, this.y]);
  var v2 = m.vtransform([this.x,          this.y + this.h]);
  var v3 = m.vtransform([this.x + this.w, this.y + this.h]);

  // Extend the box to keep it axis-aligned.
  this.tp1 = [Math.min(v0.x, v1.x, v2.x, v3.x), Math.min(v0.y, v1.y, v2.y, v3.y)];
  this.tp2 = [Math.max(v0.x, v1.x, v2.x, v3.x), Math.max(v0.y, v1.y, v2.y, v3.y)];
};

// Is a circle shape completely within the bounds.
__MODULE__.Box.prototype.within = function(x1, y1, x2, y2) {
  return this.tp2.x >= x1 && this.tp1.x <= x2 && this.tp2.y >= y1 && this.tp1.y <= y2;
};

// Box/segment shape query.
__MODULE__.Box.prototype.segmentQuery = function(s) {
  return s.boxQuery(this);
};

// Box/circle shape query.
__MODULE__.Box.prototype.circleQuery = function(s) {
  return s.boxQuery(this);
};

// Box/box shape query.
__MODULE__.Box.prototype.boxQuery = function(s) {
  if (this.tp2.x < s.tp1.x || this.tp1.x > s.tp2.x) return false;
  if (this.tp2.y < s.tp1.y || this.tp1.y > s.tp2.y) return false;

  return true;
};
