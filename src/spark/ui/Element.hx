// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.ui;

import spark.anim.*;

class Element {

  // position and size of the element
  private var x: Float;
  private var y: Float;

  // create a new UI element
  public function new() {
    this.x = 0;
    this.y = 0;
  }

  // called once per frame to render the element
  public function draw() {
    // subclass responsibility
  }
}
