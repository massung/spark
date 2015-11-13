/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.scene', 'spark.texture', 'spark.shader', 'spark.audio');

// Loop controller.
spark.Game = function(projectFile, onload) {
  this.framecount = 0;
  this.frametime = 0.0;
  this.step = 0.0;
  this.paused = false;

  // Create a new project and scene.
  this.project = new spark.Project();
  this.scene = new spark.Scene();

  // Load the project file, and call onload once fully loaded.
  this.project.load(projectFile, (function() {

    // Initialize all input devices.
    spark.enableMouse();
    spark.enableKeyboard();
    spark.enableTouch();

    // TODO: Additional setup from project file?

    // Allow the game to setup the scene.
    onload.call(this, this.scene);
  }).bind(this));
};

// Called once per frame.
spark.Game.prototype.update = function() {
  this.scene.update();
};

// Called once per frame after update.
spark.Game.prototype.draw = function() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw all the layers.
  this.scene.draw();
};

// Called periodically to update and render.
spark.Game.prototype.stepFrame = function(now) {
  this.step = this.paused ? 0.0 : (now - this.frametime) / 1000.0;
  this.frametime = now;
  this.framecount++;

  // Run simulation and then draw.
  this.update();
  this.draw();

  // Show performance graph.
  //spark.perf.trace(this.framecount);
  //spark.perf.reset();

  // Clear hit counts.
  spark.flushInput();

  // Continue running.
  this.run();
};

// Called while the framework is loading assets to show progress.
spark.Game.prototype.loadFrame = function() {
  var w = -0.5 + spark.loadProgress();

  // Setup the viewport.
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Use the default shader.
  gl.basicShader.use();

  // Set the identity projection matrix and white color.
  gl.uniformMatrix4fv(gl.basicShader.u.projection, false, spark.Mat.IDENTITY.transform);
  gl.uniform4f(gl.basicShader.u.color, 1, 1, 1, 1);

  // Vertex buffer for a line progress bar.
  var vbuf = gl.createBuffer();

  // Draw the progrss bar.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, 0.0, w, 0.0]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.LINES, 0, 2);

  // Free buffer.
  gl.deleteBuffer(vbuf);

  // Continue running.
  this.run();
};

// The main game loop.
spark.Game.prototype.run = function() {
  if (spark.loadProgress() === true) {
    this.runloop = window.requestAnimationFrame(this.stepFrame.bind(this));
  } else {
    this.runLoop = window.requestAnimationFrame(this.loadFrame.bind(this));
  }
};

// Stop the main game loop.
spark.Game.prototype.quit = function() {
  if (this.runloop !== undefined) {
    window.cancelAnimationFrame(this.runloop);
  }
};

// Return the current FPS.
spark.Game.prototype.fps = function() {
  return 1.0 / this.step;
};
