// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.collision.*;

interface Layer {

  public function update(step: Float): Void;

  // called once per frame to add collision shapes to spacial hash
  public function updateCollision(space: Quadtree): Void;

  // called once per frame to render
  public function draw(): Void;

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats): Void;
}
