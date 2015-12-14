// Game entry point...
//

var scene;
var playerLayer;
var asteroidLayer;
var starsLayer;
var moonLayer;
var player;

// create a new game instance
spark.Game.main('game/project.xml', proj => {

  // resize the canvas to be fullscreen
  spark.Game.resize(spark.Platform.getWidth(), spark.Platform.getHeight());

  proj.launch(() => {
    scene = new spark.Scene('middle');

    starsLayer = scene.newBackgroundLayer(spark.Game.project.getQuad('stars'));
    asteroidsLayer = scene.newSpriteLayer();
    playerLayer = scene.newSpriteLayer();
    moonLayer = scene.newSpriteLayer();

    // scale the stars layer so the stars are visible
    starsLayer.m.s.set(3, 3);

    // spawn the player
    player = spawnPlayer();

    // add a behavior to the asteroids layer
    asteroidsLayer.newBehavior(spawnAsteroid, {
      delay: 0.0,
      increment: 5.0,
    });

    // go
    scene.run();
  });
});

function spawnPlayer() {
  var sprite = playerLayer.newSprite();

  sprite.newBehavior(playerControls, { thrust: new spark.Vec(0, 0), });
  sprite.newBehavior(wrap);

  sprite.newBody().newCircleShape(0, 0, 14);

  sprite.quad = spark.Game.project.getQuad('player');

  return sprite;
}

function playerControls(sprite, step, data) {
  if (spark.Key.down(spark.Key.LEFT)) sprite.m.rotate(-180 * step);
  if (spark.Key.down(spark.Key.RIGHT)) sprite.m.rotate(180 * step);

  // spawn bullets
  for(var i = 0;i < spark.Key.hits(spark.Key.SPACE);i++) {
    shoot(sprite.getLayer(), sprite.m, data.thrust);
  }

  // thrust forward
  if (spark.Key.down(spark.Key.UP)) {
    var p = sprite.localToWorld(new spark.Vec(0, 60));
    var r = sprite.localToWorldAngle(90);

    var d = new spark.Vec(0, -300 * step).rotate(sprite.m.r);

    data.thrust.x += d.x;
    data.thrust.y += d.y;

    // switch to thrust quad
    sprite.setQuad(spark.Game.project.getQuad('thrusting'));
  } else {
    sprite.setQuad(spark.Game.project.getQuad('player'));

    // dampen thrusters
    data.thrust.x *= 0.985;
    data.thrust.y *= 0.985;
  }

  // move based on thrust
  sprite.m.translate(data.thrust.x * step, data.thrust.y * step);

  // scroll the background
  starsLayer.m.translate(data.thrust.x * step * 0.8, data.thrust.y * step * 0.8);

  // clamp speed
  data.thrust = data.thrust.clamp(400);
}

function shoot(layer, m, v) {
  var bullet = layer.newSprite();
  var body = bullet.newBody('bullet');

  bullet.m.p = m.transform(new spark.Vec(0, -10));
  bullet.m.r = m.r.copy();

  // texture
  bullet.quad = spark.Game.project.getQuad('bullet_big.png');
  body.newSegmentShape(0, -4, 0, 8);

  // create movement behavior
  bullet.newBehavior((sprite, step, data) => {
    sprite.m.translate(data.v.x * step, data.v.y * step);
    sprite.dead = (data.age += step) > 1;
  }, {
    v: new spark.Vec(0, -600).rotate(m.r).add(v),
    age: 0.0,
  });

  spark.Game.project.getSound('laser.mp3').woof();
}

function spawnAsteroid(layer, step, data) {
  if ((data.delay -= step) > 0) {
    return;
  }

  // create a new asteroid off screen
  initAsteroid(layer.newSprite(), 'big', 'small');

  // reset the timer
  data.delay = data.increment;
}

function initAsteroid(sprite, s, nextSize, x, y) {
  var body = sprite.newBody('asteroid', (a, b) => {
    if (b.filter === 'bullet' && !b.dead) {
      a.getObject().dead = true;
      b.getObject().dead = true;

      explodeAsteroid(a.getObject());

      //
      if (nextSize) {
        var x = a.getObject().m.p.x;
        var y = a.getObject().m.p.y;

        initAsteroid(sprite.getLayer().newSprite(), nextSize, null, x, y);
        initAsteroid(sprite.getLayer().newSprite(), nextSize, null, x, y);

        // possibly spawn 2 more...
        if (spark.Util.brand()) {
          initAsteroid(sprite.getLayer().newSprite(), nextSize, null, x, y);
        }
        if (spark.Util.brand()) {
          initAsteroid(sprite.getLayer().newSprite(), nextSize, null, x, y);
        }
      }
    }
  });

  // pick a random (big) image to use
  sprite.quad = spark.Util.arand([
    spark.Game.project.getQuad('asteroid_' + s + '_1.png'),
    spark.Game.project.getQuad('asteroid_' + s + '_2.png'),
    spark.Game.project.getQuad('asteroid_' + s + '_3.png'),
  ]);

  var w = sprite.getWidth();
  var h = sprite.getHeight();

  // add a box shape to the asteroid
  body.newBoxShape(-w * 3 / 8, - h * 3 / 8, w * 3 / 4, h * 3 / 4);

  // spawn at a random position
  sprite.m.p.set(
    x || spark.Util.rand(scene.rect.getLeft(), scene.rect.getRight()),
    y || spark.Util.rand(scene.rect.getTop(), scene.rect.getBottom())
  );

  // random speed, direction, and angular velocity
  var s = spark.Util.rand(50, 100);
  var r = spark.Util.rand(0, 360);
  var v = spark.Vec.axis(r, s);
  var w = spark.Util.rand(-180, 180);

  sprite.newBehavior(wrap);
  sprite.newBehavior((sprite, step) => {
    sprite.m.translate(v.x * step, v.y * step);
    sprite.m.rotate(w * step);
  });

  sprite.playTimeline(spark.Game.project.getTimeline('spawn.xml'));
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
  spark.Game.project.getEmitter('explosion.xml').emit(sprite.getLayer(), sprite.m.p.x, sprite.m.p.y, 0, 0, 30);
}
