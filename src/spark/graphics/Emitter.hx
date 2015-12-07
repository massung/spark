// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import spark.layer.*;
import spark.object.*;

typedef ParticleData = {
  age: Float,
  life: Float,
  w: Float,
  vx: Float,
  vy: Float,
}

typedef EmitterData = {
  blend: String,
  sprite: String,
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
  private var quad: Quad;

  // created behavior function for this emitter
  private var particleBehavior: Actor.BehaviorCallback;

  // load a new particle emitter asset
  public function new(src: String) {
    super(src);

    // default source values
    this.data = {
      blend: 'screen',
      sprite: null,
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
    this.quad = null;

    // issue the load
    Spark.loadXML(src, function(doc) {
      var emitter: Xml = doc.firstElement();

      if (emitter == null || emitter.nodeName != 'emitter') {
        throw 'Invalid emitter XML: ' + src;
      }

      // get all the emitter properties and override defaults
      Util.mergeAtt(this.data, 'sprite', emitter);
      Util.mergeAtt(this.data, 'blend', emitter);
      Util.mergeAtt(this.data, 'startAlpha', emitter, TFloat);
      Util.mergeAtt(this.data, 'endAlpha', emitter, TFloat);
      Util.mergeAtt(this.data, 'minLife', emitter, TFloat);
      Util.mergeAtt(this.data, 'maxLife', emitter, TFloat);
      Util.mergeAtt(this.data, 'startScale', emitter, TFloat);
      Util.mergeAtt(this.data, 'endScale', emitter, TFloat);
      Util.mergeAtt(this.data, 'spread', emitter, TFloat);
      Util.mergeAtt(this.data, 'minSpeed', emitter, TFloat);
      Util.mergeAtt(this.data, 'maxSpeed', emitter, TFloat);
      Util.mergeAtt(this.data, 'angle', emitter, TFloat);
      Util.mergeAtt(this.data, 'minAngularVelocity', emitter, TFloat);
      Util.mergeAtt(this.data, 'maxAngularVelocity', emitter, TFloat);

      // if the texture was set, look it up in the project
      if (this.data.sprite != null) {
        var asset = Game.project.get(this.data.sprite);

        // attempt to cast the asset to a renderable quad
        this.quad = cast(asset, Quad);
      }

      // create a custom behavior for all particles this emitter spawns
      this.particleBehavior = function(actor: Actor, step: Float, data: Dynamic) {
        var s: Sprite = cast actor;
        var p: ParticleData = cast data;

        // age the particle
        if ((p.age += step) > p.life) {
          p.age = p.life;

          // remove the sprite from the scene
          s.dead = true;
        }

        // calculate the new scale
        var scale = Util.lerp(this.data.startScale, this.data.endScale, p.age, p.life);

        // translate, rotate, and scale
        s.m.translate(p.vx * step, p.vy * step);
        s.m.rotate(p.w * step);
        s.m.s.set(scale, scale);

        // linearly interpolate the alpha
        s.alpha = Util.lerp(this.data.startAlpha, this.data.endAlpha, p.age, p.life);
      };

      // asset is now ready for use
      this.loaded = true;
    });
  }

  // spawn particle sprites into the scene
  public function emit(layer: SpriteLayer, x: Float, y: Float, r: Float, dir: Float, ?n: Int = 1) {
    var i;

    for (i in 0...n) {
      var sprite: Sprite = layer.newSprite();

      // set the sprite frame to use
      sprite.setQuad(this.quad);

      // set the composite operation from the source
      sprite.blend = this.data.blend;

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

      // get the direction of travel unit vector
      var dx = Math.cos(Util.degToRad(dir + spread));
      var dy = Math.sin(Util.degToRad(dir + spread));

      // particle data associated with the behavior
      var particle = {
        age: 0,
        life: life,
        w: w,
        vx: dx * speed,
        vy: dy * speed,
      };

      // add the particle behavior, bound to particle instance data
      sprite.newBehavior(this.particleBehavior, particle);
    }
  }
}
