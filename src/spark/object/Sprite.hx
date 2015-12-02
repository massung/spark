// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.anim.*;
import spark.collision.*;
import spark.graphics.*;

class Sprite extends Actor {
  public var pivot: Vec;

  // dead is a get/set property for resource ref count
  public var dead: Bool;

  // the layer this sprite was spawned onto
  public var layer: Layer;

  // a rigid body for collision
  private var body: Body;

  // how this sprite renders
  private var texture: Texture;
  private var quad: Rect;
  //private var contextSettings: Dynamic;

  // create a new sprite
  public function new(layer: Layer) {
    super();

    // allocate variables
    this.pivot = new Vec(0.5, 0.5);
    this.layer = layer;

    // reset everything
    this.init();
  }

  // initialize the sprite resource
  public function init() {
    this.m = Mat.identity();
    this.behaviors = [];
    this.pivot.set(0.5, 0.5);
    this.dead = false;
    this.body = null;
    this.texture = null;
    this.quad = null;
    //this.contextSettings = {};
  }

  // add a rigid body for collision detection to the sprite
  public function addBody(filter: String, ?oncollision: Body.CollisionCallback): Body {
    return this.body = new spark.collision.Body(this, filter, oncollision);
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
    if (this.texture == null) {
      return 0;
    }

    return (this.quad != null) ? this.quad.getWidth() : this.texture.getWidth();
  }

  // return the height of the sprite in pixels
  public function getHeight(): Float {
    if (this.texture == null) {
      return 0;
    }

    return (this.quad != null) ? this.quad.getHeight() : this.texture.getHeight();
  }

  // add all collision shapes on this sprite into the spacial hash
  public function addToQuadtree(space: Quadtree) {
    if (this.body != null) {
      this.body.addToQuadtree(space);
    }
  }

  // called once a frame to update the sprite
  public override function update(step: Float) {
    super.update(step);

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
