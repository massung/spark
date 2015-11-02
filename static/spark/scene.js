/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.layer', 'spark.manifest', 'spark.perf').defines({
  layers: [],
});

// Read-only top pixel coordinate.
__MODULE__.__defineGetter__('top', function() {
  return (0 + this.projection.p.y) * this.projection.s.y;
});

// Read-only left pixel coordinate.
__MODULE__.__defineGetter__('left', function() {
  return (0 + this.projection.p.x) * this.projection.s.x;
});

// Read-only bottom pixel coordinate.
__MODULE__.__defineGetter__('bottom', function() {
  return (0 - this.projection.p.y) * this.projection.s.y;
});

// Read-only right pixel coordinate.
__MODULE__.__defineGetter__('right', function() {
  return (0 - this.projection.p.x) * this.projection.s.x;
});

// Read-only width of the scene in pixels.
__MODULE__.__defineGetter__('width', function() {
  return spark.view.canvas.width * this.projection.s.x;
});

// Read-only height of the scene in pixels.
__MODULE__.__defineGetter__('height', function() {
  return spark.view.canvas.height * this.projection.s.y;
});

// Initialize a new scene.
__MODULE__.init = function() {

  // The sprite layer is omni-present.
  this.layers.push(new spark.layer.SpriteLayer());

  // Create an entity to use as the camera.
  this.camera = new spark.entity.Pivot();

  // Setup the default projection.
  this.setProjection();
};

// Define the projection matrix.
__MODULE__.setProjection = function(scale, origin) {
  origin = origin ? origin.toLowerCase() : 'topleft';

  // Create a new projection.
  var m = new spark.vec.Mat();

  // Set the scale (must be uniform).
  m.s = scale ? [scale, scale] : [1.0, 1.0];

  // Discover the offset to 0,0 (the origin).
  if (origin === 'topleft' || origin === 'top-left') {
    m.p = [0, 0];
  } else if (origin === 'topright' || origin === 'top-right') {
    m.p = [spark.view.canvas.width, 0];
  } else if (origin === 'bottomleft' || origin === 'bottom-left') {
    m.p = [0, spark.view.canvas.height];
  } else if (origin === 'bottomright' || origin === 'bottom-right') {
    m.p = [spark.view.canvas.width, spark.view.canvas.height];
  } else if (origin === 'middle' || origin === 'center') {
    m.p = [spark.view.canvas.width / 2, spark.view.canvas.height / 2];
  } else {
    throw 'Invalid origin for projection. Use "topLeft", "middle", "bottomRight", etc.';
  }

  // The projection is the inverse.
  this.projection = m.inverse;
};

// Called once per frame to advance each layer.
__MODULE__.update = function() {

  // Create a new spacial hash around the scene.
  this.space = new spark.collision.Quadtree(this.left, this.top, this.width, this.height, 0);

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

  // Setup the projection matrix.
  spark.perf.drawTime += spark.perf.sample((function() {
    spark.view.setTransform.apply(spark.view, this.projection.inverse.transform);

    // Transform by the inverse of the camera.
    this.camera.applyInverseTransform();

    // Turn off anti-aliasing of images (better performance?).
    //spark.view.imageSmoothingEnabled = false;

    // Render each layer relative to the camera.
    this.layers.forEach(function(layer) {
      layer.draw();
    });
  }).bind(this));

  // Debugging of collision shapes and spacial hash.
  this.space.draw();

  // Put everything back.
  spark.view.restore();

  // Render the GUI for the scene.
  this.gui();
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
