// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

typedef Anim = Float -> Bool;

class Rig {
  private var anims: Array<Anim>;

  // create a new animation play rig
  public function new() {
    this.anims = new Array<Anim>();
  }

  // add an animation instance to the rig
  @:allow(spark.anim)
  private function newAnim(anim: Anim) {
    this.anims.push(anim);
  }

  // remove an animation instance from the rig
  public function stop(anim: Anim) {
    var i = this.anims.indexOf(anim);

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
