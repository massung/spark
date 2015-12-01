// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

interface Shape {

  // the rigid body this shape is attached to
  public function getBody(): Body;

  // true if this shape is completely within a bounding box
  public function within(rect: Rect): Bool;

  // transform local points and normals into world space
  public function updateShapeCache(m: Mat): Void;

  // true if this shape overlaps another shape
  public function segmentQuery(shape: spark.collision.shape.Segment): Bool;
  public function circleQuery(shape: spark.collision.shape.Circle): Bool;
  public function boxQuery(shape: spark.collision.shape.Box): Bool;
}
