/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.input', 'spark.scene').defines({
  framecount: 0,
  frametime: 0.0,
  step: 0.0,
  paused: false,
});

// Called once when the module is done loading.
__MODULE__.init = function() {
  this.frametime = performance.now();
};

// Called once per frame.
__MODULE__.update = function() {
  this.scene.update();
};

// Called once per frame after update.
__MODULE__.draw = function() {
  spark.view.setTransform(1, 0, 0, 1, 0, 0);

  // Erase the display.
  spark.view.clearRect(0, 0, spark.view.canvas.width, spark.view.canvas.height);

  // Reset everything that can cause FPS issues.
  spark.view.globalAlpha = 1;
  spark.view.globalCompositeOperation = 'source-over';
  spark.view.shadowBlur = 0;
  spark.view.lineWidth = 1;
  spark.view.fillStyle = '#000';
  spark.view.strokeStyle = '#fff';

  // Draw all the layers.
  this.scene.draw();
};

// Called periodically to update and render.
__MODULE__.stepFrame = function(now) {
  this.step = this.paused ? 0.0 : (now - this.frametime) / 1000.0;
  this.frametime = now;
  this.framecount++;

  // Run simulation and then draw.
  this.update();
  this.draw();

  // Show performance graph.
  spark.perf.trace(this.framecount);
  spark.perf.reset();

  // Clear hit counts.
  spark.input.flush();

  // Continue running.
  this.loop();
};

// Called while the framework is loading assets to show progress.
__MODULE__.loadFrame = function() {
  var w = 200 * spark.loadProgress();

  // Erase the display.
  spark.view.setTransform(1, 0, 0, 1, 0, 0);
  spark.view.clearRect(0, 0, spark.view.canvas.width, spark.view.canvas.height);

  // Display some loading text in the bottom left.
  spark.view.strokeStyle = '#fff';
  spark.view.fillStyle = '#fff';
  spark.view.font = 'bold 10px "Courier", sans-serif';
  spark.view.fillText('Loading...', 10, spark.view.canvas.height - 20);

  // Render the progress as a simple load bar.
  spark.view.strokeRect(10, spark.view.canvas.height - 16, 200, 6);
  spark.view.fillRect(10, spark.view.canvas.height - 16, w, 6);

  // Continue running.
  this.loop();
};

// The main game loop.
__MODULE__.loop = function() {
  if (spark.loadProgress() === true) {
    this.runloop = window.requestAnimationFrame(this.stepFrame.bind(this));
  } else {
    this.runLoop = window.requestAnimationFrame(this.loadFrame.bind(this));
  }
};

// Start the main game loop.
__MODULE__.run = function(projectFile, onload) {
  this.quit();

  // Create a new scene.
  this.scene = Object.create(spark.scene);

  // Initialize a new scene.
  this.scene.init();

  // Load the project file, and call onload once loaded.
  this.project = spark.project.load(projectFile, (function() {

    // TODO: Additional setup from project file?

    // Allow the game to setup the scene.
    onload(this.scene);
  }).bind(this));

  // Run the main game loop.
  this.loop();
};

// Stop the main game loop.
__MODULE__.quit = function() {
  if (this.runloop !== undefined) {
    window.cancelAnimationFrame(this.runloop);
  }
};

// Return the current FPS.
__MODULE__.fps = function() {
  return 1.0 / this.step;
};