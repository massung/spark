var main = spark.main('canvas');

// Called once the spark framework is fully loaded.
main.init = function () {
	spark.game.run('game/planets/project.json', (function(scene) {
		// Change the projection so the origin is in the middle.
    scene.setProjection('middle', 1);

		this.bgLayer = scene.addLayer(new spark.layer.BackgroundLayer());
		this.planetLayer = scene.addLayer(new spark.layer.SpriteLayer(10));
		this.playerLayer = scene.addLayer(new spark.layer.SpriteLayer(10));

		// Setup the background.
    this.bgLayer.image = spark.project.assets.starfield;
    this.bgLayer.m.setScale(2);

		this.createPlayer(this.playerLayer);

		this.createPlanet(Math.floor(spark.util.rand(19, 33)), this.planetLayer);
		this.createPlanet(Math.floor(spark.util.rand(19, 33)), this.planetLayer);
		this.createPlanet(Math.floor(spark.util.rand(19, 33)), this.planetLayer);
		this.createPlanet(Math.floor(spark.util.rand(19, 33)), this.planetLayer);

	}).bind(this));
};

main.createPlayer = function(layer) {
	var sprite = layer.spawn();
	sprite.addBehavior(main.playerControls);
	return sprite;
}

main.createPlanet = function(num, layer, x, y, scale) {
	var sprite = layer.spawn();

	sprite.setImage(spark.project.assets["planet_" + num]);
	sprite.m.setTranslation(
		x || spark.util.rand(spark.game.scene.left, spark.game.scene.right),
    y || spark.util.rand(spark.game.scene.top, spark.game.scene.bottom));

	sprite.m.setScale(scale || 0.20);

	return sprite;
}

// Handle player input.
main.playerControls = function() {
	if (spark.input.keyDown(spark.input.KEY.W))
    spark.game.scene.camera.scale(2.0 * spark.game.step);
  if (spark.input.keyDown(spark.input.KEY.S))
    spark.game.scene.camera.scale(-2.0 * spark.game.step);
}
