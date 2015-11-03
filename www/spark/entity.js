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
    this.alpha = 1.0;
    this.pivot = [0.5, 0.5];

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
  this.m.r = [Math.cos(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0)];
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
  var r = angle * Math.PI / 180.0;

  // Rotate the vector.
  this.m.r = spark.vec.vrotate(this.m.r, [Math.cos(r), Math.sin(r)]);
};

// Adjust the scale of a pivot entity.
__MODULE__.Pivot.prototype.scale = function(x, y) {
  this.m.s.x += x || 1.0;
  this.m.s.y += y || x || 1.0;
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
  return this.m.invserse.vtransform(p);
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
  this.colliders.forEach((function(collider) {
    collider.updateShapes(this);
  }).bind(this.m));
};

// Called once per frame to advance the gameplay simulation.
__MODULE__.Sprite.prototype.update = function() {
  this.behaviors.forEach((function(behavior) {
    behavior.call(this);
  }).bind(this));

  // Update all the collision shapes.
  this.updateShapeColliders();
};

// Called once per frame to render.
__MODULE__.Sprite.prototype.draw = function() {
  if (this.image === undefined) {
    return;
  }

  // Render the sprite.
  spark.view.save();
  {
    spark.view.globalAlpha = Math.min(1.0, Math.max(this.alpha, 0.0));

    // Set the transform and render.
    this.applyTransform();
    this.image.blit(this.frame, this.pivot);
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