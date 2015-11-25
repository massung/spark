/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.input', 'spark.scene', 'spark.texture', 'spark.audio');

// Loop controller.
__MODULE__.run = function(projectFile, onload) {
  this.frametime = performance.now();
  this.framecount = 0;
  this.step = 0.0;
  this.paused = false;

  // Create a new scene module instance for the game.
  this.scene = Object.create(spark.scene);

  // Set the default playfield size and origin.
  this.scene.setPlayfield();
  this.scene.setViewport();

  // Load the project file, and call onload once fully loaded.
  spark.project.load(projectFile, (function() {
    spark.input.enableMouse();
    spark.input.enableKeyboard();
    spark.input.enableTouch();

    // TODO: Additional setup from project file?
  }).bind(this));

  // Start the load loop.
  this.loop(onload);
};

// Called once per frame.
__MODULE__.update = function() {
  spark.input.update();
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

  // Clear presses.
  spark.input.flush();

  // Show performance graph.
  spark.perf.trace(this.framecount);
  spark.perf.reset();

  // Continue running.
  this.loop();
};

// Called while the framework is loading assets to show progress.
__MODULE__.loadFrame = function(onload) {
  var x = spark.view.canvas.width / 2;
  var y = spark.view.canvas.height / 2;

  // Max width of the progress bar i 60% of the width.
  var w = x * 3 / 5;

  // Erase the display.
  spark.view.setTransform(1, 0, 0, 1, 0, 0);
  spark.view.clearRect(0, 0, spark.view.canvas.width, spark.view.canvas.height);

  // Display a loading bar.
  spark.view.strokeStyle = '#fff';
  spark.view.shadowBlur = 10;
  spark.view.shadowOffsetX = 0;
  spark.view.shadowOffsetY = 0;
  spark.view.shadowColor = '#fff';
  spark.view.font = 'bold 10px "Courier", sans-serif';
  spark.view.fillText('Loading...', 10, spark.view.canvas.height - 10);

  // Render the progress as a simple load bar.
  spark.view.beginPath();
  spark.view.moveTo(x - w, y);
  spark.view.lineTo(x - w + w * 2 * spark.loadProgress(), y);
  spark.view.stroke();

  // Continue running.
  this.loop(onload);
};

// The main game loop.
__MODULE__.loop = function(onload) {
  if (spark.loadProgress() === true) {
    if (onload !== undefined) {
      onload(this.scene);
    }

    this.runloop = window.requestAnimationFrame(this.stepFrame.bind(this));
  } else {
    this.runLoop = window.requestAnimationFrame((function() {
      this.loadFrame(onload);
    }).bind(this));
  }
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
