/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.collision', 'spark.timeline');

// A sprite is a rendered quad with behaviors and optional collision.
__MODULE__.Sprite = function() {
  this.m = spark.vec.IDENTITY;

  // Flags.
  this.dead = false;
  this.visible = true;

  // Color tint and alpha.
  this.red = 1.0;
  this.green = 1.0;
  this.blue = 1.0;
  this.alpha = 1.0;

  // Update behaviors and shape colliders.
  this.behaviors = [];
  this.colliders = [];

  // Animations that are currently playing.
  this.anims = [];
};

// Set constructors.
spark.sprite.Sprite.prototype.constructor = spark.sprite.Sprite;

// Convert a world <x,y> pair into local space.
__MODULE__.Sprite.prototype.worldToLocal = function(p) {
  return this.m.inverse.vtransform(p);
};

// Convert a world angle into a local space angle.
__MODULE__.Sprite.prototype.worldToLocalAngle = function(angle) {
  return this.m.angle - angle;
};

// Convert an <x,y> pair (array) from local space to world space.
__MODULE__.Sprite.prototype.localToWorld = function(p) {
  return this.m.vtransform(p);
};

// Convert a local-space angle (in degrees) to a world-space angle.
__MODULE__.Sprite.prototype.localToWorldAngle = function(angle) {
  return angle + this.m.angle;
};

// The image is any texture class, and frame is optional.
__MODULE__.Sprite.prototype.setImage = function(image, frame) {
  this.image = image;
  this.frame = frame;
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

// Tell the sprite to play an animation.
__MODULE__.Sprite.prototype.playAnimation = function(anim, onevent) {
  this.anims.push(anim.play(this, onevent));
};

// Called once per frame to advance the gameplay simulation.
__MODULE__.Sprite.prototype.update = function() {
  var i;

  // Update all animations.
  for(i = 0;i < this.anims.length;i++) {
    if (this.anims[i](spark.game.step) === false) {
      // TODO: Remove animation.
    }
  }

  // Process all behavior functions.
  for(i = 0;i < this.behaviors.length;i++) {
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

  // Render the sprite.
  spark.view.save();

  // Set the alpha and composite style.
  spark.view.globalAlpha = Math.min(1.0, Math.max(this.alpha, 0.0));
  spark.view.globalCompositeOperation = this.compositeOperation || 'source-over';

  // Apply the transform for this sprite.
  spark.view.transform.apply(spark.view, this.m.transform);

  // Render.
  this.image.blit(this.frame, [0.5, 0.5]);

  // Done.
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
