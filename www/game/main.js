// Game entry point...
//

var sprites;
var scene;
var player;
var spaceship;
var explosionSound;
var laserSound;
var shake;
var spawn;
var asteroids;

// launch the game and go!
spark.Game.main('game/project.json', game => {
  spaceship = game.newTexture('player.png');
  laser = game.newTexture('laser.png');
  laserSound = game.newSound('laser.mp3');
  explosionSound = game.newSound('explosion.mp3');
  spawn = game.newTimeline('spawn.json');
  shake = game.newTimeline('shake.json');
  asteroids = [
    game.newTexture('asteroid_big_1'),
    game.newTexture('asteroid_big_2'),
    game.newTexture('asteroid_big_3'),
    game.newTexture('asteroid_big_4'),
  ];

  // wait until all loading is complete
  game.launch(() => {
    scene = new spark.Scene('middle', 1400, 1400);
    scene.setViewport(1400, 1400);

    sprites = scene.newSpriteLayer();

    // spawn the player
    player = sprites.newSprite();
    player.setTexture(spaceship);
    player.addBehavior(playerControls);

    // spawn some asteroids
    for(i = 0;i < 10;i++) {
      spawnAsteroid();
    }

    // go
    scene.run();
  });
});

function playerControls(sprite, step) {
  if (spark.Input.keyDown(spark.Input.Key.LEFT)) player.m.rotate(-180 * step);
  if (spark.Input.keyDown(spark.Input.Key.RIGHT)) player.m.rotate(180 * step);

  // spawn bullets
  for(var i = 0;i < spark.Input.keyHits(spark.Input.Key.SPACE);i++) {
    fire(sprite.layer, sprite.m);
  }

  if (spark.Input.keyHit(spark.Input.Key.T)) {
    spawn.playOn(sprite);
    shake.playOn(scene.camera);
  }
}

function fire(layer, m) {
  var bullet = layer.newSprite();

  bullet.m.p = m.transform(new spark.Vec(0, -60));
  bullet.m.r = m.r.copy();

  // texture
  bullet.setTexture(laser);

  // create movement behavior
  bullet.addBehavior((sprite, step, data) => {
    sprite.m.translate(0, -800 * step, true);
    sprite.dead = (data.age += step) > 1;
  }, { age: 0.0 });

  laserSound.woof();
}

function spawnAsteroid() {
  var asteroid = scene.newSprite();

  asteroid.setTexture(spark.Util.arand(asteroids));
  asteroid.m.p.set(spark.Util.rand(scene.getLeft(), scene.getRight()), spark.Util.rand(scene.getTop(), scene.getBottom()));

  asteroid.addBehavior(wrap);
  asteroid.addBehavior(function());
}
