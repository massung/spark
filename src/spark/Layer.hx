// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.collision.*;
import spark.graphics.*;

interface Layer extends Drawable {
  public var z: Float;
  public var m: Mat;

  // called once per frame to simulate and render
  public function update(step: Float): Void;
  public function updateCollision(space: Quadtree): Void;

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats): Void;
}
