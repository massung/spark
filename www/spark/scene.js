/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.gui', 'spark.layer', 'spark.perf', 'spark.project');

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
  this.particles = new spark.layer.SpriteLayer(500);
  this.sprites = new spark.layer.SpriteLayer(100);

  // The particle and sprite layers are omni-present and on top!
  this.layers = [
    this.particles,
    this.sprites,
  ];

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
  for(var i = 0;i < this.layers.length;i++) {
    var layer = this.layers[i];

    // First update the layer, then update the collision space.
    spark.perf.updateTime += spark.perf.sample(layer.update.bind(layer));
    spark.perf.collisionTime += spark.perf.sample(function() {
      layer.updateCollisions(space);
    });
  }

  // Process collisions between layers.
  spark.perf.collisionTime += spark.perf.sample(space.processCollisions.bind(space));

  // Save the space for the draw and next frame's update (object picking).
  this.space = space;
};

// Called once per frame to draw each layer.
__MODULE__.draw = function() {
  var i;

  // Retain transforms, etc.
  spark.view.save();

  // Setup the projection matrix.
  spark.perf.drawTime += spark.perf.sample((function() {
    spark.view.setTransform.apply(spark.view, this.projection.inverse.transform);

    // Transform by the inverse of the camera.
    this.camera.applyInverseTransform();

    // Turn off anti-aliasing of images (better performance?).
    //spark.view.imageSmoothingEnabled = false;

    // Render each layer in reverse order (sprites last).
    for(i = this.layers.length - 1;i >= 0;i--) {
      this.layers[i].draw();
    }
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

  // Render the optional scene GUI for the scene.
  if (this.gui !== undefined) {
    spark.perf.guiTime += spark.perf.sample(this.gui.bind(this));
  }
};

// Transform a point from screen space to world space.
__MODULE__.screenToWorld = function(p) {
  return this.camera.m.vtransform([
    ((p ? p.x : spark.input.x) + this.projection.p.x) * this.projection.s.x,
    ((p ? p.y : spark.input.y) + this.projection.p.y) * this.projection.s.y,
  ]);
};

// Perform a pick at a given point, find all sprites at that point.
__MODULE__.pick = function(p, radius) {
  if (this.space === undefined) {
    return [];
  }

  // Get the world-space point from screen-space.
  var c = this.screenToWorld(p || [spark.input.x, spark.input.y]);

  // Fail to pick anything when offscreen.
  if (c.x < this.left || c.x > this.right || c.y < this.top || c.y > this.bottom) {
    return [];
  }

  // Create a circle shape to collide against.
  var shape = new spark.collision.Circle(null, c, radius || 5.0);

  // Update the shape cache for querying.
  shape.updateShapeCache(spark.vec.IDENTITY);

  // Return the owner of all the colliders picked.
  return this.space.collect(shape).map(function(collider) {
    return collider.owner;
  });
};
