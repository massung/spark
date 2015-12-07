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

class Actor extends Rig {
  public var m: Mat;

  // update functions
  private var behaviors: Array<Behavior>;

  // create an actor
  public function new() {
    super();

    // reset transform and behaviors
    this.init();
  }

  // actors can be pooled, so reset data
  public function init() {
    this.behaviors = [];

    // reset transform
    this.m = Mat.identity();
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

  // called once a frame to update the sprite
  public override function update(step: Float) {
    var i: Int;

    // play any animations on this actor
    super.update(step);

    // execute all the behaviors
    for(i in 0...this.behaviors.length) {
      this.behaviors[i].callback(this, step, this.behaviors[i].data);
    }
  }
}
