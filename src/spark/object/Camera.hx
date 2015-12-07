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

  // set the world to camera (<-1,-1> - <+1,+1>) to transform
  public function applyProjection() {
    Spark.view.scale(1 / this.m.s.x, 1 / this.m.s.y);
    Spark.view.transform(this.m.r.x, -this.m.r.y, this.m.r.y, this.m.r.x, 0, 0);
    Spark.view.translate(-this.m.p.x, -this.m.p.y);
  }
}
