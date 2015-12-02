// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

class Shape {
  private var body: Body;

  // create a new collision shape
  public function new(body: Body) {
    this.body = body;
  }

  // the rigid body this shape is attached to
  public function getBody(): Body return this.body;

  // true if two shapes can collide (different bodies and filters)
  public function canCollideWidth(s: Shape): Bool {
    return this.body != s.body || this.body.getFilter() != s.body.getFilter();
  }

  // true if this shape is completely within a bounding box
  public function within(rect: Rect): Bool return false;

  // update the world vertices
  public function updateShapeCache(m: Mat) {
    // TODO:
  }

  // collision queries
  public function segmentQuery(s: spark.collision.shape.Segment): Bool return false;
  public function circleQuery(s: spark.collision.shape.Circle): Bool return false;
  public function boxQuery(s: spark.collision.shape.Box): Bool return false;
}
