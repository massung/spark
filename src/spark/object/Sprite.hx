// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.anim.*;
import spark.collision.*;
import spark.graphics.*;
import spark.object.layer.*;

class Sprite extends Actor {

  // dead is a get/set property for resource ref count
  public var dead: Bool;

  // alpha and blend operation
  public var alpha: Float;
  public var blend: String;

  // how this sprite renders
  private var quad: Quad;

  // special animation for the quad
  private var flipAnim: Sequence;

  // the layer this sprite was spawned onto
  private var layer: SpriteLayer;

  // a rigid body for collision
  private var body: Body;

  // create a new sprite
  public function new(layer: SpriteLayer) {
    super();

    // one-time allocations
    this.layer = layer;

    // reset everything
    this.init();
  }

  // initialize the sprite resource
  public override function init() {
    super.init();

    // reset data
    this.dead = false;
    this.body = null;
    this.quad = null;
    this.flipAnim = null;
    this.alpha = 1.0;
    this.blend = 'source-over';
  }

  // get the layer this sprite is on
  public function getLayer(): Layer return layer;

  // add a rigid body for collision detection to the sprite
  public function newBody(filter: String, ?oncollision: Body.CollisionCallback): Body {
    return this.body = new spark.collision.Body(this, filter, oncollision);
  }

  // return the width of the sprite in pixels
  public function getWidth(): Float {
    return this.m.s.x * ((this.quad != null) ? this.quad.getRect().getWidth() : 0);
  }

  // return the height of the sprite in pixels
  public function getHeight(): Float {
    return this.m.s.y * ((this.quad != null) ? this.quad.getRect().getHeight() : 0);
  }

  // set the quad this sprite renders with, cancel any flip animation
  public function setQuad(quad: Quad, ?clearAnim: Bool = true) {
    this.quad = quad;

    if (clearAnim) {
      this.flipAnim = null;
    }
  }

  // add all collision shapes on this sprite into the spacial hash
  public function addToQuadtree(space: Quadtree) {
    if (this.body != null) {
      this.body.addToQuadtree(space);
    }
  }

  // add a flipbook animation to this sprite
  public function playAnim(flipbook: Flipbook, n: String, ?loop: Bool = true): Sequence {
    var seq = flipbook.newSequence(this, n, loop);

    // overwrite the current flip animation
    if (seq != null) {
      this.flipAnim = seq;
    }

    return seq;
  }

  // called once a quad to update the sprite
  public override function update(step: Float) {
    super.update(step);

    // update the flip animation (if any)
    if (this.flipAnim != null) {
      this.flipAnim.update(step);

      // stop the flip anim? hold the last frame
      if (this.flipAnim.stop) {
        this.flipAnim = null;
      }
    }

    // update all the collision shapes
    if (this.body != null) {
      this.body.updateShapeCache(this.layer.m.mult(this.m));
    }
  }

  // called once a quad to render the sprite
  public function draw() {
    if (this.quad == null) {
      return;
    }

    Spark.view.save();

    // apply the model transform to the view
    this.m.apply();

    // apply view settings
    Spark.view.globalAlpha = this.alpha;
    Spark.view.globalCompositeOperation = this.blend;

    // render the texture/quad
    this.quad.draw();

    // done
    Spark.view.restore();
  }
}
