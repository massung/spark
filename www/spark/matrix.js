/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec');

// A matrix.
spark.Mat = function(x, y, angle, sx, sy) {
  this.p = [x || 0.0, y || 0.0];

  // Set the rotation vector.
  if (angle !== undefined) {
    var rads = spark.util.degToRad(angle);

    // Compute the rotation vector.
    this.r = [Math.cos(rads), Math.sin(rads)];
  } else {
    this.r = spark.vec.RIGHT;
  }

  // Set the scale vector.
  this.s = [sx || 1.0, sy || sx || 1.0];
},

// Set constructors.
spark.Mat.prototype.constructor = spark.Mat;

// <1,0,0,1,0,0> identity matrix.
spark.Mat.__defineGetter__('IDENTITY', function() {
  return new spark.Mat();
});

// A 4x4 matrix for use with gl.uniformMatrix4fv().
spark.Mat.prototype.__defineGetter__('transform', function() {
  return new Float32Array([
    this.r.x * this.s.x, -this.r.y * this.s.y, 0.0, 0.0,
    this.r.y * this.s.x,  this.r.x * this.s.y, 0.0, 0.0,
                    0.0,                  0.0, 1.0, 0.0,
               this.p.x,             this.p.y, 0.0, 1.0]);
});

// Matrix inverse.
spark.Mat.prototype.inverse = function() {
  var m = new spark.Mat(-this.p.x, -this.p.y, undefined, 1 / this.s.x, 1 / this.s.y);

  // Transpose the rotation.
  m.r.x = this.r.x;
  m.r.y = -this.r.y;

  return m;
};

// Set the absolute translation of a sprite.
spark.Mat.prototype.setPosition = function(x, y) {
  this.p = [x, y];
};

// Set the absolute rotation of a sprite.
spark.Mat.prototype.setRotation = function(angle) {
  var rads = spark.util.degToRad(angle);
  this.r = [Math.cos(rads), Math.sin(rads)];
};

// Set the absolute scale of a sprite.
spark.Mat.prototype.setScale = function(x, y) {
  this.s = [x || 1.0, y || x || 1.0];
};

// Translate a pivot entity.
spark.Mat.prototype.translate = function(v, local) {
  if (local) {
    v = spark.vrotate(v, this.r);
  }

  // Update the translation vector.
  this.p.x += v.x;
  this.p.y += v.y;
};

// Turn a pivot entity. Positive angle = clockwise.
spark.Mat.prototype.rotate = function(angle) {
  var r = spark.util.degToRad(angle);
  this.r = spark.vrotate(this.r, [Math.cos(r), Math.sin(r)]);
};

// Adjust the scale of a pivot entity.
spark.Mat.prototype.scale = function(x, y) {
  this.s.x += x || 1.0;
  this.s.y += y || x || 1.0;
};

// Return the angle of rotation (in degrees). This is slow!
spark.Mat.prototype.angle = function() {
  return spark.util.radToDeg(Math.atan2(this.r.y, this.r.x));
};

// Transform a vector by this.
spark.Mat.prototype.vtransform = function(v) {
  return spark.vadd(spark.vrotate(spark.vmult(v, this.s), this.r), this.p);
};
