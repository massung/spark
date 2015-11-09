/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.game');

__MODULE__.init = function () {
  if (spark.platform.mobile) {
    spark.main('canvas', spark.platform.width, spark.platform.height);
  } else {
    spark.main('canvas', 640, 480);
  }

  // Start the game.
  spark.game.run('game/project.json', function(scene) {

    // Change the projection so the origin is in the middle.
    scene.setProjection('middle', 0.5);

    // Create the player.
    game.demo.createPlayer();

    // Spawn 3 large asteroids.
    for(var i = 0;i < 3;i++) {
      game.demo.createAsteroid();
    }
  });
};

__MODULE__.createPlayer = function() {
  var sprite = spark.game.scene.sprites.spawn();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.setImage(spark.project.assets.player_ship);
  sprite.setPosition(0, 0);

  // Add some callback behaviors.
  sprite.addBehavior(game.demo.playerControls);
  sprite.addBehavior(game.demo.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('player', function(filter) {
    // TODO: if (filter === 'asteroid') die();
  });

  // Add a simple collider shape.
  collider.addCircleShape([0, 0], 30);

  return sprite;
};

__MODULE__.createAsteroid = function(x, y, scale) {
  var sprite = spark.game.scene.sprites.spawn();
  var s = 150;

  // Initial properties.
  sprite.direction = [spark.util.rand(-s, s), spark.util.rand(-s, s)];
  sprite.rot = spark.util.rand(-180, 180);

  // Sprite initialization.
  sprite.setImage(spark.project.assets.asteroid_1);
  sprite.setPosition(
    x || spark.util.rand(spark.game.scene.left, spark.game.scene.right),
    y || spark.util.rand(spark.game.scene.top, spark.game.scene.bottom));

  // Set the scale
  sprite.setScale(scale || 1.0);

  // Add some callback behaviors.
  sprite.addBehavior(game.demo.spin);
  sprite.addBehavior(game.demo.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('asteroid', function(c) {
    if (c.filter == 'bullet') {
      this.dead = true;

      // Spawn 2-4 smaller asteroids.
      if (this.m.s.x > 0.6) {
        var n = spark.util.irand(2, 4);

        for(var i = 0;i < n;i++) {
          game.demo.createAsteroid(this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
        }
      }

      // Spawn some asteroid particles.
      spark.project.assets.explode.emit(this.m.p, 0, 50);

      // Play the explosion sound.
      spark.project.assets.rumble_sound.woof();
    }
  });

  // Add a simple collider shape.
  collider.addBoxShape(-30, -30, 60, 60);
};

// All space objects wrap around the viewport.
__MODULE__.spaceObject = function() {

  // Wrap right to left.
  if (this.m.p.x - this.width / 2 > spark.game.scene.right)
    this.m.p.x -= spark.game.scene.width + this.width;

  // Wrap left to right.
  if (this.m.p.x + this.width / 2 < spark.game.scene.left)
    this.m.p.x += spark.game.scene.width + this.width;

  // Wrap bottom to top.
  if (this.m.p.y - this.height / 2 > spark.game.scene.bottom)
    this.m.p.y -= spark.game.scene.height + this.height;

  // Wrap top to bottom.
  if (this.m.p.y + this.height / 2 < spark.game.scene.top)
    this.m.p.y += spark.game.scene.height + this.height;
};

// Asteroids consistently move and spin.
__MODULE__.spin = function() {
  this.translate(spark.vec.vscale(this.direction, spark.game.step));
  this.rotate(this.rot * spark.game.step);
};

// Handle player input.
__MODULE__.playerControls = function() {
  if (spark.input.keyDown(spark.input.KEY.LEFT)) this.rotate(-180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.RIGHT)) this.rotate(180 * spark.game.step);

  // Rotate/zoom the camera for fun.
  if (spark.input.keyDown(spark.input.KEY.A))
    spark.game.scene.camera.rotate(-180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.D))
    spark.game.scene.camera.rotate(180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.W))
    spark.game.scene.camera.scale(2.0 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.S))
    spark.game.scene.camera.scale(-2.0 * spark.game.step);

  // Thrusting.
  if (spark.input.keyDown(spark.input.KEY.UP)) {
    this.thrust.x += 800.0 * spark.game.step * -this.m.r.y;
    this.thrust.y -= 800.0 * spark.game.step * this.m.r.x;

    // Emit some thrust particles.
    spark.project.assets.thrust.emit(
      this.localToWorld([0, 55]),
      this.localToWorldAngle(-90.0),
      2);
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE)) {
    var bullet = spark.game.scene.sprites.spawn();

    // Sprite rendering.
    bullet.setImage(spark.project.assets.player_laser);

    // Spawn in front of the player.
    bullet.m.p = this.localToWorld([0, -30]);
    bullet.m.r = this.m.r;

    // Add some callback behaviors.
    bullet.addBehavior(game.demo.bullet);

    // Add a collision filter and callback.
    var collider = bullet.addCollider('bullet', function(c) {
      if (c.filter === 'asteroid') {
        this.dead = true;
      }
    });

    // Add a simple collider shape.
    collider.addSegmentShape([0, -10], [0, 10]);

    // Play a sound.
    spark.project.assets.laser_sound.woof();
  }

  // Move the player.
  this.m.p.x += this.thrust.x * spark.game.step;
  this.m.p.y += this.thrust.y * spark.game.step;

  // Dampening.
  this.thrust = spark.vec.vscale(this.thrust, 0.98);
};

// Advance the bullet, slowly die off.
__MODULE__.bullet = function() {
  if ((this.alpha -= spark.game.step) < 0) {
    this.dead = true;
  }

  // Move the bullet forward.
  this.translate([0, -1200 * spark.game.step], true);
};
