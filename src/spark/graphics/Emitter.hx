// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import spark.object.*;

typedef ParticleData = {
  age: Float,
  life: Float,
  w: Float,
  v: Vec,
}

typedef EmitterData = {
  texture: String,
  compositeOperation: String,
  startAlpha: Float,
  endAlpha: Float,
  minLife: Float,
  maxLife: Float,
  startScale: Float,
  endScale: Float,
  spread: Float,
  minSpeed: Float,
  maxSpeed: Float,
  angle: Float,
  minAngularVelocity: Float,
  maxAngularVelocity: Float,
}

class Emitter extends Asset {
  private var data: EmitterData;

  // how each particle sprite will render
  private var texture: Texture;
  private var quad: Rect;

  // created behavior function for this emitter
  private var particleBehavior: Actor.BehaviorCallback;

  // load a new particle emitter asset
  public function new(src: String) {
    super(src);

    // default source values
    this.data = {
      texture: null,
      compositeOperation: 'screen',
      startAlpha: 1.0,
      endAlpha: 1.0,
      minLife: 1.0,
      maxLife: 1.5,
      startScale: 1.0,
      endScale: 1.0,
      spread: 180.0,
      minSpeed: 50.0,
      maxSpeed: 100.0,
      angle: 0.0,
      minAngularVelocity: -90.0,
      maxAngularVelocity: 90.0,
    };

    // crunched data
    this.texture = null;

    // issue the load
    Spark.loadJSON(src, function(json) {
      Util.merge(this.data, json);

      // if the texture was set, look it up in the project
      if (this.data.texture != null) {
        this.texture = Game.getTexture(this.data.texture);
      }

      // create a custom behavior for all particles this emitter spawns
      this.particleBehavior = function(actor: Actor, step: Float, data: Dynamic) {
        var s: Sprite = cast actor;
        var p: ParticleData = data;

        // age the particle
        if ((p.age += step) > p.life) {
          p.age = p.life;

          // remove the sprite from the scene
          s.dead = true;
        }

        // calculate the new scale
        var scale = Util.lerp(this.data.startScale, this.data.endScale, p.age, p.life);

        // translate, rotate, and scale
        s.m.translate(p.v.x * step, p.v.y * step);
        s.m.rotate(p.w * step);
        s.m.s.set(scale, scale);

        // linearly interpolate the alpha
        s.contextSettings.globalAlpha = Util.lerp(this.data.startAlpha, this.data.endAlpha, p.age, p.life);
      };

      // asset is now ready for use
      this.loaded = true;
    });
  }

  // spawn particle sprites into the scene
  public function emit(layer: spark.layer.SpriteLayer, x: Float, y: Float, r: Float, dir: Float, ?n: Int = 1) {
    var i;

    for (i in 0...n) {
      var sprite: Sprite = layer.newSprite();

      // set the texture to use
      sprite.setTexture(this.texture);

      // set the composite operation from the source
      sprite.contextSettings.globalCompositeOperation = this.data.compositeOperation;

      // random linear speed and spread in the direction of travel
      var speed = Util.rand(this.data.minSpeed, this.data.maxSpeed);
      var spread = Util.rand(-this.data.spread, this.data.spread);

      // initialize the sprite transform
      sprite.m.p.set(x, y);
      sprite.m.angle = this.data.angle + r;

      // pick a random age
      var life = Util.rand(this.data.minLife, this.data.maxLife);

      // randomize the angular velocity
      var w = Util.rand(this.data.minAngularVelocity, this.data.maxAngularVelocity);

      // particle data associated with the behavior
      var particle = {
        age: 0,
        life: life,
        v: Vec.axis(dir + spread, speed),
        w: w,
      };

      // add the particle behavior, bound to particle instance data
      sprite.addBehavior(this.particleBehavior, particle);
    }
  }
}
