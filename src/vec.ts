// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // 2d vector
  export class Vec {
    x: number;
    y: number;

    // global vectors
    static ZERO: Vec = new Vec(0, 0);
    static ONE: Vec = new Vec(1, 1);
    static RIGHT: Vec = new Vec(1, 0);
    static UP: Vec = new Vec(0, 1);

    // create a new vector
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    // simple assignment
    set(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    // add a vector to this
    add(v: Vec): Vec {
      return new Vec(this.x + v.x, this.y + v.y);
    }

    // subtract a vector from this
    sub(v: Vec): Vec {
      return new Vec(this.x - v.x, this.y - v.y);
    }

    // multiply a vector to this
    mult(v: Vec): Vec {
      return new Vec(this.x * v.x, this.y * v.y);
    }

    // multiply this by an inverse vector
    imult(v: Vec): Vec {
      return new Vec(this.x / v.x, this.y / v.y);
    }

    // multiply this by a scalar
    scale(s: number): Vec {
      return new Vec(this.x * s, this.y * s);
    }

    // negate this vector
    neg(): Vec {
      return new Vec(-this.x, -this.y);
    }

    // invert this vector
    inv(): Vec {
      return new Vec(1 / this.x, 1 / this.y);
    }

    // returns the dot product of this and a vector
    dot(v: Vec): number {
      return (this.x * v.x) + (this.y * v.y);
    }

    // returns the cross product of this and a vector
    cross(v: Vec): number {
      return (this.x * v.y) - (this.y * v.x);
    }

    // the magnitude squared of this
    magsq(): number {
      return (this.x * this.x) + (this.y * this.y);
    }

    // the magnitude of this
    mag(): number {
      return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    // distance squared from this to another vector
    distsq(v: Vec): number {
      var dx = this.x - v.x;
      var dy = this.y - v.y;

      return (dx * dx) + (dy * dy);
    }

    // the distance from this to another vector
    dist(v: Vec): number {
      return Math.sqrt(this.magsq());
    }

    // normalize this
    norm(): Vec {
      return this.scale(1.0 / this.mag());
    }

    // linearly interpolate from this to a vector
    lerp(v: Vec, k: number): Vec {
      return new Vec(this.x + (v.x - this.x) * k, this.y + (v.y - this.y) * k);
    }

    // project this vector onto a line segment
    proj(p: Vec, q: Vec): Vec {
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
    perp(): Vec {
      return new Vec(this.y, -this.x);
    }

    // right-handed perpendicular
    rperp(): Vec {
      return new Vec(-this.y, this.x);
    }

    // rotate this vector by a rotation vector
    rotate(r: Vec): Vec {
      return new Vec((this.x * r.x) + (this.y * r.y), (this.y * r.x) - (this.x * r.y));
    }

    // inverse rotation of this by a rotation vector
    unrotate(r: Vec): Vec {
      return new Vec((this.x * r.x) - (this.y * r.y), (this.y * r.x) + (this.x * r.y));
    }
  }
}
