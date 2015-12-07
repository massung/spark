// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.layer;

import spark.collision.*;

class TilemapLayer implements Layer {
  // TODO:

  public function update(step: Float) {
    // TODO:
  }

  // called once per frame to add collision shapes to spacial hash
  public function updateCollision(space: Quadtree) {
    // TODO:
  }

  // called once per frame to render
  public function draw() {
    // TODO:
  }

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats) {
    stats.layers++;
  }
}
