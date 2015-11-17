/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.util');

// Create accessors for <x,y> of array pairs.
Array.prototype.__defineGetter__('x', function() {
  return this[0];
});

Array.prototype.__defineGetter__('y', function() {
  return this[1];
});

Array.prototype.__defineSetter__('x', function(x) {
  return this[0] = x;
});

Array.prototype.__defineSetter__('y', function(y) {
  return this[1] = y;
});

// <0,0> zero vector.
__MODULE__.__defineGetter__('ZERO', function() {
  return [0, 0];
});

// <1,1> uniform vector.
__MODULE__.__defineGetter__('ONE', function() {
  return [1, 1];
});

// <1,0> right vector.
__MODULE__.__defineGetter__('RIGHT', function() {
  return [1, 0];
});

// <0,1> up vector.
__MODULE__.__defineGetter__('UP', function() {
  return [0, 1];
});

// <1,0,0,1,0,0> identity matrix.
__MODULE__.__defineGetter__('IDENTITY', function() {
  return new spark.vec.Mat();
});

// Add two vectors.
__MODULE__.vadd = function(a, b) {
  return [a.x + b.x, a.y + b.y];
};

// Subtract two vectors.
__MODULE__.vsub = function(a, b) {
  return [a.x - b.x, a.y - b.y];
};

// Negate a vector.
__MODULE__.vneg = function(v) {
  return [-v.x, -v.y];
};

// Invert a vector.
__MODULE__.vinv = function(v) {
  return [1 / v.x, 1 / v.y];
};

// Dot product of two vectors.
__MODULE__.vdot = function(a, b) {
  return (a.x * b.x) + (a.y * b.y);
};

// Cross product of two vectors.
__MODULE__.vcross = function(a, b) {
  return (a.x * b.y) - (a.y * b.x);
};

// Magnitude of a vector squared.
__MODULE__.vmagsq = function(v) {
  return (v.x * v.x) + (v.y * v.y);
};

// Magnitude of a vector.
__MODULE__.vmag = function(v) {
  return Math.sqrt((v.x * v.x) + (v.y * v.y));
};

// Distance squared between two vectors.
__MODULE__.vdistsq = function(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;

  return (dx * dx) + (dy * dy);
};

// Distance between two vectors.
__MODULE__.vdist = function(a, b) {
  return Math.sqrt(spark.vec.vdistsq(a, b));
};

// Multiple a vector by a scalar.
__MODULE__.vscale = function(v, s) {
  return [v.x * s, v.y * s];
};

// Multiply two vectors.
__MODULE__.vmult = function(a, b) {
  return [a.x * b.x, a.y * b.y];
};

// Divide two vectors.
__MODULE__.vimult = function(a, b) {
  return [a.x / b.x, a.y / b.y];
};

// Normalize a vector.
__MODULE__.vnorm = function(v) {
  return spark.vec.vscale(spark.vmag(v));
};

// Project vector p0->p1 (a) onto p0->p2 (b).
__MODULE__.vproj = function(p0, p1, p2) {
  var a = spark.vec.vsub(p1, p0);
  var b = spark.vec.vsub(p2, p0);
  var p = spark.vec.vdot(a, b);
  var d = spark.vec.vmagsq(b);

  if (d < 0.0001) {
    return b;
  } else {
    var s = p / d;

    // The point is at the extents of p0->p2.
    if (s < 0.0) return p0;
    if (s > 1.0) return p2;

    // The point is somewhere along p0->p2.
    return [p0.x + (b.x * s), p0.y + (b.y * s)];
  }
};

// Return the left-handed normal of a vector.
__MODULE__.vperp = function(v) {
  return [v.y, -v.x];
};

// Return the right-handed normal of a vector.
__MODULE__.vrperp = function(v) {
  return [-v.y, v.x];
};

// Rotate a vector.
__MODULE__.vrotate = function(v, r) {
  return [(v.x * r.x) + (v.y * r.y), (v.y * r.x) - (v.x * r.y)];
};

// Unrotate a vector.
__MODULE__.vunrotate = function(v, r) {
  return [(v.x * r.x) - (v.y * r.y), (v.y * r.x) + (v.x * r.y)];
};

// Linearly interpolate along p->q by k [0,1].
__MODULE__.vlerp = function(p, q, k) {
  return [p.x + ((q.x - p.x) * k), p.y + ((q.y - p.y) * k)];
};

// A matrix.
__MODULE__.Mat = function(x, y, angle, sx, sy) {
  this.p = [x || 0.0, y || 0.0];

  // Set the rotation vector.
  if (angle !== undefined) {
    var rads = spark.util.degToRad(angle);

    // Compute the rotation vector.
    this.r = [Math.cos(rads), Math.sin(rads)];
  } else {
    this.r = [1.0, 0.0];
  }

  // Set the scale vector.
  this.s = [sx || 1.0, sy || sx || 1.0];

  // Allocate an array for the view transform.
  this.t = new Array(6);
},

// Set constructors.
__MODULE__.Mat.prototype.constructor = spark.Mat;

// A matrix for use with context.setTransform().
__MODULE__.Mat.prototype.__defineGetter__('transform', function() {
  this.t[0] =  this.r.x * this.s.x;
  this.t[1] = -this.r.y * this.s.y;
  this.t[2] =  this.r.y * this.s.x;
  this.t[3] =  this.r.x * this.s.y;
  this.t[4] =  this.p.x;
  this.t[5] =  this.p.y;

  return this.t;
});

// Matrix inverse.
__MODULE__.Mat.prototype.__defineGetter__('inverse', function() {
  var m = new spark.vec.Mat(-this.p.x, -this.p.y, undefined, 1 / this.s.x, 1 / this.s.y);

  // Transpose the rotation.
  m.r.x = this.r.x;
  m.r.y = -this.r.y;

  return m;
});

// Return the angle of rotation (in degrees). This is slow!
__MODULE__.Mat.prototype.__defineGetter__('angle', function() {
  return spark.util.radToDeg(Math.atan2(this.r.y, this.r.x));
});

// Set the angle of rotation.
__MODULE__.Mat.prototype.__defineSetter__('angle', function(angle) {
  var rads = spark.util.degToRad(angle);

  // Unit vector.
  this.r.x = Math.cos(rads);
  this.r.y = Math.sin(rads);
});

// Set the absolute translation of a sprite.
__MODULE__.Mat.prototype.setTranslation = function(x, y) {
  this.p.x = x;
  this.p.y = y;
};

// Set the absolute rotation of a sprite. Function for angle setter.
__MODULE__.Mat.prototype.setRotation = function(angle) {
  this.angle = angle;
};

// Set the absolute scale of a sprite.
__MODULE__.Mat.prototype.setScale = function(x, y) {
  this.s.x = x || 1.0;
  this.s.y = y || x || 1.0;
};

// Translate a pivot entity.
__MODULE__.Mat.prototype.translate = function(v, local) {
  if (local) {
    v = spark.vec.vrotate(v, this.r);
  }

  // Update the translation vector.
  this.p.x += v.x;
  this.p.y += v.y;
};

// Turn a pivot entity. Positive angle = clockwise.
__MODULE__.Mat.prototype.rotate = function(angle) {
  var r = spark.util.degToRad(angle);

  // Rotate and clone.
  this.r = spark.vec.vrotate(this.r, [Math.cos(r), Math.sin(r)]);
};

// Adjust the scale of a pivot entity.
__MODULE__.Mat.prototype.scale = function(x, y) {
  this.s.x += x || 1.0;
  this.s.y += y || x || 1.0;
};

// Force to look at a given point.
__MODULE__.Mat.prototype.lookAt = function(p, forwardAngle) {
  var r = spark.util.degToRad(forwardAngle || 0.0);
  var angle = Math.atan2(p.y - this.p.y, this.p.x - p.x) + r;

  // Hard set the rotation.
  this.r.x = Math.cos(angle);
  this.r.y = Math.sin(angle);
};

// Apply another matrix and return the new one.
__MODULE__.Mat.prototype.mult = function(m) {
  var w = new spark.vec.Mat();

  w.p = spark.vec.vadd(this.p, m.p);
  w.r = spark.vec.vrotate(this.r, m.r);
  w.s = spark.vec.vmult(this.s, m.s);

  return w;
};

// Transform a vector by this matrix.
__MODULE__.Mat.prototype.vtransform = function(v) {
  var x = (v.x * this.s.x * this.r.x) + (v.y * this.s.y * this.r.y);
  var y = (v.y * this.s.y * this.r.x) - (v.x * this.s.x * this.r.y);

  // Apply translation last.
  return [x + this.p.x, y + this.p.y];
};
