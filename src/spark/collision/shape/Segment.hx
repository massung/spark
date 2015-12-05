// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

@:allow(spark.collision.shape)
class Segment extends Shape {
  private var p1: Vec;
  private var p2: Vec;

  // transformed world vertices
  private var tp: Array<Vec>;
  private var tn: Array<Vec>;

  // create a new line segment collision shape
  public function new(body: Body, x1: Float, y1: Float, x2: Float, y2: Float) {
    super(body);

    // create the end points
    this.p1 = new Vec(x1, y1);
    this.p2 = new Vec(x2, y2);

    // create world transform copies
    this.tp = [this.p1.copy(), this.p2.copy()];
    this.tn = [this.p2.sub(this.p1).perp()];
  }

  // true if this shape is completely within a bounding box
  override public function within(rect: Rect): Bool {
    return rect.contains(this.tp[0].x, this.tp[0].y) &&
           rect.contains(this.tp[1].x, this.tp[1].y);
  }

  // update the world vertices
  override public function updateShapeCache(m: Mat) {
    super.updateShapeCache(m);

    // transform end-points
    this.tp[0] = m.transform(this.p1);
    this.tp[1] = m.transform(this.p2);

    // calculate the normal of the segment
    this.tn[0] = this.tp[1].sub(this.tp[0]).perp();
  }

  // true if this shape overlaps a line segment
  override public function segmentQuery(s: Segment): Bool {
    return SeparatingAxis.query(this.tp, this.tn, s.tp, s.tn);
  }

  // true if this shape overlaps a circle
  override public function circleQuery(s: Circle): Bool {
    return s.tc.proj(this.tp[0], this.tp[1]).distsq(s.tc) < s.r * s.r;
  }

  // true if this shape overlaps a box
  override public function boxQuery(s: Box): Bool {
    return SeparatingAxis.query(this.tp, this.tn, s.tp, s.tn);
  }

  // debug render the shape
  override public function draw() {
    Spark.view.strokeStyle = '#ff0';
    Spark.view.beginPath();

    // draw the segment
    Spark.view.moveTo(this.tp[0].x, this.tp[0].y);
    Spark.view.lineTo(this.tp[1].x, this.tp[1].y);

    // done
    Spark.view.stroke();
  }
}
