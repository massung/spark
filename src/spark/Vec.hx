// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Vec {
  public var x: Float;
  public var y: Float;

  // create constant vectors
  static public function zero(): Vec return new Vec(0, 0);
  static public function one(): Vec return new Vec(1, 1);
  static public function right(): Vec return new Vec(1, 0);
  static public function up(): Vec return new Vec(0, 1);

  // create a new 2d vector
  public function new(x: Float, y: Float) {
    this.x = x;
    this.y = y;
  }

  // create a vector in a given direction (degrees) and scale
  static public function axis(angle: Float, ?scale: Float = 1): Vec {
    var x = Math.cos(Util.degToRad(angle));
    var y = Math.sin(Util.degToRad(angle));

    return new Vec(x * scale, y * scale);
  }

  // returns a copy of this vector
  public function copy(): Vec {
    return new Vec(this.x, this.y);
  }

  // set the values of the vector
  public function set(x: Float, y: Float) {
    this.x = x;
    this.y = y;
  }

  // add a vector to this
  public function add(v: Vec): Vec {
    return new Vec(this.x + v.x, this.y + v.y);
  }

  // subtract a vector from this
  public function sub(v: Vec): Vec {
    return new Vec(this.x - v.x, this.y - v.y);
  }

  // multiply a vector to this
  public function mult(v: Vec): Vec {
    return new Vec(this.x * v.x, this.y * v.y);
  }

  // multiply this by an inverse vector
  public function imult(v: Vec): Vec {
    return new Vec(this.x / v.x, this.y / v.y);
  }

  // multiply this by a scalar
  public function scale(s: Float): Vec {
    return new Vec(this.x * s, this.y * s);
  }

  // negate this vector
  public function neg(): Vec {
    return new Vec(-this.x, -this.y);
  }

  // invert this vector
  public function inv(): Vec {
    return new Vec(1 / this.x, 1 / this.y);
  }

  // returns the dot product of this and a vector
  public function dot(v: Vec): Float {
    return (this.x * v.x) + (this.y * v.y);
  }

  // returns the cross product of this and a vector
  public function cross(v: Vec): Float {
    return (this.x * v.y) - (this.y * v.x);
  }

  // the magnitude squared of this
  public function magsq(): Float {
    return (this.x * this.x) + (this.y * this.y);
  }

  // the magnitude of this
  public function mag(): Float {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  // distance squared from this to another vector
  public function distsq(v: Vec): Float {
    var dx = this.x - v.x;
    var dy = this.y - v.y;

    return (dx * dx) + (dy * dy);
  }

  // the distance from this to another vector
  public function dist(v: Vec): Float {
    return Math.sqrt(this.magsq());
  }

  // normalize this
  public function norm(): Vec {
    return this.scale(1.0 / this.mag());
  }

  // linearly interpolate from this to a vector
  public function lerp(v: Vec, k: Float): Vec {
    return new Vec(this.x + (v.x - this.x) * k, this.y + (v.y - this.y) * k);
  }

  // project this vector onto a line segment
  public function proj(p: Vec, q: Vec): Vec {
    var a = this.sub(p);
    var b = q.sub(p);
    var k = a.dot(b);
    var d = b.magsq();

    if (d < 0.00001) {
      return b;
    } else {
      var s = k / d;

      // the point is at the extents of p0->p2.
      if (s < 0.0) return p;
      if (s > 1.0) return q;

      // the point is somewhere along p0->p2.
      return p.lerp(q, s);
    }
  }

  // left-handed perpendicular
  public function perp(): Vec {
    return new Vec(this.y, -this.x);
  }

  // right-handed perpendicular
  public function rperp(): Vec {
    return new Vec(-this.y, this.x);
  }

  // angle of the vector in degrees
  public function angle(): Float {
    return Util.radToDeg(Math.atan2(this.y, this.x));
  }

  // set to the unit vector of an angle in degrees
  public function setAngle(angle: Float) {
    this.x = Math.cos(Util.degToRad(angle));
    this.y = Math.sin(Util.degToRad(angle));
  }

  // rotate this vector by a rotation vector
  public function rotate(r: Vec): Vec {
    return new Vec((this.x * r.x) - (this.y * r.y), (this.y * r.x) + (this.x * r.y));
  }

  // inverse rotation of this by a rotation vector
  public function unrotate(r: Vec): Vec {
    return new Vec((this.x * r.x) + (this.y * r.y), (this.y * r.x) - (this.x * r.y));
  }
}
