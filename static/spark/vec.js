/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({
  Mat: function(x, y, angle, sx, sy) {
    var t = (angle || 0.0) * Math.PI / 180.0;

    // Create a default position.
    this.p = [x || 0.0, y || 0.0];

    // Set the rotation vector.
    this.r = [Math.cos(t), Math.sin(t)];

    // Set the scale vector.
    this.s = [sx || 1.0, sy || sx || 1.0];
  },
});

// Set constructors.
__MODULE__.Mat.prototype.constructor = __MODULE__.Mat;

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

// Transform a vector by this.
__MODULE__.Mat.prototype.transform = function(v) {
  return spark.vec.vadd(spark.vec.vrotate(spark.vec.vmult(v, this.s), this.r), this.p);
};

// Transform a vector by the inverse of this matrix.
__MODULE__.Mat.prototype.transformInv = function(v) {
  return spark.vec.vmult(spark.vec.vunrotate(spark.vec.vsub(v, this.p), this.r), this.s);
};

// <0,0> zero vector.
__MODULE__.__defineGetter__('ZERO', function() {
  return new Array(0.0, 0.0);
});

// <1,1> uniform vector.
__MODULE__.__defineGetter__('ONE', function() {
  return new Array(1.0, 1.0);
});

// <1,0> right vector.
__MODULE__.__defineGetter__('RIGHT', function() {
  return new Array(1.0, 0.0);
});

// <0,1> up vector.
__MODULE__.__defineGetter__('UP', function() {
  return new Array(0.0, 1.0);
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
  return [1/v.x, 1/v.y];
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
  return spark.vec.vmagsq(spark.vec.vsub(a, b));
};

// Distance between two vectors.
__MODULE__.vdist = function(a, b) {
  return spark.vec.vmag(spark.vec.vsub(a, b));
};

// Multiple a vector by a scalar.
__MODULE__.vscale = function(v, s) {
  return [v.x * s, v.y * s];
};

// Multiply two vectors.
__MODULE__.vmult = function(a, b) {
  return [a.x * b.x, a.y * b.y];
};

// Normalize a vector.
__MODULE__.vnorm = function(v) {
  return spark.vec.vscale(spark.vec.vmag(v));
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
  return [(v.x * r.x) - (v.y * r.y), (v.y * r.x) + (v.x * r.y)];
};

// Unrotate a vector.
__MODULE__.vunrotate = function(v, r) {
  return [(v.x * r.x) + (v.y * r.y), (v.y * r.x) - (v.x * r.y)];
};

// Linearly interpolate along p->q by k [0,1].
__MODULE__.vlerp = function(p, q, k) {
  return spark.vec.vadd(spark.vec.vscale(p, k - 1.0), spark.vec.vscale(q, k));
};
