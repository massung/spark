/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.gui', 'spark.layer', 'spark.perf', 'spark.project');

// The scene module is the prototype for every scene object.
__MODULE__.init = function() {
  this.layers = [];

  // All GUI elements added to the scene.
  this.gui = [];

  // Setup the default playfield size and origin.
  this.playfield = {
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  };

  // The camera is a special sprite that doesn't render.
  this.camera = new spark.sprite.Sprite();
};

// Read-only top pixel coordinate in projection space.
__MODULE__.__defineGetter__('top', function() {
  return this.playfield.top;
});

// Read-only left pixel coordinate in projection space.
__MODULE__.__defineGetter__('left', function() {
  return this.playfield.left;
});

// Read-only width of the scene in pixels.
__MODULE__.__defineGetter__('width', function() {
  return this.playfield.width;
});

// Read-only height of the scene in pixels.
__MODULE__.__defineGetter__('height', function() {
  return this.playfield.height;
});

// Read-only bottom pixel coordinate in projection space.
__MODULE__.__defineGetter__('bottom', function() {
  return this.playfield.top + this.playfield.height;
});

// Read-only right pixel coordinate in projection space.
__MODULE__.__defineGetter__('right', function() {
  return this.playfield.left + this.playfield.width;
});

// Read-only middle of the screen.
__MODULE__.__defineGetter__('middle', function() {
  return [
    this.playfield.left + (this.playfield.width / 2),
    this.playfield.top + (this.playfield.height / 2),
  ];
});

// Add a new layer to the scene.
__MODULE__.addLayer = function(layer, init) {
  if (init !== undefined) {
    init(layer);
  }

  // Resort the layers based on z-ordering.
  this.layers.push(layer);

  return layer;
};

// Add a new GUI element to the scene.
__MODULE__.addGui = function(widget, init) {
  if (init !== undefined) {
    init(widget);
  }

  // Append to the GUI list.
  this.gui.push(widget);

  return widget;
};

// Set the camera scaling to fit the playfield in the viewport.
__MODULE__.setViewport = function(w, h) {
  w = w || spark.view.canvas.width;

  // If the height is undefined, use the aspect ratio of the canvas.
  if (h === undefined) {
    h = w * (spark.view.canvas.height / spark.view.canvas.width);
  }

  // Scale the camera appropriately.
  this.camera.m.s.x = w / 2;
  this.camera.m.s.y = h / 2;
};

// Define the playfield size and origin.
__MODULE__.setPlayfield = function(origin, w, h) {
  origin = origin ? origin.toLowerCase() : 'top-left';

  // Default width and height is that of the canvas.
  w = w || spark.view.canvas.width;
  h = h || spark.view.canvas.height;

  // Discover the origin point.
  if (origin === 'top-left') origin = [0, 0];
  else if (origin === 'top-right') origin = [w, 0];
  else if (origin === 'bottom-left') origin = [0, h];
  else if (origin === 'bottom-right') origin = [w, h];
  else if (origin === 'top-middle') origin = [w / 2, 0];
  else if (origin === 'bottom-middle') origin = [w / 2, h];
  else if (origin === 'left-middle') origin = [0, h / 2];
  else if (origin === 'right-middle') origin = [w, h / 2];
  else if (origin === 'middle') origin = [w / 2, h / 2];

  // Unknown origin for playfield area.
  else throw 'Invalid origin for projection. Use "top-left", "middle", "bottom-right", etc.';

  // The projection is the inverse.
  this.playfield.left = -origin.x;
  this.playfield.top = -origin.y;
  this.playfield.width = w;
  this.playfield.height = h;
};

// Called once per frame to advance each layer.
__MODULE__.update = function() {
  var space = new spark.collision.Quadtree(this.left, this.top, this.width, this.height, 0);

  // Run camera behaviors and animations.
  this.camera.update();

  // The projection matrix is the inverse of the camera.
  this.projection = this.camera.m.inverse;

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
  spark.view.save();

  // Scaling for camera -> viewport transformation.
  var w2 = spark.view.canvas.width / 2;
  var h2 = spark.view.canvas.height / 2;

  // Need to translate by the origin.
  var origin = this.middle;

  // Setup the projection matrix.
  spark.perf.drawTime += spark.perf.sample((function() {
    spark.view.setTransform(1, 0, 0, 1, 0, 0);

    // Camera -> viewport.
    spark.view.translate(w2, h2);
    spark.view.scale(w2 / this.camera.m.s.x, h2 / this.camera.m.s.y);

    // Game -> camera.
    spark.view.transform(this.camera.m.r.x, this.camera.m.r.y, -this.camera.m.r.y, this.camera.m.r.x, 0, 0);
    spark.view.translate(-this.camera.m.p.x, -this.camera.m.p.y);

    // Render each layer.
    for(var i = 0;i < this.layers.length;i++) {
      this.layers[i].draw();
    }
  }).bind(this));

  // Debugging of spacial hash and scene box in game space.
  if (spark.DEBUG) {
    this.space.draw();

    // Draw the scene box.
    spark.view.stokeStyle = '#fff';
    spark.view.strokeRect(this.left, this.top, this.width, this.height);
  }

  // Put everything back.
  spark.view.restore();

  // Update and render all the GUI elements.
  spark.perf.guiTime += spark.perf.sample((function() {
    for(var i = 0;i < this.gui.length;i++) {
      this.gui[i].update();

      // Draw, but save/restore the context each time.
      this.gui[i].withContext(this.gui[i].draw.bind(this.gui[i]));
    }
  }).bind(this));
};

// Transform a point from world to screen space.
__MODULE__.worldToScreen = function(p) {
  var x = p.x - this.camera.m.p.x;
  var y = p.y - this.camera.m.p.y;

  // Rotate.
  var s = [
    (x * this.camera.m.r.x) - (y * this.camera.m.r.y),
    (y * this.camera.m.r.x) + (x * this.camera.m.r.y),
  ];

  // Zoom.
  s.x /= this.camera.m.s.x;
  s.y /= this.camera.m.s.y;

  // Project.
  s.x = (s.x * spark.view.canvas.width / 2) + (spark.view.canvas.width / 2);
  s.y = (s.y * spark.view.canvas.height / 2) + (spark.view.canvas.height / 2);

  return s;
};

// Transform a point from screen space to world space.
__MODULE__.screenToWorld = function(s) {
  var p = [
    (s.x - (spark.view.canvas.width / 2)) * (2 / spark.view.canvas.width),
    (s.y - (spark.view.canvas.height / 2)) * (2 / spark.view.canvas.height),
  ];

  // Unzoom.
  p.x *= this.camera.m.s.x;
  p.y *= this.camera.m.s.y;

  // Unrotate.
  var x = (p.x * this.camera.m.r.x) + (p.y * this.camera.m.r.y);
  var y = (p.y * this.camera.m.r.x) - (p.x * this.camera.m.r.y);

  // Untranslate.
  return [x + this.camera.m.p.x, y + this.camera.m.p.y];
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
  var shape = new spark.CircleShape(null, c, radius || 5.0);

  // Update the shape cache for querying.
  shape.updateShapeCache(spark.IDENTITY);

  // Return the owner of all the colliders picked.
  return this.space.collect(shape).map(function(collider) {
    return collider.owner;
  });
};
