/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

var demo = spark.game();

// Called once the spark framework is fully loaded.
demo.init = function () {
  spark.main('canvas');

  // Create the game and run it.
  demo.game = new spark.Game('game/project.json', function(scene) {

    // Change the projection so the origin is in the middle.
    scene.setProjection('middle', 0.5);

    // Create layers for the asteroids, player, and particles.
    var asteroidsLayer = scene.addLayer(new spark.SpriteLayer(100));
    var playerLayer = scene.addLayer(new spark.SpriteLayer(50));

    // Set the Z values of each. Player layer on top.
    asteroidsLayer.z = 1;
    playerLayer.z = 2;

    // Set the shader to use for each layer.
    asteroidsLayer.shader = gl.spriteShader;
    playerLayer.shader = gl.spriteShader;

    // Create the player.
    demo.createPlayer(playerLayer);

    // Spawn 3 large asteroids.
    //for(var i = 0;i < 3;i++) {
    //  demo.createAsteroid(asteroidsLayer);
    //}
  });

  demo.game.run();
};

demo.createPlayer = function(layer) {
  var sprite = layer.spawn();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.setImage(demo.game.project.assets.player_ship);
  sprite.setPosition(0, 0);

  // Add some callback behaviors.
  sprite.addBehavior(this.playerControls);
  sprite.addBehavior(this.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('player', function(filter) {
    // TODO: if (filter === 'asteroid') die();
  });

  // Add a simple collider shape.
  collider.addCircleShape([0, 0], 30);

  return sprite;
};

demo.createAsteroid = function(layer, x, y, scale) {
  var sprite = layer.spawn();
  var s = 150;

  // Initial properties.
  sprite.direction = [spark.rand(-s, s), spark.rand(-s, s)];
  sprite.rot = spark.rand(-180, 180);

  // Sprite initialization.
  sprite.setImage(this.game.project.assets.asteroid_1);
  sprite.setPosition(
    x || spark.rand(this.game.scene.left, this.game.scene.right),
    y || spark.rand(this.game.scene.top, this.game.scene.bottom));

  // Set the scale
  sprite.setScale(scale || 1.0);

  // Add some callback behaviors.
  sprite.addBehavior(this.spin);
  sprite.addBehavior(this.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('asteroid', function(c) {
    if (c.filter == 'bullet') {
      this.dead = true;

      // Spawn 2-4 smaller asteroids.
      if (this.m.s.x > 0.6) {
        var n = spark.irand(2, 4);

        for(var i = 0;i < n;i++) {
          this.createAsteroid(this.layer, this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
        }
      }

      // Spawn some asteroid particles.
      demo.game.project.assets.explode.emit(this.layer, this.m.p, 0, 50);

      // Play the explosion sound.
      demo.game.project.assets.rumble_sound.woof();
    }
  });

  // Add a simple collider shape.
  collider.addBoxShape(-30, -30, 60, 60);
};

// All space objects wrap around the viewport.
demo.spaceObject = function() {

  // Wrap right to left.
  if (this.m.p.x - this.width / 2 > demo.game.scene.right)
    this.m.p.x -= demo.game.scene.width + this.width;

  // Wrap left to right.
  if (this.m.p.x + this.width / 2 < demo.game.scene.left)
    this.m.p.x += demo.game.scene.width + this.width;

  // Wrap bottom to top.
  if (this.m.p.y - this.height / 2 > demo.game.scene.bottom)
    this.m.p.y -= demo.game.scene.height + this.height;

  // Wrap top to bottom.
  if (this.m.p.y + this.height / 2 < demo.game.scene.top)
    this.m.p.y += demo.game.scene.height + this.height;
};

// Asteroids consistently move and spin.
demo.spin = function() {
  this.translate(spark.vscale(this.direction, this.step));
  this.rotate(this.rot * this.step);
};

// Handle player input.
demo.playerControls = function() {
  if (spark.keyDown(spark.KEY.LEFT)) this.rotate(-180 * this.step);
  if (spark.keyDown(spark.KEY.RIGHT)) this.rotate(180 * this.step);

  // Rotate/zoom the camera for fun.
  if (spark.keyDown(spark.KEY.A))
    this.scene.camera.rotate(-180 * this.step);
  if (spark.keyDown(spark.KEY.D))
    this.scene.camera.rotate(180 * this.step);
  if (spark.keyDown(spark.KEY.W))
    this.scene.camera.scale(2.0 * this.step);
  if (spark.keyDown(spark.KEY.S))
    this.scene.camera.scale(-2.0 * this.step);

  // Thrusting.
  if (spark.keyDown(spark.KEY.UP)) {
    this.thrust.x += 800.0 * this.step * -this.m.r.y;
    this.thrust.y -= 800.0 * this.step * this.m.r.x;

    // Emit some thrust particles.
    demo.game.project.assets.thrust.emit(
      this.layer,
      this.localToWorld([0, 55]),
      this.localToWorldAngle(-90.0),
      2);
  }

  // Shooting.
  if (spark.keyHit(spark.KEY.SPACE)) {
    var bullet = this.layer.spawn();

    // Sprite rendering.
    bullet.setImage(demo.game.project.assets.player_laser);

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
    demo.game.project.assets.laser_sound.woof();
  }

  // Move the player.
  this.m.p.x += this.thrust.x * this.step;
  this.m.p.y += this.thrust.y * this.step;

  // Dampening.
  this.thrust = spark.vscale(this.thrust, 0.98);
};

// Advance the bullet, slowly die off.
demo.bullet = function() {
  if ((this.alpha -= this.step) < 0) {
    this.dead = true;
  }

  // Move the bullet forward.
  this.translate([0, -1200 * this.step], true);
};
