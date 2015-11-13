/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.vec = spark.module().requires('spark.util');

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
spark.vec.__defineGetter__('ZERO', function() {
  return new Array(0.0, 0.0);
});

// <1,1> uniform vector.
spark.vec.__defineGetter__('ONE', function() {
  return new Array(1.0, 1.0);
});

// <1,0> right vector.
spark.vec.__defineGetter__('RIGHT', function() {
  return new Array(1.0, 0.0);
});

// <0,1> up vector.
spark.vec.__defineGetter__('UP', function() {
  return new Array(0.0, 1.0);
});

// Add two vectors.
spark.vadd = function(a, b) {
  return [a.x + b.x, a.y + b.y];
};

// Subtract two vectors.
spark.vsub = function(a, b) {
  return [a.x - b.x, a.y - b.y];
};

// Negate a vector.
spark.vneg = function(v) {
  return [-v.x, -v.y];
};

// Invert a vector.
spark.vinv = function(v) {
  return [1 / v.x, 1 / v.y];
};

// Dot product of two vectors.
spark.vdot = function(a, b) {
  return (a.x * b.x) + (a.y * b.y);
};

// Cross product of two vectors.
spark.vcross = function(a, b) {
  return (a.x * b.y) - (a.y * b.x);
};

// Magnitude of a vector squared.
spark.vmagsq = function(v) {
  return (v.x * v.x) + (v.y * v.y);
};

// Magnitude of a vector.
spark.vmag = function(v) {
  return Math.sqrt((v.x * v.x) + (v.y * v.y));
};

// Distance squared between two vectors.
spark.vdistsq = function(a, b) {
  return spark.vmagsq(spark.vsub(a, b));
};

// Distance between two vectors.
spark.vdist = function(a, b) {
  return spark.vmag(spark.vsub(a, b));
};

// Multiple a vector by a scalar.
spark.vscale = function(v, s) {
  return [v.x * s, v.y * s];
};

// Multiply two vectors.
spark.vmult = function(a, b) {
  return [a.x * b.x, a.y * b.y];
};

// Divide two vectors.
spark.vimult = function(a, b) {
  return [a.x / b.x, a.y / b.y];
};

// Normalize a vector.
spark.vnorm = function(v) {
  return spark.vscale(spark.vmag(v));
};

// Project vector p0->p1 (a) onto p0->p2 (b).
spark.vproj = function(p0, p1, p2) {
  var a = spark.vsub(p1, p0);
  var b = spark.vsub(p2, p0);
  var p = spark.vdot(a, b);
  var d = spark.vmagsq(b);

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
spark.vperp = function(v) {
  return [v.y, -v.x];
};

// Return the right-handed normal of a vector.
spark.vrperp = function(v) {
  return [-v.y, v.x];
};

// Rotate a vector.
spark.vrotate = function(v, r) {
  return [(v.x * r.x) + (v.y * r.y), (v.y * r.x) - (v.x * r.y)];
};

// Unrotate a vector.
spark.vunrotate = function(v, r) {
  return [(v.x * r.x) - (v.y * r.y), (v.y * r.x) + (v.x * r.y)];
};

// Linearly interpolate along p->q by k [0,1].
spark.vlerp = function(p, q, k) {
  return spark.vadd(spark.vscale(p, k - 1.0), spark.vscale(q, k));
};
