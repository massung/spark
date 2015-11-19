var main = spark.main('canvas', 1280, 768);

var viewportScale = 0.75;
var viewportScaleRate = 0.5;

// Called once the spark framework is fully loaded.
main.init = function () {
	spark.game.run('planets/project.json', (function(scene) {
		// Change the projection so the origin is in the middle.
    scene.setPlayfield('middle', spark.view.canvas.width * 2, spark.view.canvas.height * 2);


    scene.setViewport(scene.width * viewportScale, scene.height * viewportScale);

		this.bgLayer = scene.addLayer(new spark.layer.BackgroundLayer());
		this.planetLayer = scene.addLayer(new spark.layer.SpriteLayer(10));
		this.playerLayer = scene.addLayer(new spark.layer.SpriteLayer(10));

		// Setup the background.
    this.bgLayer.image = spark.project.assets.starfield;
    this.bgLayer.m.setScale(6, 4);

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

	sprite.image = spark.project.assets["planet_" + num];
	sprite.m.setTranslation(
		x || spark.util.rand(spark.game.scene.left, spark.game.scene.right),
    y || spark.util.rand(spark.game.scene.top, spark.game.scene.bottom));

	sprite.m.setScale(scale || .1);

	return sprite;
}

// Handle player input.
main.playerControls = function() {
	if (spark.input.keyDown(spark.input.KEY.W)) {
		setViewportScale(viewportScaleRate * spark.game.step);
		spark.game.scene.setViewport(spark.game.scene.width * viewportScale, spark.game.scene.height * viewportScale);
	}
  if (spark.input.keyDown(spark.input.KEY.S)) {
		setViewportScale(-viewportScaleRate * spark.game.step);
		spark.game.scene.setViewport(spark.game.scene.width * viewportScale, spark.game.scene.height * viewportScale);
	}
}

var setViewportScale = function(adjustment) {
	viewportScale += adjustment;
	if (viewportScale < 0.1) {
		viewportScale = 0.1;
	} else if (viewportScale > 1.0) {
		viewportScale = 1.0;
	}
}
