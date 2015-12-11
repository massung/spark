// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.anim.*;
import spark.collision.*;
import spark.graphics.*;

typedef BehaviorCallback = Actor -> Float -> Dynamic -> Void;
typedef Behavior = {
  callback: BehaviorCallback,
  data: Dynamic,
}

class Actor {
  public var m: Mat;

  // update functions
  private var behaviors: Array<Behavior>;

  // animation sequences
  private var anims: Array<Sequence>;

  // create an actor
  public function new() {
    this.m = Mat.identity();

    // reset transform and behaviors
    this.init();
  }

  // actors can be pooled, so reset data
  public function init() {
    this.behaviors = [];
    this.anims = [];

    // reset transform
    this.m.loadIdentity();
  }

  // add a behavior callback and optional data to the sprite
  public function newBehavior(callback: BehaviorCallback, ?data: Dynamic) {
    this.behaviors.push({
      callback: callback,
      data: data,
    });
  }

  // convert point from world to local space
  public function worldToLocal(p: Vec): Vec {
    return this.m.untransform(p);
  }

  // convert point from local to world space
  public function localToWorld(p: Vec): Vec {
    return this.m.transform(p);
  }

  // convert angle from world to local space
  public function worldToLocalAngle(angle: Float): Float {
    return this.m.angle - angle;
  }

  // convert angle from local to world space
  public function localToWorldAngle(angle: Float): Float {
    return this.m.angle + angle;
  }

  // play a single curve animation on this actor
  public function play(curve: Curve, property: String, ?loop: Bool = false) {
    var seq = curve.newSequence(this, property, Forward, loop);

    // add the sequence to the list of animations
    if (seq != null) {
      this.anims.push(seq);
    }

    return seq;
  }

  // play an animation sequence on this actor
  public function playTimeline(timeline: Timeline, ?onevent: String -> Void, ?loop: Bool = false): Sequence {
    var seq = timeline.newSequence(this, onevent, Forward, loop);

    // add the sequence to the list of animations
    if (seq != null) {
      this.anims.push(seq);
    }

    return seq;
  }

  // called once a frame to update the sprite
  public function update(step: Float) {
    var stopped = false;

    // play any animations on this actor
    for(seq in this.anims) {
      seq.update(step);

      // if this sequence stopped, then it needs to be removed
      stopped = stopped || seq.stop;
    }

    // remove sequences if any stopped
    if (stopped) {
      this.anims = [for (seq in this.anims) if (seq.stop == false) seq];
    }

    // execute all the behaviors
    for(behavior in this.behaviors) {
      behavior.callback(this, step, behavior.data);
    }
  }
}
