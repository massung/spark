// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.anim.*;
import spark.collision.*;
import spark.graphics.*;

class Camera extends Actor {
  // TODO:

  // create a new camera object, which is not on any layer
  public function new(width: Float, height: Float) {
    super();

    // initialize the scale from the viewport size
    this.m.s.set(width / 2, height / 2);
  }
}
