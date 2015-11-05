/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.entity', 'spark.util').defines({
  Emitter: function(src) {

    // Set all the default values for an empty emitter.
    this.shape = 'point';
    this.compositeOperation = 'screen';
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
      spark.util.merge(this, json);

      // Create a particle behavior function for every sprite emitted.
      this.particleBehavior = function() {
        if ((this.particle.age += spark.game.step) > this.particle.life) {
          this.dead = true;
        }

        // TODO: Everything below this should be done with a tween!

        // Translate, rotate, and scale.
        this.rotate(this.particle.angularVelocity * spark.game.step);
        this.translate(spark.vec.vscale(this.particle.velocity, spark.game.step));

        // Linearly interpolate the scale.
        this.setScale(spark.util.lerp(
          this.particle.emitter.startScale,
          this.particle.emitter.endScale,
          this.particle.age,
          this.particle.life));

        // Linearly interpolate the alpha.
        this.alpha = spark.util.lerp(
          this.particle.emitter.startAlpha,
          this.particle.emitter.endAlpha,
          this.particle.age,
          this.particle.life);
      };
    }).bind(this));
  },
});

// Emit particles into the scene.
__MODULE__.Emitter.prototype.emit = function(pos, rot, n) {
  for(var i = 0;i < n;i++) {
    var p = new spark.entity.Sprite();

    // Set the texture image to use.
    p.setImage(spark.game.project.assets[this.texture]);

    // Set the alpha and composite operation for the sprite.
    p.alpha = this.startAlpha;
    p.compositeOperation = this.compositeOperation;

    // Pick an angle of direction and speed.
    var angle = spark.util.rand(-this.spread, this.spread) + rot;
    var speed = spark.util.rand(this.minSpeed, this.maxSpeed);

    // Random size and position.
    p.setPosition(pos.x, pos.y);
    p.setScale(spark.util.rand(this.minScale, this.maxScale));
    p.setRotation(angle + this.forwardAngle);

    // Create all the particle settings.
    p.particle = {
      emitter: this,

      // When this reaches life, then the particle dies.
      age: 0.0,

      // Random max age.
      life: spark.util.rand(this.minLife, this.maxLife),

      // Random rotation speed.
      angularVelocity: spark.util.rand(this.minAngularVelocity, this.maxAngularVelocity),

      // Direction of travel in world space.
      velocity: [
        speed * Math.cos(angle * Math.PI / 180.0),
        speed * Math.sin(angle * Math.PI / 180.0),
      ],
    };

    // Add the particle behavior for this sprite.
    p.addBehavior(this.particleBehavior);

    // Add the sprite to the game world.
    spark.game.scene.spawn(p);
  }
};
