// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.anim.*;
import spark.collision.*;
import spark.graphics.*;
import spark.math.*;

typedef BehaviorCallback = Sprite -> Float -> Dynamic -> Void;
typedef Behavior = {
  callback: BehaviorCallback,
  data: Dynamic,
}

@:expose
class Sprite {
  public var m: Mat;
  public var pivot: Vec;

  // the layer this sprite was spawned onto
  public var layer: Layer;

  // dead is a get/set property for resource ref count
  public var dead: Bool;

  // how this sprite renders
  private var texture: Texture;
  private var quad: Rect;
  //private var contextSettings: Dynamic;

  // a rigid body for collision
  private var body: Body;

  // animations
  private var rig: Rig;

  // update functions
  private var behaviors: Array<Behavior>;

  // create a new sprite
  public function new(layer: Layer) {
    this.init();

    // this property never changes!
    this.layer = layer;
  }

  // initialize the sprite resource
  public function init() {
    this.m = Mat.IDENTITY;
    this.pivot = new Vec(0.5, 0.5);
    this.behaviors = new Array<Behavior>();
    this.rig = new Rig();
    this.dead = false;
    this.body = null;
    //this.contextSettings = {};
  }

  // add a rigid body for collision detection to the sprite
  public function addBody(filter: String, ?oncollision: Body.CollisionCallback): Body {
    return this.body = new spark.collision.Body(this, filter, oncollision);
  }

  // add a behavior callback and optional data to the sprite
  public function addBehavior(callback: BehaviorCallback, ?data: Dynamic) {
    this.behaviors.push({
      callback: callback,
      data: data,
    });
  }

  // set the texture image to render with
  public function setTexture(texture: Texture, ?quad: Rect) {
    this.texture = texture;
    this.quad = quad;
  }

  // set the quad to render
  public function setQuad(quad: Rect) {
    this.quad = quad;
  }

  // return the width of the sprite in pixels
  public function getWidth(): Float {
    return 0;
  }

  // return the height of the sprite in pixels
  public function getHeight(): Float {
    return 0;
  }

  // convert point from world to local space
  public function worldToLocal(p: Vec): Vec {
    return this.m.inverse().transform(p);
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
  public function update(step: Float) {
    var i: Int;

    // continue all the animations
    this.rig.update(step);

    // execute all the behaviors
    for(i in 0...this.behaviors.length) {
      this.behaviors[i].callback(this, step, this.behaviors[i].data);
    }

    // update all the collision shapes
    if (this.body != null) {
      this.body.updateShapeCache(this.m);
    }
  }

  // called once a frame to render the sprite
  public function draw() {
    if (this.texture == null) return;

    Spark.view.save();

    // apply the model transform to the view
    this.m.apply();

    // apply view settings
    //merge(view, this.contextSettings);

    // render the texture/quad
    if (this.quad == null) {
      this.texture.draw(this.pivot);
    } else {
      this.texture.drawq(this.quad, this.pivot);
    }

    // done
    Spark.view.restore();
  }
}
