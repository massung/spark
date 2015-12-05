// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

@:allow(spark.collision.shape)
class Box extends Shape {

  // local space corner points
  private var p1: Vec;
  private var p2: Vec;
  private var p3: Vec;
  private var p4: Vec;

  // transformed world vertices and normals
  private var tp: Array<Vec>;
  private var tn: Array<Vec>;

  // create a new line segment collision shape
  public function new(body: Body, x: Float, y: Float, w: Float, h: Float) {
    super(body);

    // create the 4 corners of the box
    this.p1 = new Vec(x,     y);
    this.p2 = new Vec(x + w, y);
    this.p3 = new Vec(x + w, y + h);
    this.p4 = new Vec(x,     y + h);

    // create new world transforms
    this.tp = [
      this.p1.copy(),
      this.p2.copy(),
      this.p3.copy(),
      this.p4.copy(),
    ];

    // world normals
    this.tn = [
      spark.Vec.up(),
      spark.Vec.right(),
    ];
  }

  // true if this shape is completely within a bounding box
  override public function within(rect: Rect): Bool {
    if (!rect.contains(this.tp[0].x, this.tp[0].y)) return false;
    if (!rect.contains(this.tp[1].x, this.tp[1].y)) return false;
    if (!rect.contains(this.tp[2].x, this.tp[2].y)) return false;
    if (!rect.contains(this.tp[3].x, this.tp[3].y)) return false;

    return true;
  }

  // update the world vertices
  override public function updateShapeCache(m: Mat) {
    super.updateShapeCache(m);

    // transform corners
    this.tp[0] = m.transform(this.p1);
    this.tp[1] = m.transform(this.p2);
    this.tp[2] = m.transform(this.p3);
    this.tp[3] = m.transform(this.p4);

    // transform the normals
    this.tn[0] = spark.Vec.up().rotate(m.r);
    this.tn[1] = spark.Vec.right().rotate(m.r);
  }

  // true if this shape overlaps a line segment
  override public function segmentQuery(s: Segment): Bool {
    return s.boxQuery(this);
  }

  // true if this shape overlaps a circle
  override public function circleQuery(s: Circle): Bool {
    return s.boxQuery(this);
  }

  // true if this shape overlaps a box
  override public function boxQuery(s: Box): Bool {
    return SeparatingAxis.query(this.tp, this.tn, s.tp, s.tn);
  }

  // debug render the shape
  override public function draw() {
    Spark.view.strokeStyle = '#ff0';
    Spark.view.beginPath();

    // draw the axis-aligned quad
    Spark.view.moveTo(this.tp[0].x, this.tp[0].y);
    Spark.view.lineTo(this.tp[1].x, this.tp[1].y);
    Spark.view.lineTo(this.tp[2].x, this.tp[2].y);
    Spark.view.lineTo(this.tp[3].x, this.tp[3].y);

    // done
    Spark.view.closePath();
    Spark.view.stroke();
  }
}
