// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

@:allow(spark.collision.shape)
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
    super.updateShapeCache(m);

    // transform center
    this.tc = m.transform(this.c);
  }

  // true if this shape overlaps a line segment
  override public function segmentQuery(s: Segment): Bool {
    return s.circleQuery(this);
  }

  // true if this shape overlaps a circle
  override public function circleQuery(s: Circle): Bool {
    return this.tc.distsq(s.tc) < (this.r * this.r) + (s.r * s.r);
  }

  // true if this shape overlaps a box
  override public function boxQuery(s: Box): Bool {
    var c = s.m.untransform(this.tc);

    // is it within the box horizontally?
    if (c.x >= s.p1.x && c.x <= s.p3.x) {
      return c.y + this.r >= s.p1.y && c.y - this.r <= s.p3.y;
    }

    // is it within the box vertically?
    if (c.y >= s.p1.y && c.y <= s.p3.y) {
      return c.x + this.r >= s.p1.x && c.x - this.r <= s.p3.x;
    }

    // above and to the left?
    if (c.x < s.p1.x && c.y < s.p1.y) {
      return c.distsq(s.p1) <= this.r * this.r;
    }

    // above and to the right?
    if (c.x > s.p2.x && c.y < s.p2.y) {
      return c.distsq(s.p2) <= this.r * this.r;
    }

    // below and to the right?
    if (c.x > s.p3.x && c.y > s.p3.y) {
      return c.distsq(s.p3) <= this.r * this.r;
    }

    // below and to the left?
    if (c.x < s.p4.x && c.y > s.p4.y) {
      return c.distsq(s.p4) <= this.r * this.r;
    }

    return false;
  }

  // debug render the shape
  override public function draw() {
    Spark.view.strokeStyle = '#ff0';
    Spark.view.beginPath();

    // draw the circle
    Spark.view.arc(this.tc.x, this.tc.y, this.r, 0, 360);

    // done
    Spark.view.stroke();
  }
}
