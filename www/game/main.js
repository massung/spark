// Game entry point...
//

// launch the game and go!
spark.Game.launch('game/project.json', game => {
  var foo = game.newTexture('player.png');

  var scene = new spark.Scene('top-left', 1000, 1000);

  scene.setViewport(1000, 1000);
  scene.run();
});
