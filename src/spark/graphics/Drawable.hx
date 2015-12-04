// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

interface Drawable {
  public var contextSettings: Dynamic;

  // render this thing to the viewport
  public function draw(): Void;
}
