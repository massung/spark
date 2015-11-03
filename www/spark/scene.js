/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.layer', 'spark.perf', 'spark.project').defines({
  layers: [],
});

// Read-only top pixel coordinate in projection space.
__MODULE__.__defineGetter__('top', function() {
  return this.projection.p.y * this.projection.s.y;
});

// Read-only left pixel coordinate in projection space.
__MODULE__.__defineGetter__('left', function() {
  return this.projection.p.x * this.projection.s.x;
});

// Read-only bottom pixel coordinate in projection space.
__MODULE__.__defineGetter__('bottom', function() {
  return -this.projection.p.y * this.projection.s.y;
});

// Read-only right pixel coordinate in projection space.
__MODULE__.__defineGetter__('right', function() {
  return -this.projection.p.x * this.projection.s.x;
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
__MODULE__.setProjection = function(origin, sx, sy) {
  origin = origin ? origin.toLowerCase() : 'topleft';

  // Create a new projection.
  var m = new spark.vec.Mat();

  // Set the scale (must be uniform).
  m.s = [sx || 1.0, sy || sx || 1.0];

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
  var p1 = this.camera.m.vtransform([this.left, this.top]);
  var p2 = this.camera.m.vtransform([this.right, this.top]);
  var p3 = this.camera.m.vtransform([this.left, this.bottom]);
  var p4 = this.camera.m.vtransform([this.right, this.bottom]);

  // Find the min/max extents of the visible area.
  var x1 = Math.min(p1.x, p2.x, p3.x, p4.x);
  var y1 = Math.min(p1.y, p2.y, p3.y, p4.y);
  var x2 = Math.max(p1.x, p2.x, p3.x, p4.x);
  var y2 = Math.max(p1.y, p2.y, p3.y, p4.y);

  // Create a new spacial hash for the frame.
  var space = new spark.collision.Quadtree(x1, y1, x2 - x1, y2 - y1, 0);

  // Update all the layers and allow each layer to push onto the spacial hash.
  this.layers.forEach((function(layer) {
    spark.perf.updateTime += spark.perf.sample(layer.update.bind(layer));
    spark.perf.collisionTime += spark.perf.sample(function() {
      layer.updateCollisions(space);
    });
  }).bind(this));

  // Process collisions between layers.
  spark.perf.collisionTime += spark.perf.sample(space.processCollisions.bind(space));

  // Save the space for the draw and next frame's update (object picking).
  this.space = space;
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

  // Debugging of spacial hash and scene box.
  if (spark.DEBUG) {
    this.space.draw();

    // Draw the scene box.
    spark.view.stokeStyle = '#fff';
    spark.view.strokeRect(this.left, this.top, this.width, this.height);
  }

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

// Perform a pick at a given point, find all sprites at that point.
__MODULE__.pick = function(x, y, radius) {
  if (this.space === undefined) {
    return [];
  }

  // Get the world-space point from screen-space.
  var c = this.camera.m.vtransform([
    x * this.projection.s.x,
    y * this.projection.s.y,
  ]);

  // Create a circle shape to collide against.
  var shape = new spark.collision.Circle(null, c, radius);

  // Update the shape cache for querying.
  shape.updateShapeCache(spark.vec.IDENTITY);

  // Return the owner of all the colliders picked.
  return this.space.collect(shape).map(function(collider) {
    return collider.owner;
  });
};
