/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.game');

__MODULE__.init = function () {
  spark.main('canvas', 640, 480);

  // Start the game.
  spark.game.run(function(scene) {

    // Starfield background.
    scene.starfield = new spark.texture.Image('game/assets/background.png');

    // Big asteroids.
    scene.asteroid = [
      new spark.texture.Image('game/assets/asteroid_big_1.png'),
      new spark.texture.Image('game/assets/asteroid_big_2.png'),
      new spark.texture.Image('game/assets/asteroid_big_3.png'),
      new spark.texture.Image('game/assets/asteroid_big_4.png'),
    ];

    // Particle asteroids.
    scene.asteroid_particle = [
      new spark.texture.Image('game/assets/asteroid_particle_1.png'),
      new spark.texture.Image('game/assets/asteroid_particle_2.png'),
    ];

    // The player spaceship images.
    scene.player_ship = new spark.texture.Image('game/assets/player.png');
    scene.player_thrust = new spark.texture.Image('game/assets/thrust.png');
    scene.player_laser = new spark.texture.Image('game/assets/laser.png');
    scene.player_shield = new spark.texture.Image('game/assets/shield.png');

    // Audio clips.
    scene.pickup_sound = new spark.audio.Clip('game/assets/pickup.ogg');
    scene.laser_sound = new spark.audio.Clip('game/assets/laser.ogg');
    scene.rumble_sound = new spark.audio.Clip('game/assets/rumble.ogg');

    // Change the projection so the origin is in the middle.
    scene.setProjection(0.5, 'middle');

    // Spawn the player.
    game.demo.createPlayer();

    // Spawn 3 large asteroids.
    for(var i = 0;i < 3;i++) {
      game.demo.createAsteroid();
    }
  });
};

__MODULE__.createPlayer = function() {
  var sprite = new spark.entity.Sprite();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.setImage(spark.game.scene.player_ship);
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

  // Add it to the scene.
  spark.game.scene.spawn(sprite);
};

__MODULE__.createAsteroid = function(x, y, scale) {
  var sprite = new spark.entity.Sprite();

  // Initial properties.
  sprite.direction = [Math.random() * 200 - 100, Math.random() * 200 - 100];
  sprite.rot = Math.random() * 360 - 180;

  // Sprite initialization.
  sprite.setImage(spark.game.scene.asteroid[Math.floor(Math.random() * spark.game.scene.asteroid.length)]);
  sprite.setPosition(
    x || Math.random() * spark.game.scene.width + spark.game.scene.left,
    y || Math.random() * spark.game.scene.height + spark.game.scene.top);

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
        var n = 2 + Math.round(Math.random() * 2);

        for(var i = 0;i < n;i++) {
          game.demo.createAsteroid(this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
        }
      }

      // TODO: Spawn some particles.

      // Play the explosion sound.
      spark.game.scene.rumble_sound.woof();
    }
  });

  // Add a simple collider shape.
  collider.addBoxShape(-30, -30, 60, 60);

  // Add it to the scene.
  spark.game.scene.spawn(sprite);
};

// All space objects wrap around the viewport.
__MODULE__.spaceObject = function() {

  // Wrap right to left.
  if (this.m.p.x - this.width / 2 > this.scene.right)
    this.m.p.x -= this.scene.width + this.width;

  // Wrap left to right.
  if (this.m.p.x + this.width / 2 < this.scene.left)
    this.m.p.x += this.scene.width + this.width;

  // Wrap bottom to top.
  if (this.m.p.y - this.height / 2 > this.scene.bottom)
    this.m.p.y -= this.scene.height + this.height;

  // Wrap top to bottom.
  if (this.m.p.y + this.height / 2 < this.scene.top)
    this.m.p.y += this.scene.height + this.height;
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

  // Thrusting.
  if (spark.input.keyDown(spark.input.KEY.UP)) {
    this.thrust.x += 400.0 * spark.game.step * -this.m.r.y;
    this.thrust.y -= 400.0 * spark.game.step * this.m.r.x;

    // Change the sprite image to one that shows the ship thrusting.
    //this.setImage(spark.game.scene.atlas, 'ship_thrust.png');

    //this.scene.thrust.play();
  } else {

    // Change back to the idle ship.
    //this.setImage(spark.game.scene.atlas, 'ship.png');
    //this.scene.thrust.pause();
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE)) {
    var bullet = new spark.entity.Sprite();

    // Sprite rendering.
    bullet.setImage(spark.game.scene.player_laser);

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

    // Add the bullet to the scene and play a sound.
    this.scene.spawn(bullet);
    this.scene.laser_sound.woof();
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
  this.translate([0, -600 * spark.game.step], true);
};
