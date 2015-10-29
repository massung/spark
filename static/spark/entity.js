/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.collision').defines({

  // A pivot object is just a transform.
  Pivot: function() {
    this.m = spark.vec.IDENTITY;
  },

  // A sprite is a rendered quad with behaviors and optional collision.
  Sprite: function() {
    this.dead = false;
    this.visible = true;

    // Update behaviors and optional collision.
    this.behaviors = [];
    this.collision = {
      shapes: [],
      callback: undefined,
      filter: undefined,
    };

    // Initialize the pivot transform.
    spark.entity.Pivot.call(this);
  },
});

// Sprites extend pivot.
__MODULE__.Sprite.prototype = Object.create(spark.entity.Pivot.prototype);

// Set the absolute translation of a sprite.
__MODULE__.Pivot.prototype.setPosition = function(x, y) {
  this.m.p = [x, y];
};

// Set the absolute rotation of a sprite.
__MODULE__.Pivot.prototype.setRotation = function(angle) {
  this.m.r = [Math.cos(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0)];
};

// Set the absolute scale of a sprite.
__MODULE__.Pivot.prototype.setScale = function(x, y) {
  this.m.s = [x || 1.0, y || x || 1.0];
};

// Look in a particular direction.
__MODULE__.Pivot.prototype.lookAt = function(x, y, angle) {
  var dx = x - this.m.p.x;
  var dy = y - this.m.p.y;

  var s = Math.sqrt(dx * dx + dy * dy);

  // This is the new angle.
  this.m.r.x = -dx / s;
  this.m.r.y = dy / s;

  // Apply a local angle offset.
  if (angle !== undefined) {
    this.rotate(angle);
  }
};

// Translate a pivot entity.
__MODULE__.Pivot.prototype.translate = function(s, angle, local) {
  var r = (angle || 0.0) * Math.PI / 180.0;

  var rx = Math.cos(r);
  var ry = Math.sin(r);
  var cx = rx;
  var cy = ry;

  if (local) {
    cx = (this.m.r.x * rx) - (this.m.r.y * ry);
    cy = (this.m.r.y * rx) + (this.m.r.x * ry);
  }

  // Update the translation vector.
  this.m.p.x += s * cx;
  this.m.p.y -= s * cy;
};

// Turn a pivot entity.
__MODULE__.Pivot.prototype.rotate = function(angle) {
  var r = angle * Math.PI / 180.0;

  // Rotate the vector.
  this.m.r = spark.vec.vrotate(this.m.r, [Math.cos(r), Math.sin(r)]);
};

// Scale a pivot entity.
__MODULE__.Pivot.prototype.scale = function(x, y) {
  this.m.s.x *= x || 1.0;
  this.m.s.y *= y || x || 1.0;
};

// Set the canvas view transform.
__MODULE__.Pivot.prototype.setTransform = function() {
  spark.view.setTransform(this.m.r.x * this.m.s.x, -this.m.r.y * this.m.s.y, this.m.r.y * this.m.s.x, this.m.r.x * this.m.s.y, this.m.p.x, this.m.p.y);
};

// Multiply the canvas view transform.
__MODULE__.Pivot.prototype.transform = function() {
  spark.view.transform(this.m.r.x * this.m.s.x, -this.m.r.y * this.m.s.y, this.m.r.y * this.m.s.x, this.m.r.x * this.m.s.y, this.m.p.x, this.m.p.y);
};

// Convert an <x,y> pair (array) from local space to world space.
__MODULE__.Pivot.prototype.localToWorld = function(p) {
  return spark.vec.vadd(spark.vec.vrotate(p, this.m.r), this.m.p);
};

// The image is any texture class, and frame is optional.
__MODULE__.Sprite.prototype.setImage = function(image, frame) {
  this.image = image;
  this.frame = frame;
};

// Tell the sprite to play an animation.
__MODULE__.Sprite.prototype.animate = function(frames, fps, loop) {
  // TODO:
};

// Append a new behavior to a sprite.
__MODULE__.Sprite.prototype.addBehavior = function(behavior) {
  this.behaviors.push(behavior);
};

// Add a collision callback to the entity.
__MODULE__.Sprite.prototype.addCollision = function(filter, oncollision) {
  this.collision.filter = filter;

  // Set the collision callback if one was provided.
  if (oncollision !== undefined) {
    this.collision.callback = oncollision;
  }
};

// Add a collision shape to the entity.
__MODULE__.Sprite.prototype.addCollisionShape = function(shape) {
  this.collision.shapes.push(shape);
};

// Called once per frame - if needed - to update shape vertices.
__MODULE__.Sprite.prototype.updateCollisionShapeVertices = function() {
  var a =  this.rotx * this.sx;
  var b = -this.roty * this.sy;
  var c =  this.roty * this.sx;
  var d =  this.rotx * this.sy;

  // Allocate a cached array.
  if (this.wvs === undefined || this.wvs.length !== this.verts.length + 2) {
    this.wvs = [0, 0].concat(this.verts);
  }

  for(var i = 0;i < this.verts.length;i += 2) {
    var x = this.verts[i];
    var y = this.verts[i + 1];

    // Transform from local to world space.
    this.wvs[i + 0] = (a * x) + (c * y) + this.x;
    this.wvs[i + 1] = (b * x) + (d * y) + this.y;
  }

  // If a closed polygon, duplicate the first vertex again.
  if (this.closedPoly) {
    this.wvs[i++] = this.wvs[0];
    this.wvs[i++] = this.wvs[1];
  }
};

// Called once per frame to advance the gameplay simulation.
__MODULE__.Sprite.prototype.update = function() {
  this.behaviors.forEach((function(behavior) {
    behavior.call(this);
  }).bind(this));
};

// Called once per frame to render.
__MODULE__.Sprite.prototype.draw = function() {
  if (this.image === undefined) {
    return;
  }

  // Render the sprite.
  spark.view.save();
  {
    this.transform();
    this.image.blit(this.frame);
  }
  spark.view.restore();
};

// Return the width of the sprite.
__MODULE__.Sprite.prototype.__defineGetter__('width', function() {
  if (this.image === undefined) {
    return 0;
  }

  if (this.frame === undefined) {
    return this.image.source.width;
  }

  return this.image.frames[this.frame].frame.w;
});

// Return the height of the sprite.
__MODULE__.Sprite.prototype.__defineGetter__('height', function() {
  if (this.image === undefined) {
    return 0;
  }

  if (this.frame === undefined) {
    return this.image.source.height;
  }

  return this.image.frames[this.frame].frame.h;
});
