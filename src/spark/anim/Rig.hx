// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import spark.math.*;

// an animation is just a function that is called with a step and returns
// true once the animation has played to completion
//
typedef Anim = Float -> Bool;

// an object with a rig is considered to be a rigging
typedef Rigging = { private var rig: Rig; }

@:expose
class Rig {
  private var anims: Array<Anim>;

  // create a new animation play rig
  public function new() {
    this.anims = new Array<Anim>();
  }

  // add an animation instance to the rig
  public function play(instance: Anim) {
    this.anims.push(instance);
  }

  // remove an animation instance from the rig
  public function stop(instance: Anim) {
    var i = this.anims.indexOf(instance);

    if (i >= 0) {
      var last = this.anims.pop();

      // swap with last
      if (i < this.anims.length) {
        this.anims[i] = last;
      }
    }
  }

  // advance all the animation behaviors
  public function update(step: Float) {
    var i = 0;

    // advance all the animations
    while(i < this.anims.length) {
      if (this.anims[i](step)) {
        var last = this.anims.pop();

        // swap with last - remove from set
        if (i < this.anims.length) {
          this.anims[i] = last;
        }
      } else {
        i++;
      }
    }
  }
}
