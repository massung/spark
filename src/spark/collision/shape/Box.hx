// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

class Box extends Shape {

  // local space corner points
  private var p1: Vec;
  private var p2: Vec;
  private var p3: Vec;
  private var p4: Vec;

  // transformed axis-aligned bounding box
  private var tp1: Vec;
  private var tp2: Vec;

  // create a new line segment collision shape
  public function new(body: Body, x: Float, y: Float, w: Float, h: Float) {
    super(body);

    // create the 4 corners of the box
    this.p1 = new Vec(x,     y);
    this.p2 = new Vec(x + w, y);
    this.p3 = new Vec(x,     y + h);
    this.p4 = new Vec(x + w, y + h);

    // create new world transforms
    this.tp1 = new Vec(x,     y);
    this.tp2 = new Vec(x + w, y + h);
  }

  // returns the world-space, corner vertices
  public function getTopLeft(): Vec return this.tp1;
  public function getBottomRight(): Vec return this.tp2;

  // true if this shape is completely within a bounding box
  override public function within(rect: Rect): Bool {
    if (this.tp2.x < rect.getLeft()) return false;
    if (this.tp1.x > rect.getRight()) return false;
    if (this.tp2.y < rect.getBottom()) return false;
    if (this.tp1.y > rect.getTop()) return false;

    return true;
  }

  // update the world vertices
  override public function updateShapeCache(m: Mat) {
    var v1 = m.transform(this.p1);
    var v2 = m.transform(this.p2);
    var v3 = m.transform(this.p3);
    var v4 = m.transform(this.p4);

    // find the extents of each vertex
    this.tp1.x = Math.min(Math.min(Math.min(v1.x, v2.x), v3.x), v4.x);
    this.tp1.y = Math.min(Math.min(Math.min(v1.y, v2.y), v3.y), v4.y);
    this.tp2.x = Math.max(Math.max(Math.max(v1.x, v2.x), v3.x), v4.x);
    this.tp2.y = Math.max(Math.max(Math.max(v1.y, v2.y), v3.y), v4.y);
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
    var tp1 = s.getTopLeft();
    var tp2 = s.getBottomRight();

    if (this.tp2.x < tp1.x || this.tp1.x > tp2.x) return false;
    if (this.tp2.y < tp1.y || this.tp1.y > tp2.y) return false;

    return true;
  }

  // debug render the shape
  override public function draw() {
    Spark.view.strokeStyle = '#ff0';
    Spark.view.beginPath();

    // draw the axis-aligned quad
    Spark.view.moveTo(this.tp1.x, this.tp1.y);
    Spark.view.lineTo(this.tp2.x, this.tp1.y);
    Spark.view.lineTo(this.tp2.x, this.tp2.y);
    Spark.view.lineTo(this.tp1.x, this.tp2.y);

    // done
    Spark.view.closePath();
    Spark.view.stroke();
  }
}
