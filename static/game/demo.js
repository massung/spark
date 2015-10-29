/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.game', 'spark.texture');

__MODULE__.init = function () {
  spark.main('canvas', 640, 480);

  // Start the game.
  spark.game.run(function(scene) {
    scene.sprites = new spark.texture.Image('assets/sprites.png');
    scene.atlas = new spark.texture.Atlas(scene.sprites, 'assets/sprites.json');

    game.demo.createPlayer();
  });
};

__MODULE__.createPlayer = function() {
  var sprite = new spark.entity.Sprite();

  sprite.setImage(spark.game.scene.atlas, 'ship.png');
  sprite.setPosition(spark.view.canvas.width / 2, spark.view.canvas.height / 2);
  sprite.addBehavior(game.demo.playerControls);
  sprite.addBehavior(game.demo.spaceObject);

  // Default settings for the sprite.
  sprite.thrust = spark.vec.ZERO;

  spark.game.scene.spawn(sprite);
};

// All space objects wrap around the viewport.
__MODULE__.spaceObject = function() {
  if (this.m.p.x > spark.view.canvas.width) this.m.p.x -= spark.view.canvas.width + this.width;
  if (this.m.p.x + this.width / 2 < 0) this.m.p.x += spark.view.canvas.width + this.width;
  if (this.m.p.y > spark.view.canvas.height) this.m.p.y -= spark.view.canvas.height + this.height;
  if (this.m.p.y + this.height / 2 < 0) this.m.p.y += spark.view.canvas.height + this.height;
};

__MODULE__.playerControls = function() {

  if (spark.input.keyDown(spark.input.KEY.LEFT)) this.rotate(180 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.RIGHT)) this.rotate(-180 * spark.game.step);

  // Thrusting.
  if (spark.input.keyDown(spark.input.KEY.UP)) {
    this.thrust.x += 400.0 * spark.game.step * -this.m.r.y;
    this.thrust.y -= 400.0 * spark.game.step * this.m.r.x;

    // Change the sprite image to one that shows the ship thrusting.
    this.setImage(spark.game.scene.atlas, 'ship_thrust.png');

    //this.scene.thrust.play();
  } else {

    // Change back to the idle ship.
    this.setImage(spark.game.scene.atlas, 'ship.png');
    //this.scene.thrust.pause();
  }

  // Move the player.
  this.m.p = spark.vec.vadd(this.m.p, spark.vec.vmult(this.thrust, spark.game.step));

  // Dampening.
  this.thrust = spark.vec.vmult(this.thrust, 0.98);
};

/*
  // Move and wrap.
  spaceObject: new entity.Behavior({
    update: function() {
      var w = view.canvas.width;
      var h = view.canvas.height;

      if (speed) {
        this.move(speed * game.step, 90.0, true);
      }

      if (this.x < -10) this.x += w + 20;
      if (this.y < -10) this.y += h + 20;
      if (this.x > w + 10) this.x -= w + 20;
      if (this.y > h + 10) this.y -= h + 20;
    },
  }),

  // Asteroid death.
  asteroidCommon: new entity.Behavior({
    start: function() {
      this.addCollision('asteroid', (function(filter) {
        if (filter === 'bullet') {
          this.dead = true;
        }
      }).bind(this));
    },
  });

  playerControls: new entity.Behavior({

    update: function() {
      if (input.keyDown(input.KEY.LEFT)) this.rotate(180 * game.step);
      if (input.keyDown(input.KEY.RIGHT)) this.rotate(-180 * game.step);

      // Thrusting.
      if (input.keyDown(input.KEY.UP)) {
        this.thrustx += 400.0 * game.step * -this.roty;
        this.thrusty += 400.0 * game.step * this.rotx;

        game.scene.thrust.play();
      } else {
        game.scene.thrust.pause();
      }

      // Move the player.
      this.x += this.thrustx * game.step;
      this.y -= this.thrusty * game.step;

      // Dampening.
      this.thrustx *= 0.98;
      this.thrusty *= 0.98;

      // Shoot?
      if (input.keyDown(input.KEY.SPACE) && this.shotDelay <= 0.0) {
        this.shotDelay = 0.15;

        game.scene.laser.woof();

        // Spawn bullet.
        this.layer.spawnChild(this, function(bullet) {
          bullet.verts = [0,4,0,-4];
          bullet.closedPoly = false;
          bullet.move(10, 90.0, true);
          bullet.age = 0;
          bullet.color = '#f00';
          bullet.width = 10;
          bullet.setScale(2);

          bullet.addBehavior(function() {
            this.move(600.0 * game.step, 90.0, true);
            this.alpha -= game.step;
            if ((this.age += game.step) > 1) {
              this.dead = true;
            }
          });

          // Add collision.
          bullet.addCollision('bullet', (function(filter, sprite) {
            if (filter == 'asteroid') {
              this.dead = true;
            }
          }).bind(bullet));
        });
      } else {
        this.shotDelay -= game.step;
      }
    },
  }),



  // Initialize the demo.
  init: function() {

    // Next tell it which canvas to use, optionally size it.
    spark.main('canvas', 960, 480);

    // Launch the game with an initial scene setup.
    game.run(function(scene) {

      // Some global data for the scene.
      scene.score = 0;
      scene.lives = 3;

      // Queue up assets to be loaded.
      scene.laser = new audio.Clip('assets/laser.wav');
      scene.boom = new audio.Clip('assets/boom.wav');
      scene.thrust = new audio.Clip('assets/thrust.ogg');

      // Add a GUI function to render UI.
      scene.gui = function() {
        view.fillStyle = '#ff4';
        view.font = 'bold 30px "Courier New"';
        view.fillText('Score: ' + this.score, 10, 30);
        view.fillText('FPS: ' + game.fps().toFixed(1), 300, 30);
      };

      // Create a layer for our sprites.
      scene.createLayer(function(layer) {

        scene.player = layer.spawn(function(sprite) {
          sprite.image = scene.ship;
          sprite.setPosition(view.canvas.width / 2, view.canvas.height / 2);
          sprite.verts = [-5,-7,-8,0,-2,3,2,3,8,0,5,-7,10,0,5,6,-5,6,-10,0];
          sprite.color = '#f0f';
          sprite.width = 10;
          sprite.setScale(1.5);
          sprite.thrustx = 0.0;
          sprite.thrusty = 0.0;
          sprite.shotDelay = 0.0;

          // This is a space object, so it wraps.
          sprite.addBehavior(demo.spaceObject);
          sprite.addBehavior(demo.playerControls);

          // Add collision to this object.
          sprite.addCollision('player', function(filter) {
            if (filter == 'asteroid') {
              game.scene.boom.woof();
              this.dead = true;
            }
          });
        });

        // Spawn 3 asteroids.
        for(var i = 0;i < 50;i++) {
          demo.spawnAsteroid(layer, 3.0);
        }
      });
    });
  },

  spawnAsteroid: function(layer, size, setup) {
    layer.spawn(function(sprite) {
      var x = Math.random() * view.canvas.width;
      var y = Math.random() * view.canvas.height;
      var r = Math.random() * 360.0 - 180.0;
      var a = Math.random() * 360.0 - 180.0;
      var s = Math.random() * 100.0;

      sprite.setPosition(x, y);
      sprite.setScale(size);

      sprite.color = '#ccc';

      // Create randomly shaped asteroids.
      for(var v = 0;v < 8;v++) {
        var r = Math.random() * 12 + 8;
        var k = Math.PI * 2 * v / 8;

        sprite.verts.push(Math.cos(k) * r, Math.sin(k) * r);
      }

      sprite.addBehavior(function() {
        this.move(s * game.step, a, false);
        this.rotate(r * game.step);
      });

      sprite.addBehavior(demo.wrap);
/*
      sprite.addCollision('asteroid', function(filter) {
        if (filter == 'bullet') {
          game.scene.boom.woof();
          this.dead = true;
          game.scene.score += 50 * size;

          // TODO: spawn more?
          if (size > 1.0) {
            for(var i = 0;i < 3;i++) {
              demo.spawnAsteroid(layer, size - 1.0, (function(newSprite) {
                newSprite.setPosition(this.x, this.y);
              }).bind(this));
            }
          }
        }
      });
      if (setup) {
        setup(sprite);
      }
    });
  },

  playerControls: function() {


  },

  //
  wrap: function() {
    var w = view.canvas.width;
    var h = view.canvas.height;

    if (this.x < -10) this.x += w + 20;
    if (this.y < -10) this.y += h + 20;
    if (this.x > w + 10) this.x -= w + 20;
    if (this.y > h + 10) this.y -= h + 20;
  },
});
*/
