// Game entry point...
//

var playerLayer;
var asteroidLayer;
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
    game.newTexture('asteroid_big_1.png'),
    game.newTexture('asteroid_big_2.png'),
    game.newTexture('asteroid_big_3.png'),
    game.newTexture('asteroid_big_4.png'),
  ];

  // wait until all loading is complete
  game.launch(() => {
    scene = new spark.Scene('middle', 1400, 1400);
    scene.setViewport(1400, 1400);

    asteroidsLayer = scene.newSpriteLayer();
    playerLayer = scene.newSpriteLayer();

    // spawn the player
    spawnPlayer();

    // spawn some asteroids
    for(i = 0;i < 2;i++) {
      spawnAsteroid();
    }

    // go
    scene.run();
  });
});

function spawnPlayer() {
  var sprite = playerLayer.newSprite();
  var body = sprite.addBody('player', c => {
    explosionSound.woof();
  });

  sprite.setTexture(spaceship);

  sprite.addBehavior(playerControls);
  sprite.addBehavior(wrap);

  body.addCircleShape(0, 0, 30);
}

function playerControls(sprite, step) {
  if (spark.Input.keyDown(spark.Input.Key.LEFT)) sprite.m.rotate(-180 * step);
  if (spark.Input.keyDown(spark.Input.Key.RIGHT)) sprite.m.rotate(180 * step);

  // spawn bullets
  for(var i = 0;i < spark.Input.keyHits(spark.Input.Key.SPACE);i++) {
    fire(sprite.layer, sprite.m);
  }

  if (spark.Input.keyHit(spark.Input.Key.T)) {
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
  var asteroid = asteroidsLayer.newSprite();
  var body = asteroid.addBody('asteroid', c => {
    //console.log(c.filter);
  });

  // pick a random image to use
  asteroid.setTexture(spark.Util.arand(asteroids));

  var w = asteroid.getWidth();
  var h = asteroid.getHeight();

  // add a box shape to the asteroid
  body.addBoxShape(-w / 2, - h / 2, w, h);

  // spawn at a random position
  asteroid.m.p.set(
    spark.Util.rand(scene.rect.getLeft(), scene.rect.getRight()),
    spark.Util.rand(scene.rect.getTop(), scene.rect.getBottom())
  );

  // random speed, direction, and angular velocity
  var s = spark.Util.rand(50, 200);
  var r = spark.Util.rand(0, 360);
  var v = spark.Vec.axis(r, s);
  var w = spark.Util.rand(-180, 180);

  asteroid.addBehavior(wrap);
  asteroid.addBehavior((sprite, step) => {
    sprite.m.translate(v.x * step, v.y * step);
    sprite.m.rotate(w * step);
  });

  spawn.playOn(asteroid);
}

function wrap(sprite) {
  var w = sprite.getWidth();
  var h = sprite.getHeight();

  if (sprite.m.p.x + w / 2 < scene.rect.getLeft())
    sprite.m.p.x += scene.rect.getWidth() + w;
  if (sprite.m.p.x - w / 2 > scene.rect.getRight())
    sprite.m.p.x -= scene.rect.getWidth() + w;
  if (sprite.m.p.y + h / 2 < scene.rect.getTop())
    sprite.m.p.y += scene.rect.getHeight() + h;
  if (sprite.m.p.y - h / 2 > scene.rect.getBottom())
    sprite.m.p.y -= scene.rect.getHeight() + h;
}
