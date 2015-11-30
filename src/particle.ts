// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // particle emitter asset
  export class Emitter extends JSONAsset {
    texture: string;
    quad: string;
    startAlpha: number;
    endAlpha: number;
    minLife: number;
    maxLife: number;
    startScale: number;
    endScale: number;
    spread: number;
    minSpeed: number;
    maxSpeed: number;
    minAngularVelocity: number;
    maxAngularVelocity: number;
    forwardAngle: number;

    // created behavior function for this emitter
    private particleBehavior: Behavior;

    // load a new particle emitter asset
    constructor(src: string) {
      this.minLife = 1.0;
      this.maxLife = 1.0;
      this.startAlpha = 1.0;
      this.endAlpha = 0.0;
      this.startScale = 1.0;
      this.endScale = 1.0;
      this.spread = 180.0;
      this.minSpeed = 10.0;
      this.maxSpeed = 15.0;
      this.minAngularVelocity = -5.0;
      this.maxAngularVelocity = 5.0;
      this.forwardAngle = 0.0;

      // load the source
      super(src, json => {
        merge(this, json);
      });

      // create a function for particle sprite behavior
      this.particleBehavior = function(sprite, step) {
        var emitter = this.emitter;

        if ((this.age += step) > this.life) {
          this.age = this.life;

          // remove the particle from the scene
          sprite.dead = true;
        }

        // calculate the new scale
        var s = lerp(this.emitter.startScale, this.emitter.endScale, this.age, this.life);

        // translate, rotate, and scale
        sprite.m.translate(this.v.x * step, this.v.y * step);
        sprite.m.rotate(this.w * step);
        sprite.m.s.set(s, s);

        // linearly interpolate the alpha
        sprite.contextSettings.globalAlpha = lerp(this.emitter.startAlpha, this.emitter.endAlpha, this.age, this.life);
      };
    }

    // spawn particle sprites into the scene
    emit(scene: Scene, x: number, y: number, angle: number, n?: number) {
      for (var i = 0;i < (n || 1);i++) {
        var sprite = scene.spawn();

        // set the texture to use
        sprite.texture = this.texture && project.assets[this.texture];
        sprite.quad = this.quad && project.assets[this.quad];

        // random linear and angular velocity
        var s = rand(this.minSpeed, this.maxSpeed);
        var a = rand(-this.spread, this.spread) + angle;

        // initialize the sprite transform
        sprite.m.p.set(x, y);
        sprite.m.angle = this.forwardAngle + a;

        // add the particle behavior, bound to particle instance data
        sprite.addBehavior(this.particleBehavior.bind({
          emitter: this,

          // starting age
          age: 0.0,

          // random max age
          life: rand(this.minLife, this.maxLife),

          // linear velocity
          v: new Vec(s * Math.cos(degToRad(a)), s * Math.sin(degToRad(a))),

          // angular velocity
          w: rand(this.minAngularVelocity, this.maxAngularVelocity),
        }));
      }
    }
  }
}
