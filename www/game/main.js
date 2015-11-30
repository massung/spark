/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.main('canvas');

var t = new spark.Tween([{frame: 1, value: 0}, {frame: 30, value: 360}], 30, 30, spark.Interpolation.LINEAR);

// launch the project...
spark.launch('game/project.json', proj => {
  var scene = new spark.Scene(spark.Origin.MIDDLE, 1500, 1500);

  // set the camera viewport size
  scene.setViewport(1500, 1500);

  // TODO: setup the scene
  var sprite = scene.spawn();

  sprite.texture = spark.project.assets.player_ship;
  sprite.addBehavior(emit);


  // run the scene
  scene.run();
});

function emit(sprite, step) {
  if (spark.keyHit(spark.Key.T)) {
    sprite.rig.play(spark.project.assets.spawn.instantiate(sprite, e => {console.log(e);}));
  }
  //if (spark.keyDown(spark.Key.LEFT)) sprite.m.rotate(-180 * step);
  //if (spark.keyDown(spark.Key.RIGHT)) sprite.m.rotate(180 * step);
  if (spark.keyDown(spark.Key.UP)) sprite.m.translate(0, -10 * step, true);
  if (spark.keyDown(spark.Key.DOWN)) sprite.m.translate(0, 10 * step, true);

  if (spark.keyDown(spark.Key.SPACE)) {
    var v = sprite.scene.screenToWorld(spark.x, spark.y);

    spark.project.assets.explosion.woof();
    spark.project.assets.emitter.emit(sprite.scene, v.x, v.y, 0, 20);
  }
}

/*
// Called once the spark framework is fully loaded.
demo.init = function () {

  // Create the game and run it.
  spark.game.run('game/project.json', (function(scene) {


    // Create layers for the asteroids, player, and particles.
    this.bg1Layer = scene.addLayer(new spark.layer.BackgroundLayer());
    this.planetLayer = scene.addLayer(new spark.layer.SpriteLayer(10));
    this.asteroidsLayer = scene.addLayer(new spark.layer.SpriteLayer(200));
    this.playerLayer = scene.addLayer(new spark.layer.SpriteLayer(50));

    // Setup the background.
    this.bg1Layer.image = spark.project.assets.starfield;
    this.bg1Layer.m.setScale(6);

    // Create the player.
    this.createPlayer(this.playerLayer);
    this.createPlanet(this.planetLayer);

    // Spawn 3 large asteroids.
    for(var i = 0;i < 6;i++) {
      this.createAsteroid(this.asteroidsLayer);
    }

    // Create the score label.
    this.score = scene.addGui(new spark.gui.Label(0, {
      x: 10,
      y: 10,
      fillStyle: '#ff0',
      font: '36px virgo',
      textBaseline: 'hanging',
    }));

    // Ammo counter.
    this.ammo = scene.addGui(new spark.gui.Label(20, {
      x: -10,
      y: 10,
      fillStyle:'#f40',
      font: '36px virgo',
      textBaseline: 'hanging',
      textAlign: 'right',
    }));

    // Reload warning.
    this.reload = scene.addGui(new spark.gui.Label('RELOAD!', {
      x: -10,
      y: 10,
      fillStyle:'#f40',
      font: '36px virgo',
      textBaseline: 'hanging',
      textAlign: 'right',
      shadowColor: '#f0f',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    }));

    // Hide the reload warning.
    this.reload.visible = false;

    // Play a timeline on the reload warning.
    this.reload.play(spark.project.assets.reload);
  }).bind(this));
};

demo.createPlanet = function (layer) {
  var sprite = layer.spawn();
  sprite.image = spark.project.assets.planet;
  sprite.m.setTranslation(0, 0);
  sprite.m.setScale(0.20);
};

demo.createPlayer = function(layer) {
  var sprite = layer.spawn();

  // Initial properties.
  sprite.thrust = spark.vec.ZERO;

  // Sprite rendering.
  sprite.image = spark.project.assets.player_ship;
  sprite.m.setTranslation(0, 0);

  sprite.addBehavior(demo.playerControls);
  sprite.addBehavior(demo.spaceObject);

  // Add collision now.
  var collider = sprite.addCollider('player', function(c) {
    //if (c.filter === 'asteroid') {
      //sprite.dead = true;

      // Spawn a new player object.
      //demo.createPlayer(layer);
    //}
  });

  collider.addCircle(0, 0, 30);

  // Start the timeline.
  return sprite;
};

demo.createAsteroid = function(layer, x, y, scale) {
  var sprite = layer.spawn();
  var s = 150;

  // Initial properties.
  sprite.v = [spark.util.rand(-s, s), spark.util.rand(-s, s)];
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
    if (c.filter == 'bullet' && !c.object.dead) {
      this.dead = true;

      // Kill the bullet so it won't collide with more asteroids.
      c.object.dead = true;

      // Spawn 2-4 smaller asteroids.
      if (this.m.s.x > 0.7) {
        demo.createAsteroid(this.layer, this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
        demo.createAsteroid(this.layer, this.m.p.x, this.m.p.y, this.m.s.x * 0.75);
      }

      // Increase the score.
      demo.score.value += 50;

      // Spawn some asteroid particles.
      spark.project.assets.explode.emit(this.layer, this.m.p, 0, 20);

      // Play the explosion sound.
      spark.project.assets.explosion.woof();

      // Shake the camera a little.
      spark.game.scene.camera.play(spark.project.assets.camera_shake);
    }
  });

  // Add a simple collider shape.
  collider.addBox(-30, -30, 60, 60);

  // Play an initial animation on the asteroid.
  sprite.play(spark.project.assets.spawn);
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
  this.m.translate(spark.vec.vscale(this.v, spark.game.step));
  this.m.rotate(this.rot * spark.game.step);
};

// Handle player input.
demo.playerControls = function() {
  if (spark.input.keyDown(spark.input.KEY.LEFT)) this.m.angle += 180 * spark.game.step;
  if (spark.input.keyDown(spark.input.KEY.RIGHT)) this.m.angle -= 180 * spark.game.step;

  // Thrusting.
  if (spark.input.keyDown(spark.input.KEY.UP)) {
    this.thrust.x += 800.0 * spark.game.step * -this.m.r.y;
    this.thrust.y -= 800.0 * spark.game.step * this.m.r.x;

    if (Math.abs(this.thrust.x) > 400)
      this.thrust.x = 400 * Math.sign(this.thrust.x);
    if (Math.abs(this.thrust.y) > 400)
      this.thrust.y = 400 * Math.sign(this.thrust.y);

    // Emit some thrust particles.
    spark.project.assets.thrust.emit(
      this.layer,
      this.localToWorld([0, 55]),
      this.localToWorldAngle(-90.0),
      1);

    // Play the thrust sound.
    spark.project.assets.thrust_sound.loop();
  } else {
    spark.project.assets.thrust_sound.stop();
  }

  // Shooting.
  if (spark.input.keyHit(spark.input.KEY.SPACE) && demo.ammo.value > 0) {
    var bullet = this.layer.spawn();

    // Sprite rendering.
    bullet.image = spark.project.assets.player_laser;
    bullet.age = 1.0;

    // Spawn in front of the player.
    bullet.m.p = this.localToWorld([0, -30]);
    bullet.m.angle = this.m.angle;

    // Add some callback behaviors.
    bullet.addBehavior(game.demo.bullet);

    // Add a collision filter and callback.
    var collider = bullet.addCollider('bullet');

    // Add a simple collider shape.
    collider.addSegment(0, -10, 0, 10);

    // Play a sound.
    spark.project.assets.laser_sound.woof();

    // Use up a bullet.
    if (--demo.ammo.value === 0) {
      demo.ammo.visible = false;
      demo.reload.visible = true;
    }
  }

  // Reload.
  if (spark.input.keyHit(spark.input.KEY.DOWN)) {
    spark.project.assets.reload_sound.woof();
    demo.ammo.value = 20;
    demo.ammo.visible = true;
    demo.reload.visible = false;
  }

  // Move the player.
  this.m.p.x += this.thrust.x * spark.game.step;
  this.m.p.y += this.thrust.y * spark.game.step;

  // Scroll the background layer by the thrust.
  demo.bg1Layer.m.p.x -= this.thrust.x * spark.game.step * 0.15;
  demo.bg1Layer.m.p.y -= this.thrust.y * spark.game.step * 0.15;

  // Dampening.
  this.thrust = spark.vec.vscale(this.thrust, 0.99);
};

// Advance the bullet, slowly die off.
demo.bullet = function() {
  if ((this.age -= spark.game.step) < 0) {
    this.dead = true;
  }

  // Move the bullet forward.
  this.m.translate([0, -1400 * spark.game.step], true);
};
*/
