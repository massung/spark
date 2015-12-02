// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Mat {
  public var p: Vec;
  public var r: Vec;
  public var s: Vec;

  // angle is a property for manipulating the rotation vector in degrees
  public var angle(get,set): Float;

  // returns a copy of the identity matrix
  static public function identity(): Mat return new Mat(0, 0, 1, 0, 1, 1);

  // create a new 3x3 matrix
  public function new(x: Float, y: Float, rx: Float, ry: Float, sx: Float, sy: Float) {
    this.p = new Vec( x,  y);
    this.r = new Vec(rx, ry);
    this.s = new Vec(sx, sy);
  }

  // return the inverse of the matrix
  public function inverse(): Mat {
    return new Mat(-this.p.x, -this.p.y, this.r.x, -this.r.y, 1 / this.s.x, 1 / this.s.y);
  }

  // return the angle of rotation in degrees
  public function get_angle(): Float {
    return Util.radToDeg(Math.atan2(this.r.y, this.r.x));
  }

  public function set_angle(a: Float): Float {
    this.r.x = Math.cos(Util.degToRad(a));
    this.r.y = Math.sin(Util.degToRad(a));

    return a;
  }

  // add the position vector
  public function translate(x: Float, y: Float, ?local: Bool = false) {
    var dx = x;
    var dy = y;

    if (local) {
      dx = (x * this.r.x) + (y * this.r.y);
      dy = (y * this.r.x) - (x * this.r.y);
    }

    this.p.x += dx;
    this.p.y += dy;
  }

  // rotate the rotation vector
  public function rotate(r: Float) {
    var x = Math.cos(Util.degToRad(r));
    var y = Math.sin(Util.degToRad(r));

    this.r.set((this.r.x * x) + (this.r.y * y), (this.r.y * x) - (this.r.x * y));
  }

  // multiply the scale vector
  public function scale(x: Float, ?y: Float) {
    this.s.x *= x;
    this.s.y *= (y == null) ? x : y;
  }

  // apply the matrix to a vector and return a new vector
  public function transform(v: Vec): Vec {
    var x = (v.x * this.s.x * this.r.x) + (v.y * this.s.y * this.r.y);
    var y = (v.y * this.s.y * this.r.x) - (v.x * this.s.x * this.r.y);

    return new Vec(x + this.p.x, y + this.p.y);
  }

  // multiply a matrix by this one and return the new matrix
  public function mult(m: Mat): Mat {
    var p = this.transform(m.p);
    var r = this.r.rotate(m.r);
    var s = this.s.mult(m.s);

    return new Mat(p.x, p.y, r.x, r.y, s.x, s.y);
  }

  // multiply the current view transform by this matrix
  public function apply() {
    var a = this.r.x * this.s.x;
    var b = this.r.y * this.s.y;
    var c = this.r.y * this.s.x;
    var d = this.r.x * this.s.y;
    var e = this.p.x;
    var f = this.p.y;

    Spark.view.transform(a, -b, c, d, e, f);
  }
}
