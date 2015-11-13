/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.collision', 'spark.shader');

// A pivot is just a transform with methods on it.
spark.Pivot = function() {
  this.m = spark.Mat.IDENTITY;
};

// A sprite is a rendered quad with behaviors and optional collision.
spark.Sprite = function() {
  spark.Pivot.call(this);

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
};

// Sprites extend pivot.
spark.Sprite.prototype = Object.create(spark.Pivot.prototype);

// Set constructors.
spark.Pivot.prototype.constructor = spark.Pivot;
spark.Sprite.prototype.constructor = spark.Sprite;

// Set the absolute translation of a sprite.
spark.Pivot.prototype.setPosition = function(x, y) {
  this.m.p = [x, y];
};

// Set the absolute rotation of a sprite.
spark.Pivot.prototype.setRotation = function(angle) {
  var rads = spark.degToRad(angle);
  this.m.r = [Math.cos(rads), Math.sin(rads)];
};

// Set the absolute scale of a sprite.
spark.Pivot.prototype.setScale = function(x, y) {
  this.m.s = [x || 1.0, y || x || 1.0];
};

// Translate a pivot entity.
spark.Pivot.prototype.translate = function(v, local) {
  if (local) {
    v = spark.vrotate(v, this.m.r);
  }

  // Update the translation vector.
  this.m.p.x += v.x;
  this.m.p.y += v.y;
};

// Turn a pivot entity. Positive angle = clockwise.
spark.Pivot.prototype.rotate = function(angle) {
  var r = spark.degToRad(angle);
  this.m.r = spark.vrotate(this.m.r, [Math.cos(r), Math.sin(r)]);
};

// Adjust the scale of a pivot entity.
spark.Pivot.prototype.scale = function(x, y) {
  this.m.s.x += x || 1.0;
  this.m.s.y += y || x || 1.0;
};

// Return the angle of rotation (in degrees). This is slow!
spark.Pivot.prototype.angle = function() {
  return spark.radToDeg(Math.atan2(this.m.r.y, this.m.r.x));
};

// Convert an <x,y> pair (array) from local space to world space.
spark.Pivot.prototype.localToWorld = function(p) {
  return this.m.vtransform(p);
};

// Convery a world <x,y> pair into local space.
spark.Pivot.prototype.worldToLocal = function(p) {
  return this.m.inverse.vtransform(p);
};

// Convert a local-space angle (in degrees) to a world-space angle.
spark.Pivot.prototype.localToWorldAngle = function(angle) {
  return angle + this.angle();
};

// The image is any texture class, and frame is optional.
spark.Sprite.prototype.setImage = function(image, frame) {
  this.image = image;
  this.frame = frame;
};

// Tell the sprite to play an animation.
spark.Sprite.prototype.animate = function(frames, fps, loop) {
  // TODO:
};

// Append a new behavior to a sprite.
spark.Sprite.prototype.addBehavior = function(behavior) {
  this.behaviors.push(behavior);
};

// Add a collision callback to the entity.
spark.Sprite.prototype.addCollider = function(filter, oncollision) {
  var collider = new spark.Collider(this, filter, oncollision);

  // Track the new collider.
  this.colliders.push(collider);

  return collider;
};

// Called once per frame to update the world space transforms on colliders.
spark.Sprite.prototype.updateShapeColliders = function() {
  for(var i = 0;i < this.colliders.length;i++) {
    this.colliders[i].updateShapes(this.m);
  }
};

// Called once per frame to advance the gameplay simulation.
spark.Sprite.prototype.update = function() {
  for(var i = 0;i < this.behaviors.length;i++) {
    this.behaviors[i].call(this);
  }

  // Update all the collision shapes.
  this.updateShapeColliders();
};

// Called once per frame to render.
spark.Sprite.prototype.draw = function() {
  if (this.image === undefined) {
    return;
  }

  // Set the color tint and alpha value for the sprite.
  gl.uniform4f(spark.currentShader.u.color, this.red, this.green, this.blue, this.alpha);

  // Set the world transform for this sprite.
  gl.uniformMatrix4fv(spark.currentShader.u.world, false, this.m.transform);

  // TODO: Set custom attributes and uniforms on the shader.

  // Render the sprite.
  this.image.blit(this.frame);
};
