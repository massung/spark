// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import spark.object.*;
import spark.object.layer.*;

typedef ParticleData = {
  age: Float,
  life: Float,
  w: Float,
  vx: Float,
  vy: Float,
}

class Emitter extends Asset {
  private var quad: Quad;

  // determines the behavior of spawned particle sprites
  private var blend: String;
  private var sprite: String;
  private var startAlpha: Float;
  private var endAlpha: Float;
  private var minLife: Float;
  private var maxLife: Float;
  private var startScale: Float;
  private var endScale: Float;
  private var spread: Float;
  private var minSpeed: Float;
  private var maxSpeed: Float;
  private var angle: Float;
  private var minAngularVelocity: Float;
  private var maxAngularVelocity: Float;
  private var damping: Float;

  // created behavior function for this emitter
  private var particleBehavior: Actor.BehaviorCallback;

  // load a new particle emitter asset
  public function new(src: String) {
    super(src);

    // default source values
    this.blend = 'screen';
    this.sprite = null;
    this.startAlpha = 1.0;
    this.endAlpha = 1.0;
    this.minLife = 1.0;
    this.maxLife = 1.5;
    this.startScale = 1.0;
    this.endScale = 1.0;
    this.spread = 180.0;
    this.minSpeed = 50.0;
    this.maxSpeed = 100.0;
    this.angle = 0.0;
    this.minAngularVelocity = -90.0;
    this.maxAngularVelocity = 90.0;
    this.damping = 1.0;

    // issue the load
    Spark.loadXML(src, function(doc) {
      var emitter: Xml = doc.firstElement();

      if (emitter == null || emitter.nodeName != 'emitter') {
        throw 'Invalid emitter XML: ' + src;
      }

      // get all the emitter properties and override defaults
      Util.mergeAtt(this, 'sprite', emitter);
      Util.mergeAtt(this, 'blend', emitter);
      Util.mergeAtt(this, 'startAlpha', emitter, TFloat);
      Util.mergeAtt(this, 'endAlpha', emitter, TFloat);
      Util.mergeAtt(this, 'minLife', emitter, TFloat);
      Util.mergeAtt(this, 'maxLife', emitter, TFloat);
      Util.mergeAtt(this, 'startScale', emitter, TFloat);
      Util.mergeAtt(this, 'endScale', emitter, TFloat);
      Util.mergeAtt(this, 'spread', emitter, TFloat);
      Util.mergeAtt(this, 'minSpeed', emitter, TFloat);
      Util.mergeAtt(this, 'maxSpeed', emitter, TFloat);
      Util.mergeAtt(this, 'angle', emitter, TFloat);
      Util.mergeAtt(this, 'minAngularVelocity', emitter, TFloat);
      Util.mergeAtt(this, 'maxAngularVelocity', emitter, TFloat);
      Util.mergeAtt(this, 'damping', emitter, TFloat);

      // lookup the sprite quad if set
      if (this.sprite != null) {
        this.quad = Game.project.getQuad(this.sprite);
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
        var scale = Util.lerp(this.startScale, this.endScale, p.age, p.life);

        // translate, rotate, and scale
        s.m.translate(p.vx * step, p.vy * step);
        s.m.rotate(p.w * step);
        s.m.s.set(scale, scale);

        // apply damping
        p.vx *= 1 - (this.damping * step);
        p.vy *= 1 - (this.damping * step);

        // linearly interpolate the alpha
        s.alpha = Util.lerp(this.startAlpha, this.endAlpha, p.age, p.life);
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
      sprite.blend = this.blend;

      // random linear speed and spread in the direction of travel
      var speed = Util.rand(this.minSpeed, this.maxSpeed);
      var spread = Util.rand(-this.spread, this.spread);

      // initialize the sprite transform
      sprite.m.p.set(x, y);
      sprite.m.angle = this.angle + r;

      // pick a random age
      var life = Util.rand(this.minLife, this.maxLife);

      // randomize the angular velocity
      var w = Util.rand(this.minAngularVelocity, this.maxAngularVelocity);

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
