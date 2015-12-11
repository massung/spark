// Game entry point...
//

var scene;
var playerLayer;
var asteroidLayer;
var starsLayer;
var player;

// create a new game instance
spark.Game.main('game/project.xml', proj => {

  // TODO: ??

  proj.launch(() => {
    scene = new spark.Scene('middle', 1400, 1400);
    scene.setViewport(1400, 1400);

    starsLayer = scene.newBackgroundLayer(spark.Game.project.getQuad('stars'));
    asteroidsLayer = scene.newSpriteLayer();
    playerLayer = scene.newSpriteLayer();

    // scale the stars layer so the stars are visible
    starsLayer.m.s.set(4, 4);

    // spawn the player
    player = spawnPlayer();

    // spawn some asteroids
    for(i = 0;i < 10;i++) {
      spawnAsteroid();
    }

    // go
    scene.run();
  });
});

function spawnPlayer() {
  var sprite = playerLayer.newSprite();

  sprite.newBehavior(playerControls, { thrust: new spark.Vec(0, 0), });
  sprite.newBehavior(wrap);

  sprite.newBody().newCircleShape(0, 0, 30);

  sprite.quad = spark.Game.project.getQuad('spaceship');

  return sprite;
}

function playerControls(sprite, step, data) {
  if (spark.Key.down(spark.Key.LEFT)) sprite.m.rotate(-180 * step);
  if (spark.Key.down(spark.Key.RIGHT)) sprite.m.rotate(180 * step);

  // spawn bullets
  for(var i = 0;i < spark.Key.hits(spark.Key.SPACE);i++) {
    shoot(sprite.getLayer(), sprite.m);
  }

  // thrust forward
  if (spark.Key.down(spark.Key.UP)) {
    var p = sprite.localToWorld(new spark.Vec(0, 60));
    var r = sprite.localToWorldAngle(90);

    var d = new spark.Vec(0, -600 * step).rotate(sprite.m.r);

    data.thrust.x += d.x;
    data.thrust.y += d.y;

    // emit some particles
    spark.Game.project.getEmitter('thrust.xml').emit(sprite.getLayer(), p.x, p.y, sprite.m.r.angle(), r);
  } else {
    // TODO: stop the sound
  }

  // move based on thrust
  sprite.m.translate(data.thrust.x * step, data.thrust.y * step);

  // scroll the background
  starsLayer.m.translate(data.thrust.x * step * 0.8, data.thrust.y * step * 0.8);

  // dampen
  data.thrust.x *= 0.98;
  data.thrust.y *= 0.98;
}

function shoot(layer, m) {
  var bullet = layer.newSprite();
  var body = bullet.newBody('bullet');

  bullet.m.p = m.transform(new spark.Vec(0, -60));
  bullet.m.r = m.r.copy();

  // texture
  bullet.quad = spark.Game.project.getQuad('laser.png');
  body.newSegmentShape(0, -10, 0, 10);

  // create movement behavior
  bullet.newBehavior((sprite, step, data) => {
    sprite.m.translate(0, -data.speed * step, true);
    sprite.dead = (data.age += step) > 1;
  }, {
    speed: 800,
    age: 0.0,
  });

  spark.Game.project.getSound('laser.mp3').woof();
}

function spawnAsteroid() {
  var asteroid = asteroidsLayer.newSprite();
  var body = asteroid.newBody('asteroid', (a, b) => {
    if (b.filter === 'bullet') {
      a.getObject().dead = true;
      b.getObject().dead = true;

      explodeAsteroid(a.getObject());
    }
  });

  // pick a random image to use
  asteroid.quad = spark.Util.arand([
    spark.Game.project.getQuad('asteroid_big_1.png'),
    spark.Game.project.getQuad('asteroid_big_2.png'),
    spark.Game.project.getQuad('asteroid_big_3.png'),
    spark.Game.project.getQuad('asteroid_big_4.png'),
  ]);

  var w = asteroid.getWidth();
  var h = asteroid.getHeight();

  // add a box shape to the asteroid
  body.newBoxShape(-w * 3 / 8, - h * 3 / 8, w * 3 / 4, h * 3 / 4);

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

  asteroid.newBehavior(wrap);
  asteroid.newBehavior((sprite, step) => {
    sprite.m.translate(v.x * step, v.y * step);
    sprite.m.rotate(w * step);
  });

  asteroid.playTimeline(spark.Game.project.getTimeline('spawn.xml'));
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

function explodeAsteroid(sprite) {
  scene.camera.playTimeline(spark.Game.project.getTimeline('shake.xml'));

  spark.Game.project.getSound('explosion.mp3').woof();
  spark.Game.project.getEmitter('explosion.xml').emit(sprite.getLayer(), sprite.m.p.x, sprite.m.p.y, 0, 0, 20);
}
