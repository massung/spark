// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.math;

@:expose
class Rect {
  private var x: Float;
  private var y: Float;
  private var width: Float;
  private var height: Float;

  // create a new axis-aligned bounding box
  public function new(x: Float, y: Float, w: Float, h: Float) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  // true if a point is within the bounding box
  public function contains(x: Float, y: Float): Bool {
    return (x >= this.x && x <= this.x + this.width) &&
           (y >= this.y && y <= this.y + this.height);
  }

  // return the bounds of the rectangle
  public function getLeft(): Float return this.x;
  public function getTop(): Float return this.y;
  public function getRight(): Float return this.x + this.width;
  public function getBottom(): Float return this.y + this.height;
  public function getWidth(): Float return this.width;
  public function getHeight(): Float return this.height;
}
