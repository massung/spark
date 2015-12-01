// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import spark.layer.*;
import spark.math.*;

typedef ParticleData = {
  age: Float,
  life: Float,
  w: Float,
  v: Vec,
}

typedef EmitterData = {
  texture: String,
  quad: String,
  startAlpha: Float,
  endAlpha: Float,
  minLife: Float,
  maxLife: Float,
  startScale: Float,
  endScale: Float,
  spread: Float,
  minSpeed: Float,
  maxSpeed: Float,
  minAngularVelocity: Float,
  maxAngularVelocity: Float,
  forwardAngle: Float,
}

@:expose
class Emitter extends Asset.JSONAsset {
  private var data: EmitterData;

  // how each particle sprite will render
  private var texture: Texture;
  private var quad: Rect;

  // created behavior function for this emitter
  private var particleBehavior: Sprite.BehaviorCallback;

  // load a new particle emitter asset
  public function new(src: String) {
    this.texture = null;
    this.quad = null;

    // issue the load
    super(src, function(json) {
      this.data = json;

      // create a custom behavior for all particles this emitter spawns
      this.particleBehavior = function(sprite: Sprite, step: Float, data: Dynamic) {
        var p: ParticleData = data;

        // age the particle
        if ((p.age += step) > p.life) {
          p.age = p.life;

          // remove the sprite from the scene
          sprite.dead = true;
        }

        // calculate the new scale
        var s = Util.lerp(this.data.startScale, this.data.endScale, p.age, p.life);

        // translate, rotate, and scale
        sprite.m.translate(p.v.x * step, p.v.y * step);
        sprite.m.rotate(p.w * step);
        sprite.m.s.set(s, s);

        // linearly interpolate the alpha
        //sprite.contextSettings.globalAlpha = lerp(this.data.startAlpha, this.data.endAlpha, p.age, p.life);
      };
    });
  }

  // spawn particle sprites into the scene
  public function emit(layer: SpriteLayer, x: Float, y: Float, angle: Float, ?n: Int = 1) {
    var i;

    for (i in 0...n) {
      var sprite: Sprite = layer.spawn();

      // set the texture to use
      //sprite.texture = this.texture && project.assets[this.texture];
      //sprite.quad = this.quad && project.assets[this.quad];

      // random linear and angular velocity
      var s = Util.rand(this.data.minSpeed, this.data.maxSpeed);
      var a = Util.rand(-this.data.spread, this.data.spread) + angle;

      // initialize the sprite transform
      sprite.m.p.set(x, y);
      sprite.m.angle = this.data.forwardAngle + a;

      // pick a random age
      var life = Util.rand(this.data.minLife, this.data.maxLife);

      // calculate the linear and angular velocities
      var v = Vec.axis(a, s);
      var w = Util.rand(this.data.minAngularVelocity, this.data.maxAngularVelocity);

      // particle data associated with the behavior
      var particle = { age: 0, life: life, w: w, v: v };

      // add the particle behavior, bound to particle instance data
      sprite.addBehavior(this.particleBehavior, particle);
    }
  }
}
