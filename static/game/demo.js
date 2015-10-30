/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.game', 'spark.texture', 'spark.audio');

__MODULE__.init = function () {
  spark.main('canvas', 640, 480);

  // Start the game.
  spark.game.run(function(scene) {
    scene.sprites = new spark.texture.Image('assets/sprites.png');
    scene.atlas = new spark.texture.Atlas(scene.sprites, 'assets/sprites.json');
    scene.thrust = new spark.audio.Clip('assets/thrust.ogg');
    scene.laser = new spark.audio.Clip('assets/laser.wav');

    game.demo.createPlayer();

    for(var i = 0;i < 3;i++) {
      game.demo.createAsteroid([
        'asteroid_large.png',
        'asteroid_small.png',
        'asteroid_tiny.png',
      ]);
    }
  });
};

__MODULE__.createPlayer = function() {
  var sprite = new spark.entity.Sprite();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.setImage(spark.game.scene.atlas, 'ship.png');
  sprite.setPosition(spark.view.canvas.width / 2, spark.view.canvas.height / 2);

  // Add some callback behaviors.
  sprite.addBehavior(game.demo.playerControls);
  sprite.addBehavior(game.demo.spaceObject);

  // Add a collision filter and callback.
  sprite.addCollision('player', function(filter) {
    // TODO: if (filter === 'asteroid') die();
  });

  // Add a simple collider shape.
  sprite.addCircleShape([0, 0], 15);

  // Add it to the scene.
  spark.game.scene.spawn(sprite);
};

__MODULE__.createAsteroid = function(images) {
  var sprite = new spark.entity.Sprite();

  // Initial properties.
  sprite.direction = [Math.random() * 200 - 100, Math.random() * 200 - 100];
  sprite.rot = Math.random() * 360 - 180;
  sprite.children = images;

  // Sprite rendering.
  sprite.setImage(spark.game.scene.atlas, sprite.children.shift());
  sprite.setPosition(Math.random() * spark.view.canvas.width, Math.random() * spark.view.canvas.height);

  // Add some callback behaviors.
  sprite.addBehavior(game.demo.spin);
  sprite.addBehavior(game.demo.spaceObject);

  // Add a collision filter and callback.
  sprite.addCollision('asteroid', function(filter) {
    // TODO: if (filter == 'bullet') die();
  });

  // Add a simple collider shape.
  sprite.addBoxShape(-10, -10, 20, 20);

  // Add it to the scene.
  spark.game.scene.spawn(sprite);
};

// All space objects wrap around the viewport.
__MODULE__.spaceObject = function() {
  if (this.m.p.x > spark.view.canvas.width) this.m.p.x -= spark.view.canvas.width + this.width;
  if (this.m.p.x + this.width / 2 < 0) this.m.p.x += spark.view.canvas.width + this.width;
  if (this.m.p.y > spark.view.canvas.height) this.m.p.y -= spark.view.canvas.height + this.height;
  if (this.m.p.y + this.height / 2 < 0) this.m.p.y += spark.view.canvas.height + this.height;
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
    this.setImage(spark.game.scene.atlas, 'ship_thrust.png');

    this.scene.thrust.play();
  } else {

    // Change back to the idle ship.
    this.setImage(spark.game.scene.atlas, 'ship.png');
    this.scene.thrust.pause();
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE) || spark.input.keyHit(spark.input.KEY.X)) {
    var bullet = new spark.entity.Sprite();

    // Sprite rendering.
    bullet.setImage(spark.game.scene.atlas, 'bullet.png');

    // Spawn in front of the player.
    bullet.m.p = this.localToWorld([0, -20]);
    bullet.m.r = this.m.r;

    // Add some callback behaviors.
    bullet.addBehavior(game.demo.bullet);

    // Add a collision filter and callback.
    bullet.addCollision('bullet', function(sprite) {
      if (sprite.collision.filter === 'asteroid') {
        this.dead = true;
      }
    });

    // Add a simple collider shape.
    bullet.addSegmentShape([0, -10], [0, 10]);

    // Add the bullet to the scene and play a sound.
    this.scene.spawn(bullet);
    this.scene.laser.woof();
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
