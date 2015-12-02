// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

class Circle extends Shape {
  private var c: Vec;
  private var r: Float;

  // transformed world vertices
  private var tc: Vec;

  // create a new line segment collision shape
  public function new(body: Body, x: Float, y: Float, r: Float) {
    super(body);

    // create the center point
    this.c = new Vec(x, y);
    this.r = r;

    // create new world transform
    this.tc = c.copy();
  }

  // returns the world-space center and radius
  public function getCenter(): Vec return this.tc;
  public function getRadius(): Float return this.r;

  // true if this shape is completely within a bounding box
  override public function within(rect: Rect): Bool {
    if (this.tc.x + this.r < rect.getLeft()) return false;
    if (this.tc.x - this.r > rect.getRight()) return false;
    if (this.tc.y + this.r < rect.getTop()) return false;
    if (this.tc.y - this.r > rect.getBottom()) return false;

    return true;
  }

  // update the world vertices
  override public function updateShapeCache(m: Mat) {
    this.tc = m.transform(this.c);
  }

  // true if this shape overlaps a line segment
  override public function segmentQuery(s: Segment): Bool {
    return this.tc.proj(s.getStart(), s.getEnd()).distsq(this.tc) < this.r * this.r;
  }

  // true if this shape overlaps a circle
  override public function circleQuery(s: Circle): Bool {
    return this.tc.distsq(s.tc) < (this.r * this.r) + (s.r * s.r);
  }

  // true if this shape overlaps a box
  override public function boxQuery(s: Box): Bool {
    var tp1 = s.getTopLeft();
    var tp2 = s.getBottomRight();

    // circle is above, below, or inside
    if (this.tc.x > tp1.x && this.tc.x <= tp2.x) {
      return this.tc.y + this.r >= tp1.y && this.tc.y - this.r <= tp2.y;
    }

    // circle is left, right, or inside
    if (this.tc.y >= tp1.y && this.tc.y <= tp2.y) {
      return this.tc.x + this.r >= tp1.x && this.tc.x - this.r <= tp2.x;
    }

    // above and to the left of the box
    if (this.tc.x < tp1.x && this.tc.y < tp1.y) {
      return this.tc.distsq(tp1) <= this.r * this.r;
    }

    // above and to the right of the box
    if (this.tc.x > tp2.x && this.tc.y < tp1.y) {
      return this.tc.distsq(new Vec(tp2.x, tp1.y)) <= this.r * this.r;
    }

    // below and to the left of the box
    if (this.tc.x < tp1.x && this.tc.y > tp2.y) {
      return this.tc.distsq(new Vec(tp1.x, tp2.y)) <= this.r * this.r;
    }

    // below and to the right of the box
    return this.tc.distsq(tp2) <= this.r * this.r;
  }
}
