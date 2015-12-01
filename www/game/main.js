// Game entry point...
//

var sprites;
var scene;
var player;
var spaceship;
var explosionSound;
var laserSound;

// launch the game and go!
spark.Game.main('game/project.json', game => {
  spaceship = game.newTexture('player.png');
  laser = game.newTexture('laser.png');
  laserSound = game.newAudio('laser.mp3');
  explosionSound = game.newAudio('explosion.mp3');
  spawn = game.newTimeline('spawn.json');

  // wait until all loading is complete
  game.launch(() => {
    scene = new spark.Scene('middle', 1400, 1400);
    scene.setViewport(1400, 1400);

    spark.Input.enableKeyboard();
    spark.Input.enableMouse();

    sprites = new spark.layer.SpriteLayer();
    scene.addLayer(sprites);

    player = sprites.spawn();
    player.setTexture(spaceship);
    player.addBehavior(playerControls);

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
}

function fire(layer, m) {
  var bullet = layer.spawn();

  bullet.m.p = m.transform(new spark.math.Vec(0, -60));
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
