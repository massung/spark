// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.collision.*;

class Layer extends Actor {

  // called once per frame to add collision shapes to spacial hash
  public function updateCollision(space: Quadtree) return;

  // called once per frame to render
  public function draw() return;

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats) {
    stats.layers++;
  }
}
