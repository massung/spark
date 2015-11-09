/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.scene', 'spark.texture', 'spark.shader', 'spark.audio').defines({
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
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
  var w = -0.5 + spark.loadProgress();

  // Setup the viewport.
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Use the default shader.
  gl.simpleShader.use();

  // Vertex buffer for outline and progress bar.
  var box = [-0.5, 0.1, w, 0.1, w, -0.1, -0.5, -0.1];
  var outline = [-0.5, 0.1, 0.5, 0.1, 0.5, -0.1, -0.5, -0.1];
  var colors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  var vbuf = gl.createBuffer();
  var cbuf = gl.createBuffer();

  // Draw the progrss bar.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(box), gl.STATIC_DRAW);
  gl.vertexAttribPointer(gl.simpleShader.a_pos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.simpleShader.a_pos);
  gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(gl.simpleShader.a_color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.simpleShader.a_color);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  // Draw a loading box outline.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(outline), gl.STATIC_DRAW);
  gl.vertexAttribPointer(gl.simpleShader.a_pos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.simpleShader.a_pos);
  gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(gl.simpleShader.a_color, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(gl.simpleShader.a_color);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);

  // Free buffer.
  gl.deleteBuffer(vbuf);
  gl.deleteBuffer(cbuf);

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
  this.scene.setup();

  // Load the project file, and call onload once loaded.
  spark.project.load(projectFile, (function() {

    // Initialize all input devices.
    spark.input.enableMouse();
    spark.input.enableKeyboard();
    spark.input.enableTouch();

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
