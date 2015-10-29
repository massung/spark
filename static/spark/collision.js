/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec').defines({
  QUADTREE_DEPTH_LIMIT: 4,
  QUADTREE_SHAPE_LIMIT: 8,

  // Collision spacial hash.
  Quadtree: function(x, y, w, h, depth) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + w;
    this.y2 = y + h;

    // Once the depth === QUADTREE_DEPTH_LIMIT, this tree cannot be subdivided.
    this.depth = depth || 0;

    // All the shapes and child tree nodes.
    this.shapes = [];
    this.nodes = [];
  },

  // A shape is a simple, axis-aligned bounding box.
  Shape: function(body) {
    this.body = body;

    // This is the cached, world-space bounding box of this shape.
    this.x = this.y = this.w = this.h = 0.0;
  },

  // A line segment shape.
  Segment: function(body, p1, p2) {
    this.p1 = p1;
    this.p2 = p2;

    // Shape constructor.
    spark.collision.Shape.call(this, body);
  },

  // A circle shape.
  Circle: function(body, c, r) {
    this.c = c;
    this.r = r;

    // Shape constructor.
    spark.collision.Shape.call(this, body);
  },

  // An axis-aligned, box shape.
  Box: function(body, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Shape constructor.
    spark.collision.Shape.call(this, body);
  },
});

// Shape prototype hierarchy.
__MODULE__.Segment.prototype = Object.create(spark.collision.Shape.prototype);
__MODULE__.Circle.prototype = Object.create(spark.collision.Shape.prototype);
__MODULE__.Box.prototype = Object.create(spark.collision.Shape.prototype);

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
  if (this.depth < collision.QUADTREE_DEPTH_LIMIT && this.shapes.length > collision.QUADTREE_SHAPE_LIMIT && this.nodes.length === 0) {
    var w = (this.x2 - this.x1) / 2;
    var h = (this.y2 - this.y1) / 2;

    // Split this node into 4 nodes.
    this.nodes = [
      new collision.Quadtree(this.x1,     this.y1,     w, h, this.depth + 1),
      new collision.Quadtree(this.x1 + w, this.y1,     w, h, this.depth + 1),
      new collision.Quadtree(this.x1,     this.y1 + h, w, h, this.depth + 1),
      new collision.Quadtree(this.x1 + w, this.y1 + h, w, h, this.depth + 1),
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

// Process all collisions.
__MODULE__.Quadtree.prototype.processCollisions = function() {
  for(var i = 0;i < this.shapes.length;i++) {
    var a = this.shapes[i];

    for(var j = i + 1;j < this.shapes.length;j++) {
      var b = this.shapes[j];

      if (a.body !== b.body && a.intersects(b)) {
        a.collide(b);
        b.collide(a);
      }
    }

    // Create a copy of all the child nodes to search.
    var nodes = this.nodes.concat([]);

    // Walk all child nodes until they are all tested.
    while(nodes.length > 0) {
      var node = nodes.pop();

      // Test against all the shapes in the child node.
      node.shapes.forEach(function(b) {
        if (a.body !== b.body && a.intersects(b)) {
          a.collide(b);
          b.collide(a);
        }
      });

      // Append all the child nodes and keep searching.
      if (node.nodes.length > 0) {
        nodes = nodes.concat(node.nodes);
      }
    }
  }

  // Look at all the shapes in the child nodes.
  this.nodes.forEach(function(node) {
    node.processCollisions();
  });
};

// Debug render the quadtree.
__MODULE__.Quadtree.prototype.draw = function(color) {
  spark.view.save();
  spark.view.setTransform(1, 0, 0, 1, 0, 0);

  // Render the bounding area of this quadtree node.
  spark.view.strokeStyle = color || '#400';
  spark.view.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);

  // Render all the child nodes.
  this.nodes.forEach(function(node) {
    node.draw(color);
  });

  spark.view.restore();
};

// True if the shape is completely within a bounding box.
__MODULE__.Shape.prototype.within = function(x1, y1, x2, y2) {
  return false;
};

// True if the shape intersects a segment shape.
__MODULE__.Shape.prototype.segmentQuery = function(s) {
  return false;
};

// True if the shape intersects a circle shape.
__MODULE__.Shape.prototype.circleQuery = function(s) {
  return false;
};

// True if the shape intersects a box shape.
__MODULE__.Shape.prototype.boxQuery = function(s) {
  return false;
};

// True if the shape is completely within the bounding box.
__MODULE__.Segment.prototype.within = function(x1, y1, x2, y2) {
  return this.x1 >= x1 && this.x1 <= x2 && this.x2 >= x1 && this.x2 <= x2 &&
         this.y1 >= y1 && this.y1 <= y2 && this.y2 >= y1 && this.y2 <= y2;
};

// Segment/segment shape query.
__MODULE__.Segment.prototype.segmentQuery = function(s) {

  // Perform a quick bounding box test for an early out.
  if (Math.min(s.x1, s.x2) > Math.max(this.x1, this.x2) ||
      Math.min(s.y1, s.y2) > Math.max(this.y1, this.y2) ||
      Math.max(s.x1, s.x2) < Math.min(this.x1, this.x2) ||
      Math.max(s.y1, s.y2) < Math.min(this.y1, this.y2)) {
    return false;
  }

  var sa = Math.sign(spark.vec.vcross(this.p1, s.p1));
  var sb = Math.sign(spark.vec.vcross(this.p1, s.p2));

  // Each point must be on opposite sides of the shape.
  if (sa === sb && sa !== 0 && sb !== 0) {
    return false;
  }

  var da = Math.sign(spark.vec.vcross(s.p1, this.p1));
  var db = Math.sign(spark.vec.vcross(s.p1, this.p2));

  // Each point of this segment must be on opposite sides of the shape.
  if (da === db && da !== 0 && db !== 0) {
    return false;
  }

  return true;
};

// Segment/circle shape query.
__MODULE__.Segment.prototype.circleQuery = function(s) {
  var p = spark.vec.vproj(s.p1, s.tc, s.p2);
  var v = spark.vec.vsub(p, s.tc);

  // If the projected point is within the radius, a collision occurs.
  return spark.vec.vmagsq(v) < s.r * s.r;
};

// Segment/box shape query.
__MODULE__.Segment.prototype.boxQuery = function(s) {

};

// Is a circle shape completely within the bounds.
__MODULE__.Circle.prototype.within = function(x1, y1, x2, y2) {
  return false;
};

// Circle/segment shape query.
__MODULE__.Circle.prototype.segmentQuery = function(s) {
  return s.circleQuery(this);
};

// Circle/circle shape query.
__MODULE__.Circle.prototype.circleQuery = function(s) {
  var v = spark.vec.vsub(s.tc, this.tc);
  var r = this.r + s.r;

  // If closer than the radii combined, then collision occurs.
  return spark.vec.vmagsq(v) < r * r;
};

// Circle/box shape query.
__MODULE__.Circle.prototype.boxQuery = function(s) {
  return false;
};

// Is an axis-aligned bounding box completely within the bounds.
__MODULE__.Box.prototype.within = function(x1, y1, x2, y2) {
  return false;
};

// Returns the side of a shape that a point is on (-1, 0, +1).
__MODULE__.Shape.prototype.cross = function(x, y) {
  var vx = this.x2 - this.x1;
  var vy = this.y2 - this.y1;

  // Cross product of shape segment -> <x,y>
  return Math.sign(vx * (y - this.y1) - vy * (x - this.x1));
};

// True if the shape segments intersect.
__MODULE__.Shape.prototype.intersects = function(s) {

};

// Call the collision callback of the shape if there is one.
__MODULE__.Shape.prototype.collide = function(shape) {
  if (this.oncollision !== undefined) {
    this.oncollision.call(this.body, shape.filter, shape.body);
  }
};
