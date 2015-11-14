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

// Cloning a vector so it's a unique instance.
Array.prototype.__defineGetter__('v', function() {
  return [this[0], this[1]];
});

// Create a giant vector pool to draw from.
var vpool = new Array(50000);
var vpooli = 0;

// Initialize the vector pool.
__MODULE__.init = function() {
  for(var i = 0;i < vpool.length;i++) {
    vpool[i] = [0, 0];
  }
};

// Allocate a new vector from the pool.
__MODULE__.v = function(x, y) {
  var v = vpool[vpooli++];

  // Wrap the ring.
  if (vpooli === vpool.length) {
    vpooli = 0;
  }

  // Set the array indices.
  v[0] = x;
  v[1] = y;

  return v;
};

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
  return spark.vec.v(a.x + b.x, a.y + b.y);
};

// Subtract two vectors.
__MODULE__.vsub = function(a, b) {
  return spark.vec.v(a.x - b.x, a.y - b.y);
};

// Negate a vector.
__MODULE__.vneg = function(v) {
  return spark.vec.v(-v.x, -v.y);
};

// Invert a vector.
__MODULE__.vinv = function(v) {
  return spark.vec.v(1 / v.x, 1 / v.y);
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
  return spark.vec.v(v.x * s, v.y * s);
};

// Multiply two vectors.
__MODULE__.vmult = function(a, b) {
  return spark.vec.v(a.x * b.x, a.y * b.y);
};

// Divide two vectors.
__MODULE__.vimult = function(a, b) {
  return spark.vec.v(a.x / b.x, a.y / b.y);
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
    return spark.vec.v(p0.x + (b.x * s), p0.y + (b.y * s));
  }
};

// Return the left-handed normal of a vector.
__MODULE__.vperp = function(v) {
  return spark.vec.v(v.y, -v.x);
};

// Return the right-handed normal of a vector.
__MODULE__.vrperp = function(v) {
  return spark.vec.v(-v.y, v.x);
};

// Rotate a vector.
__MODULE__.vrotate = function(v, r) {
  return spark.vec.v((v.x * r.x) + (v.y * r.y), (v.y * r.x) - (v.x * r.y));
};

// Unrotate a vector.
__MODULE__.vunrotate = function(v, r) {
  return spark.vec.v((v.x * r.x) - (v.y * r.y), (v.y * r.x) + (v.x * r.y));
};

// Linearly interpolate along p->q by k [0,1].
__MODULE__.vlerp = function(p, q, k) {
  return spark.vec.vadd(spark.vec.vscale(p, k - 1.0), spark.vec.vscale(q, k));
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

// Set the absolute translation of a sprite.
__MODULE__.Mat.prototype.setTranslation = function(x, y) {
  this.p.x = x;
  this.p.y = y;
};

// Set the absolute rotation of a sprite.
__MODULE__.Mat.prototype.setRotation = function(angle) {
  var rads = spark.util.degToRad(angle);

  // Unit vector.
  this.r.x = Math.cos(rads);
  this.r.y = Math.sin(rads);
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
  this.r = spark.vec.vrotate(this.r, [Math.cos(r), Math.sin(r)]).v;
};

// Adjust the scale of a pivot entity.
__MODULE__.Mat.prototype.scale = function(x, y) {
  this.s.x += x || 1.0;
  this.s.y += y || x || 1.0;
};

// Return the angle of rotation (in degrees). This is slow!
__MODULE__.Mat.prototype.angle = function() {
  return spark.util.radToDeg(Math.atan2(this.r.y, this.r.x));
};

// Transform a vector by this.
__MODULE__.Mat.prototype.vtransform = function(v) {
  return spark.vec.vadd(spark.vec.vrotate(spark.vec.vmult(v, this.s), this.r), this.p);
};
