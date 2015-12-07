// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

interface Quad {
  public function getRect(): Rect;

  // function to draw the image to the view
  public function draw(): Void;
}
