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
    scene.setPlayfield('middle', spark.view.canvas.width * 2, spark.view.canvas.height * 2);
    scene.setViewport(scene.width, scene.height);

    // Create layers for the asteroids, player, and particles.
    this.bgLayer = scene.addLayer(new spark.layer.BackgroundLayer());
    this.asteroidsLayer = scene.addLayer(new spark.layer.SpriteLayer(200));
    this.playerLayer = scene.addLayer(new spark.layer.SpriteLayer(50));

    // Setup the background.
    this.bgLayer.image = spark.project.assets.starfield;
    this.bgLayer.m.setScale(4);

    // Create the player.
    this.createPlayer(this.playerLayer);

    // Spawn 3 large asteroids.
    for(var i = 0;i < 6;i++) {
      this.createAsteroid(this.asteroidsLayer);
    }

    // Create the score label.
    this.score = scene.addGui(new spark.gui.Label(0, {
      x: 10,
      y: 10,
      fillStyle: '#ff0',
      font: '20px BulletproofBB',
      textBaseline: 'hanging',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#fff',
    }));

    // An energy bar.
    this.energy = scene.addGui(new spark.gui.Meter(100, 100, {
      x: 10,
      y: -10,
      width: 140,
      height: 16,
      strokeStyle: '#fff',
      fillStyle: '#0f8',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#fff',
    }));

    // Ammo counter.
    this.ammo = scene.addGui(new spark.gui.Label(20, {
      x: -10,
      y: 10,
      fillStyle:'#f40',
      font: '20px BulletproofBB',
      textBaseline: 'hanging',
      textAlign: 'right',
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: '#f00',
    }));
  }).bind(this));
};

demo.createPlayer = function(layer) {
  var sprite = layer.spawn();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.image = spark.project.assets.player_ship;
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

  // Pick a random sprite image.
  sprite.image = spark.util.arand([
    spark.project.assets.asteroid_0,
    spark.project.assets.asteroid_1,
    spark.project.assets.asteroid_2,
    spark.project.assets.asteroid_3,
  ]);

  // Initial position.
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
    if (c.filter == 'bullet' && !c.owner.dead) {
      this.dead = true;

      // Kill the bullet so it won't collide with more asteroids.
      c.owner.dead = true;

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
      spark.project.assets.explosion.woof();

      // Shake the camera a little.
      spark.game.scene.camera.playAnimation(spark.project.assets.camera_shake);
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
    spark.game.scene.camera.m.rotate(-180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.D))
    spark.game.scene.camera.m.rotate(180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.W))
    spark.game.scene.camera.m.scale(0.01 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.S))
    spark.game.scene.camera.m.scale(-0.01 * spark.game.step);

  // Timeline test.
  if (spark.input.keyHit(spark.input.KEY.T)) {
    this.playAnimation(spark.project.assets.timeline_test, function(event) {
      console.log(event);
    });
  }

  // Thrusting.
  if (spark.input.keyDown(spark.input.KEY.UP)) {
    if (demo.energy.value > 0) {
      this.thrust.x += 800.0 * spark.game.step * -this.m.r.y;
      this.thrust.y -= 800.0 * spark.game.step * this.m.r.x;

      // Emit some thrust particles.
      spark.project.assets.thrust.emit(
        this.layer,
        this.localToWorld([0, 55]),
        this.localToWorldAngle(-90.0),
        1);

      // Use some energy.
      demo.energy.value -= 20 * spark.game.step;

      // Play the thrust sound.
      spark.project.assets.thrust_sound.loop();
    } else {
      spark.project.assets.thrust_sound.stop();
    }
  } else {
    demo.energy.value += 10 * spark.game.step;

    // Stop the thrust sound.
    spark.project.assets.thrust_sound.stop();
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE) && demo.ammo.value > 0) {
    var bullet = this.layer.spawn();

    // Sprite rendering.
    bullet.image = spark.project.assets.player_laser;

    // Spawn in front of the player.
    bullet.m.p = this.localToWorld([0, -30]);
    bullet.m.angle = this.m.angle;

    // Add some callback behaviors.
    bullet.addBehavior(game.demo.bullet);

    // Add a collision filter and callback.
    var collider = bullet.addCollider('bullet');

    // Add a simple collider shape.
    collider.addSegment([0, -10], [0, 10]);

    // Play a sound.
    spark.project.assets.laser_sound.woof();

    // Use up a bullet.
    demo.ammo.value--;
  }

  // Reload.
  if (spark.input.keyHit(spark.input.KEY.R)) {
    spark.project.assets.reload_sound.woof();
    demo.ammo.value = 20;
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
  this.m.translate([0, -1400 * spark.game.step], true);
};
