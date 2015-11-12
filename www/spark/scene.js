/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.gui', 'spark.layer', 'spark.perf', 'spark.project');

// Read-only origin in clip space.
__MODULE__.__defineGetter__('origin', function() {
  return [
    (this.projection.p.x / gl.canvas.width) - 1.0,
    (this.projection.p.y / gl.canvas.height) - 1.0
  ];
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
  return this.top + this.height;
});

// Read-only right pixel coordinate in projection space.
__MODULE__.__defineGetter__('right', function() {
  return this.left + this.width;
});

// Read-only width of the scene in pixels.
__MODULE__.__defineGetter__('width', function() {
  return gl.canvas.width * this.projection.s.x;
});

// Read-only height of the scene in pixels.
__MODULE__.__defineGetter__('height', function() {
  return gl.canvas.height * this.projection.s.y;
});

// Called from game.run() when a new scene is created.
__MODULE__.setup = function() {

  // No layers by default.
  this.layers = [];

  // Create an entity to use as the camera.
  this.camera = new spark.entity.Pivot();

  // Setup the default projection.
  this.setProjection();
};

// Add a new layer to the scene.
__MODULE__.addLayer = function(layer, init) {

  // Optionally initialize before adding to the layers.
  if (init !== undefined) {
    init(layer);
  }

  // Resort the layers based on z-ordering.
  this.layers.push(layer);
  this.layers.sort(spark.layer.zCompare);

  return layer;
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
    m.p = [gl.canvas.width, 0];
  } else if (origin === 'bottomleft' || origin === 'bottom-left') {
    m.p = [0, gl.canvas.height];
  } else if (origin === 'bottomright' || origin === 'bottom-right') {
    m.p = [gl.canvas.width, gl.canvas.height];
  } else if (origin === 'middle' || origin === 'center') {
    m.p = [gl.canvas.width / 2, gl.canvas.height / 2];
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
  var l = this.left;
  var t = this.top;
  var r = this.right;
  var b = this.bottom;

  // Default far/near.
  var f = -1000.0;
  var n = +1000.0;

  // Origin offset.
  var x = -(r + l) / (r - l);
  var y = -(t + b) / (t - b);
  var z = -(f + n) / (f - n);

  // Define an orthographic projection.
  var ortho = new Float32Array([
    2.0 / (r - l),           0.0,          0.0, 0.0,
              0.0, 2.0 / (t - b),          0.0, 0.0,
              0.0,           0.0, -2 / (f - n), 0.0,
                x,             y,            z, 1.0,
  ]);

  // Use the same camera transform for every layer.
  var camera = this.camera.m.inverse.transform;

  // Enable blending states.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Sort the layers (in-place) by z-ordering.
  this.layers.sort(spark.layer.zCompare);

  // Render all of the layers.
  spark.perf.drawTime += spark.perf.sample((function() {
    for(var i = 0;i < this.layers.length;i++) {
      var layer = this.layers[i];

      // Set the shader to use for the layer.
      if (layer.shader) {
        layer.shader.use();

        // Set the projection matrix if it exists in the shader.
        if (layer.shader.u.projection) {
          gl.uniformMatrix4fv(layer.shader.u.projection, false, ortho);
        }

        // Set the camera matrix if it exists.
        if (layer.shader.u.camera) {
          gl.uniformMatrix4fv(layer.shader.u.camera, false, camera);
        }

        // Set the z-value for the layer if it exists.
        if (layer.shader.u.z) {
          gl.uniform1f(layer.shader.u.z, layer.z);
        }

        // Draw each element on the layer.
        layer.draw();
      }
    }
  }).bind(this));

  // Render the spacial hash for debugging.
  if (spark.collision.DEBUG === true) {
    gl.basicShader.use();

    // TODO: multiply ortho by camera.

    gl.uniformMatrix4fv(gl.basicShader.u.projection, false, ortho);

    // Render the spacial hash.
    this.space.draw();
  }

  // Render the optional scene GUI for the scene.
  //if (this.gui !== undefined) {
  //  spark.perf.guiTime += spark.perf.sample(this.gui.bind(this));
  //}
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
