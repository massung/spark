/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.sprite');

// Simple particle (sprite) emitter.
spark.Emitter = function(src) {

  // Set all the default values for an empty emitter.
  this.startAlpha = 1.0;
  this.endAlpha = 0.0;
  this.minLife = 0.0;
  this.maxLife = 1.0;
  this.startScale = 1.0;
  this.endScale = 1.0;
  this.spread = 10.0;
  this.minSpeed = 50.0;
  this.maxSpeed = 100.0;
  this.minAngularVelocity = -180.0;
  this.maxAngularVelocity = 180.0;
  this.forwardAngle = 0.0;

  // Load the emitter as a JSON file of emission and particle properties.
  spark.loadJSON(src, (function(json) {
    spark.merge(this, json);

    // Create a particle behavior function for every sprite emitted.
    this.particleBehavior = function() {
      if ((this.particle.age += spark.game.step) > this.particle.life) {
        this.dead = true;
      }

      // Translate and rotate.
      this.rotate(this.particle.angularVelocity * spark.game.step);
      this.translate(spark.vec.vscale(this.particle.velocity, spark.game.step));

      // Linearly interpolate the scale.
      this.setScale(spark.lerp(
        this.particle.emitter.startScale,
        this.particle.emitter.endScale,
        this.particle.age,
        this.particle.life));

      // Linearly interpolate the alpha.
      this.alpha = spark.lerp(
        this.particle.emitter.startAlpha,
        this.particle.emitter.endAlpha,
        this.particle.age,
        this.particle.life);
    };
  }).bind(this));
};

// Set constructors.
spark.Emitter.prototype.constructor = spark.Emitter;

// Emit particles into the scene.
spark.Emitter.prototype.emit = function(layer, pos, angle, n) {
  for(var i = 0;i < n;i++) {
    var p = layer.spawn();

    // Set the texture image to use.
    p.setImage(spark.project.assets[this.texture]);

    // Set the alpha and composite operation for the sprite.
    p.alpha = this.startAlpha;

    // Randomize the angle.
    angle += spark.rand(-this.spread, this.spread);

    // Random size and position.
    p.setPosition(pos.x, pos.y);
    p.setScale(spark.rand(this.minScale, this.maxScale));
    p.setRotation(angle + this.forwardAngle);

    // Pick a random speed.
    var speed = spark.rand(this.minSpeed, this.maxSpeed);

    // Create all the particle settings.
    p.particle = {
      emitter: this,

      // When this reaches life, then the particle dies.
      age: 0.0,

      // Random max age.
      life: spark.rand(this.minLife, this.maxLife),

      // Random rotation speed.
      angularVelocity: spark.rand(this.minAngularVelocity, this.maxAngularVelocity),

      // Direction of travel in world space.
      velocity: [
        speed * Math.cos(spark.degToRad(angle)),
        speed * Math.sin(spark.degToRad(angle)),
      ],
    };

    // Add the particle behavior for this sprite.
    p.addBehavior(this.particleBehavior);
  }
};
