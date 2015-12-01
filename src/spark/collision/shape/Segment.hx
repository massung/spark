// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision.shape;

class Segment implements Shape {
  private var body: Body;

  // local space end-points
  private var p1: Vec;
  private var p2: Vec;

  // transformed world vertices
  private var tp1: Vec;
  private var tp2: Vec;

  // create a new line segment collision shape
  public function new(body: spark.collision.Body, x1: Float, y1: Float, x2: Float, y2: Float) {
    this.body = body;

    // create the end points
    this.p1 = new Vec(x1, y1);
    this.p2 = new Vec(x2, y2);
  }

  // the rigid body this shape is attached to
  public function getBody(): spark.collision.Body return this.body;

  // returns the world-space, end points
  public function getStart(): Vec return this.tp1;
  public function getEnd(): Vec return this.tp2;

  // true if this shape is completely within a bounding box
  public function within(rect: Rect): Bool {
    return rect.contains(this.tp1.x, this.tp1.y) &&
           rect.contains(this.tp2.x, this.tp2.y);
  }

  // update the world vertices
  public function updateShapeCache(m: Mat) {
    this.tp1 = m.transform(this.p1);
    this.tp2 = m.transform(this.p2);
  }

  // true if this shape overlaps a line segment
  public function segmentQuery(s: Segment): Bool {
    if (Math.min(s.tp1.x, s.tp2.x) > Math.max(this.tp1.x, this.tp2.x) ||
        Math.min(s.tp1.y, s.tp2.y) > Math.max(this.tp1.y, this.tp2.y) ||
        Math.max(s.tp1.x, s.tp2.x) < Math.min(this.tp1.x, this.tp2.x) ||
        Math.max(s.tp1.y, s.tp2.y) < Math.min(this.tp1.y, this.tp2.y)) {
          return false;
    }

    var sa = Util.sign(this.tp1.cross(s.tp1));
    var sb = Util.sign(this.tp1.cross(s.tp2));

    // each point must be on opposite sides of the shape
    if (sa == sb && sa != 0 && sb != 0) {
      return false;
    }

    var da = Util.sign(s.tp1.cross(this.tp1));
    var db = Util.sign(s.tp1.cross(this.tp2));

    // each point of this segment must be on opposite sides of the shape
    if (da == db && da != 0 && db != 0) {
      return false;
    }

    return true;
  }

  // true if this shape overlaps a circle
  public function circleQuery(s: Circle): Bool {
    return s.segmentQuery(this);
  }

  // true if this shape overlaps a box
  public function boxQuery(s: Box): Bool {
    var tp1 = s.getTopLeft();
    var tp2 = s.getBottomRight();

    // if both points are on the same side, fail
    if (this.tp1.x < tp1.x && this.tp2.x < tp1.x) return false;
    if (this.tp1.x > tp2.x && this.tp2.x > tp2.x) return false;
    if (this.tp1.y < tp1.y && this.tp2.y < tp1.y) return false;
    if (this.tp1.y > tp2.y && this.tp2.y > tp2.y) return false;

    return true;
  }
}