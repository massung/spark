// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.collision.*;
import spark.graphics.*;

class Layer extends Actor {
  public var z: Float;

  // create a new layer
  public function new(?z: Float = 0.0) {
    super();

    // initialize properties
    this.z = z;
  }

  // called once per frame to add collision shapes to spacial hash
  public function updateCollision(space: Quadtree) {
    // subclass responsibility
  }

  // called once per frame to render
  public override function draw() {
    // subclass responsibility
  }

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats) {
    stats.layers++;
  }
}
