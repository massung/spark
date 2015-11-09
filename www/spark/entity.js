/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.collision', 'spark.shader').defines({

  // A pivot object is just a transform.
  Pivot: function() {
    this.m = spark.vec.IDENTITY;
  },

  // A sprite is a rendered quad with behaviors and optional collision.
  Sprite: function() {
    this.dead = false;
    this.visible = true;
    this.alpha = 1.0;

    // Update behaviors and shape colliders.
    this.behaviors = [];
    this.colliders = [];

    // Initialize the pivot transform.
    spark.entity.Pivot.call(this);
  },
});

// Sprites extend pivot.
__MODULE__.Sprite.prototype = Object.create(spark.entity.Pivot.prototype);

// Set constructors.
__MODULE__.Pivot.prototype.constructor = __MODULE__.Pivot;
__MODULE__.Sprite.prototype.constructor = __MODULE__.Sprite;

// Set the absolute translation of a sprite.
__MODULE__.Pivot.prototype.setPosition = function(x, y) {
  this.m.p = [x, y];
};

// Set the absolute rotation of a sprite.
__MODULE__.Pivot.prototype.setRotation = function(angle) {
  var rads = spark.util.degToRad(angle);
  this.m.r = [Math.cos(rads), Math.sin(rads)];
};

// Set the absolute scale of a sprite.
__MODULE__.Pivot.prototype.setScale = function(x, y) {
  this.m.s = [x || 1.0, y || x || 1.0];
};

// Translate a pivot entity.
__MODULE__.Pivot.prototype.translate = function(v, local) {
  if (local) {
    v = spark.vec.vrotate(v, this.m.r);
  }

  // Update the translation vector.
  this.m.p.x += v.x;
  this.m.p.y += v.y;
};

// Turn a pivot entity. Positive angle = clockwise.
__MODULE__.Pivot.prototype.rotate = function(angle) {
  var r = spark.util.degToRad(angle);
  this.m.r = spark.vec.vrotate(this.m.r, [Math.cos(r), Math.sin(r)]);
};

// Adjust the scale of a pivot entity.
__MODULE__.Pivot.prototype.scale = function(x, y) {
  this.m.s.x += x || 1.0;
  this.m.s.y += y || x || 1.0;
};

// Return the angle of rotation (in degrees). This is slow!
__MODULE__.Pivot.prototype.angle = function() {
  return spark.util.radToDeg(Math.atan2(this.m.r.y, this.m.r.x));
};

// Multiply the canvas view transform.
__MODULE__.Pivot.prototype.applyTransform = function() {
  spark.view.transform.apply(spark.view, this.m.transform);
};

// Multiply the canvas view transform by the inverse of this.
__MODULE__.Pivot.prototype.applyInverseTransform = function() {
  spark.view.transform.apply(spark.view, this.m.inverse.transform);
};

// Convert an <x,y> pair (array) from local space to world space.
__MODULE__.Pivot.prototype.localToWorld = function(p) {
  return this.m.vtransform(p);
};

// Convery a world <x,y> pair into local space.
__MODULE__.Pivot.prototype.worldToLocal = function(p) {
  return this.m.inverse.vtransform(p);
};

// Convert a local-space angle (in degrees) to a world-space angle.
__MODULE__.Pivot.prototype.localToWorldAngle = function(angle) {
  return angle + this.angle();
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
__MODULE__.Sprite.prototype.addCollider = function(filter, oncollision) {
  var collider = new spark.collision.Collider(this, filter, oncollision);

  // Track the new collider.
  this.colliders.push(collider);

  return collider;
};

// Called once per frame to update the world space transforms on colliders.
__MODULE__.Sprite.prototype.updateShapeColliders = function() {
  for(var i = 0;i < this.colliders.length;i++) {
    this.colliders[i].updateShapes(this.m);
  }
};

// Called once per frame to advance the gameplay simulation.
__MODULE__.Sprite.prototype.update = function() {
  for(var i = 0;i < this.behaviors.length;i++) {
    this.behaviors[i].call(this);
  }

  // Update all the collision shapes.
  this.updateShapeColliders();
};

// Called once per frame to render.
__MODULE__.Sprite.prototype.draw = function() {
  if (this.image === undefined) {
    return;
  }

  // Set the alpha value for the sprite.
  gl.uniform1f(spark.shader.current.u_alpha, this.alpha);

  // Set the world transform for this sprite.
  gl.uniformMatrix4fv(spark.shader.current.u_world, false, this.m.transform);

  // Render the sprite.
  this.image.blit(this.frame);
};

// Return the width of the sprite.
__MODULE__.Sprite.prototype.__defineGetter__('width', function() {
  if (this.image === undefined) {
    return 0;
  }

  return this.frame ? this.frame.width : this.image.source.width;
});

// Return the height of the sprite.
__MODULE__.Sprite.prototype.__defineGetter__('height', function() {
  if (this.image === undefined) {
    return 0;
  }

  return this.frame ? this.frame.height : this.image.source.height;
});
