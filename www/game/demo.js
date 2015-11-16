/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

var demo = spark.main('canvas');

// Called once the spark framework is fully loaded.
demo.init = function () {

  // Create the game and run it.
  spark.game.run('game/project.json', (function(scene) {

    // Change the projection so the origin is in the middle.
    scene.setProjection('middle', 0.5);

    // Create layers for the asteroids, player, and particles.
    this.bgLayer = scene.addLayer(new spark.layer.BackgroundLayer());
    this.asteroidsLayer = scene.addLayer(new spark.layer.SpriteLayer(200));
    this.playerLayer = scene.addLayer(new spark.layer.SpriteLayer(50));

    // Setup the background.
    this.bgLayer.image = spark.project.assets.starfield;
    this.bgLayer.m.setScale(2);

    // Create the player.
    this.createPlayer(this.playerLayer);

    // Spawn 3 large asteroids.
    for(var i = 0;i < 6;i++) {
      this.createAsteroid(this.asteroidsLayer);
    }

    // Create the score label.
    this.score = scene.addGui(new spark.gui.Label(0, {
      fillStyle: '#ff0',
      font: '20px BulletproofBB',
      textBaseline: 'hanging',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#ff0',
    }));

    this.score.x = 10;
    this.score.y = 10;

    // An energy bar.
    this.energy = scene.addGui(new spark.gui.Meter(100, 100, {
      strokeStyle: '#fff',
      fillStyle: '#c8f',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#f8f',
    }));

    this.energy.x = 10;
    this.energy.y = -10;
  }).bind(this));
};

demo.createPlayer = function(layer) {
  var sprite = layer.spawn();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.setImage(spark.project.assets.player_ship);
  sprite.m.setTranslation(0, 0);

  // Add some callback behaviors.
  sprite.addBehavior(demo.playerControls);
  sprite.addBehavior(demo.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('player', function(filter) {
    // TODO: if (filter === 'asteroid') die();
  });

  // Add a simple collider shape.
  collider.addCircle([0, 0], 30);

  return sprite;
};

demo.createAsteroid = function(layer, x, y, scale) {
  var sprite = layer.spawn();
  var s = 150;

  // Initial properties.
  sprite.direction = [spark.util.rand(-s, s), spark.util.rand(-s, s)];
  sprite.rot = spark.util.rand(-180, 180);

  // Sprite initialization.
  sprite.setImage(spark.project.assets.asteroid_1);
  sprite.m.setTranslation(
    x || spark.util.rand(spark.game.scene.left, spark.game.scene.right),
    y || spark.util.rand(spark.game.scene.top, spark.game.scene.bottom));

  // Set the scale
  sprite.m.setScale(scale || 1.0);

  // Add some callback behaviors.
  sprite.addBehavior(this.spin);
  sprite.addBehavior(this.spaceObject);

  // Add a collision filter and callback.
  var collider = sprite.addCollider('asteroid', function(c) {
    if (c.filter == 'bullet') {
      this.dead = true;

      // Spawn 2-4 smaller asteroids.
      if (this.m.s.x > 0.6) {
        var n = spark.util.irand(2, 4);

        for(var i = 0;i < n;i++) {
          demo.createAsteroid(this.layer, this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
        }
      }

      // Increase the score.
      demo.score.value += 50;

      // Spawn some asteroid particles.
      spark.project.assets.explode.emit(this.layer, this.m.p, 0, 20);

      // Play the explosion sound.
      spark.project.assets.rumble_sound.woof();
    }
  });

  // Add a simple collider shape.
  collider.addBox(-30, -30, 60, 60);
};

// All space objects wrap around the viewport.
demo.spaceObject = function() {

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
demo.spin = function() {
  this.m.translate(spark.vec.vscale(this.direction, spark.game.step));
  this.m.rotate(this.rot * spark.game.step);
};

// Handle player input.
demo.playerControls = function() {
  if (spark.input.keyDown(spark.input.KEY.LEFT)) this.m.rotate(-180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.RIGHT)) this.m.rotate(180 * spark.game.step);

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
      this.layer,
      this.localToWorld([0, 55]),
      this.localToWorldAngle(-90.0),
      1);

    // Use some energy.
    demo.energy.value -= 10 * spark.game.step;
  } else {
    demo.energy.value += 10 * spark.game.step;
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE)) {
    var bullet = this.layer.spawn();

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
    collider.addSegment([0, -10], [0, 10]);

    // Play a sound.
    spark.project.assets.laser_sound.woof();
  }

  // Move the player.
  this.m.p.x += this.thrust.x * spark.game.step;
  this.m.p.y += this.thrust.y * spark.game.step;

  // Scroll the background layer by the thrust.
  demo.bgLayer.m.p.x -= this.thrust.x * spark.game.step * 0.5;
  demo.bgLayer.m.p.y -= this.thrust.y * spark.game.step * 0.5;

  // Dampening.
  this.thrust = spark.vec.vscale(this.thrust, 0.98);
};

// Advance the bullet, slowly die off.
demo.bullet = function() {
  if ((this.alpha -= spark.game.step) < 0) {
    this.dead = true;
  }

  // Move the bullet forward.
  this.m.translate([0, -1200 * spark.game.step], true);
};
