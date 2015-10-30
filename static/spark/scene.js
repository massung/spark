/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.layer', 'spark.perf').defines({
  layers: [],
});

// Initialize a new scene.
__MODULE__.init = function() {

  // The sprite layer is omni-present.
  this.layers.push(new spark.layer.SpriteLayer());

  // Create a camera.
  this.camera = new spark.entity.Pivot();
};

// Called once per frame to advance each layer.
__MODULE__.update = function() {
  this.space = new spark.collision.Quadtree(0, 0, spark.view.canvas.width, spark.view.canvas.height, 0);

  // Update all the layers and allow each layer to push onto the spacial hash.
  this.layers.forEach((function(layer) {
    spark.perf.updateTime += spark.perf.sample(layer.update.bind(layer));
    spark.perf.collisionTime += spark.perf.sample((function() {
      layer.updateCollisions(this.space);
    }).bind(this));
  }).bind(this));

  // Process collisions between layers.
  spark.perf.collisionTime += spark.perf.sample(this.space.processCollisions.bind(this.space));
};

// Called once per frame to draw each layer.
__MODULE__.draw = function() {
  spark.view.save();

  // Transform by the inverse of the camera.
  this.camera.setTransform();

  // Render each layer relative to the camera.
  this.layers.forEach(function(layer) {
    spark.perf.drawTime += spark.perf.sample(layer.draw.bind(layer));
  });

  // Put everything back.
  spark.view.restore();

  // Render the GUI for the scene.
  this.gui();

  // Debugging of collision shapes and spacial hash.
  //this.space.draw();
};

// Render the GUI for the scene. Default just renders framerate.
__MODULE__.gui = function() {
  spark.view.font = 'bold 10px "Courier New", sans-serif';
  spark.view.fillStyle = '#fff';
  spark.view.fillText('FPS: ' + spark.game.fps().toFixed(1), 10, 14);
};

// Spawn a new game sprite into the scene.
__MODULE__.spawn = function(sprite) {
  sprite.layer = this.layers[0];
  sprite.scene = this;

  // Add it to the scene.
  this.layers[0].push(sprite);

  // Update the shapes of the sprite.
  sprite.updateShapeColliders();

  // Initialize the sprite now that it's in the scene.
  if (sprite.init !== undefined) {
    sprite.init();
  }
};
