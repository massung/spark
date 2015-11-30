// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // 3x3 transformation matrix
  export class Mat {
    p: Vec;
    r: Vec;
    s: Vec;

    // global identity matrix
    static IDENTITY: Mat = new Mat(0, 0, 1, 0, 1, 1);

    // create a new transform matrix
    constructor(x: number, y: number, rx: number, ry: number, sx: number, sy: number) {
      this.p = new Vec(x, y);
      this.r = new Vec(rx, ry);
      this.s = new Vec(sx, sy);
    }

    // the rotation angle in degrees
    get angle(): number {
      return radToDeg(Math.atan2(this.r.y, this.r.x));
    }

    // set the rotation angle in degrees
    set angle(r: number) {
      this.r.x = Math.cos(degToRad(r));
      this.r.y = Math.sin(degToRad(r));
    }

    // returns the inverse transformation matrix
    get inverse(): Mat {
      return new Mat(-this.p.x, -this.p.y, this.r.x, -this.r.y, 1 / this.s.x, 1 / this.s.y);
    }

    // add the position vector
    translate(x: number, y: number, local?: boolean) {
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
    rotate(r: number) {
      var x = Math.cos(degToRad(r));
      var y = Math.sin(degToRad(r));

      this.r.set(
        (this.r.x * x) + (this.r.y * y),
        (this.r.y * x) - (this.r.x * y));
    }

    // multiply the scale vector
    scale(x: number, y?: number) {
      this.s.x *= (x || 1.0);
      this.s.y *= (y || x || 1.0);
    }

    // apply the matrix to a vector and return a new vector
    transform(v: Vec): Vec {
      return new Vec(
        (v.x * this.s.x * this.r.x) + (v.y * this.s.y * this.r.y),
        (v.y * this.s.y * this.r.x) - (v.x * this.s.x * this.r.y));
    }

    // multiply a matrix by this one and return the new matrix
    mult(m: Mat): Mat {
      var p = this.transform(m.p);
      var r = this.r.rotate(m.r);
      var s = this.s.mult(m.s);

      return new Mat(p.x, p.y, r.x, r.y, s.x, s.y);
    }

    // multiply the current view transform by this matrix
    apply() {
      var a = this.r.x * this.s.x;
      var b = this.r.y * this.s.y;
      var c = this.r.y * this.s.x;
      var d = this.r.x * this.s.y;
      var e = this.p.x;
      var f = this.p.y;

      view.transform(a, -b, c, d, e, f);
    }
  }
}
