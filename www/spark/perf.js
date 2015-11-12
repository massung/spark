/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.render').defines({
  updateTime: 0,
  collisionTime: 0,
  drawTime: 0,
  guiTime: 0,
});

// Create an offscreen canvas to render performance data to.
__MODULE__.start = function() {
  if (this.target === undefined) {
    this.target = new spark.render.Target(300, 200);
  }
};

// Stop profiling.
__MODULE__.stop = function() {
};

// Track some time.
__MODULE__.sample = function(f) {
  var t0 = window.performance.now();

  // Execute.
  try {
    f();
  }

  // Tally how much time it took to call the function
  finally {
    return window.performance.now() - t0;
  }
};

// Reset timings for a new frame.
__MODULE__.reset = function() {
  this.updateTime = 0;
  this.collisionTime = 0;
  this.drawTime = 0;
  this.guiTime = 0;
};

// Draw a trace on the performance canvas.
__MODULE__.trace = function(frame) {
  if (this.target === undefined) {
    return;
  }

  // Render the trace to a the preformance render target.
  this.target.withFramebuffer((function() {
    var w = this.target.framebuffer.width;
    var h = this.target.framebuffer.height;

    // Keep scrolling and wrapping.
    var x = (frame % (w / 2)) * 2;
    var y = h / 2;

    // Set the size of the viewport to render to.
    gl.viewport(0, 0, w, h);

    // Enable the shader.
    gl.basicShader.use();

    // Disable blending so we can write alpha values to the texture.
    gl.disable(gl.BLEND);

    // Set the projection matrix.
    gl.uniformMatrix4fv(gl.basicShader.u.projection, false, new Float32Array([
        2 / w,   0.0, 0.0, 0.0,
          0.0, 2 / h, 0.0, 0.0,
          0.0,   0.0, 1.0, 0.0,
          0.0,   0.0, 0.0, 1.0,
    ]));

    // Determine the height for each bar.
    var updateY = Math.round(this.updateTime * 60 * y / 1000);
    var collisionY = Math.round(this.collisionTime * 60 * y / 1000);
    var drawY = Math.round(this.drawTime * 60 * y / 1000);
    var guiY = Math.round(this.guiTime * 60 * y / 1000);

    // Clear a block forward looking.
    spark.render.drawColor(0.0, 0.0, 0.0, 0.0);
    spark.render.fillRect(x, 0, 10, h);

    // Draw a nice blue for the update time slice.
    spark.render.drawColor(0.4, 0.7, 1.0);
    spark.render.drawLine(x, 0, x, updateY);

    // Purple for the collision time.
    spark.render.drawColor(0.76, 0.33, 1.0);
    spark.render.drawLine(x, updateY, x, updateY - collisionY);

    // Green for the draw time.
    spark.render.drawColor(0.17, 1.0, 0.7);
    spark.render.drawLine(x, updateY - collisionY, x, updateY - collisionY - drawY);

    // Pink for the GUI time.
    spark.render.drawColor(0.98, 0.35, 0.51);
    spark.render.drawLine(x, updateY - collisionY - drawY, x, updateY - collisionY - drawY - guiY);

    // Draw the 60 FPS line.
    spark.render.drawColor(0.2, 0.2, 0.2);
    spark.render.drawLine(0, y, w, y);

    // TODO: Render the legend text...
    /*
    // Show sprite and particle counts.
    spark.view.fillStyle = '#ff8000';
    spark.view.fillText('Sprites   : ' + spark.game.scene.sprites.count, 10, spark.view.canvas.height - y - 96);
    spark.view.fillText('Particles : ' + spark.game.scene.particles.count, 10, spark.view.canvas.height - y - 84);

    // Show timings in milliseconds for draw, update, and collision.
    spark.view.fillStyle = '#66b2ff';
    spark.view.fillText('Update    : ' + this.updateTime.toFixed(2) + 'ms', 10, spark.view.canvas.height - y - 24);
    spark.view.fillStyle = '#c354ff';
    spark.view.fillText('Collision : ' + this.collisionTime.toFixed(2) + 'ms', 10, spark.view.canvas.height - y - 36);
    spark.view.fillStyle = '#2dffb2';
    spark.view.fillText('Draw      : ' + this.drawTime.toFixed(2) + 'ms', 10, spark.view.canvas.height - y - 48);
    spark.view.fillStyle = '#fa5882';
    spark.view.fillText('GUI       : ' + this.guiTime.toFixed(2) + 'ms', 10, spark.view.canvas.height - y - 60);
    spark.view.fillStyle = '#ccc';
    spark.view.fillText('FPS       : ' + spark.game.fps().toFixed(1), 10, spark.view.canvas.height - y - 2);
    */
  }).bind(this));

  // Enable blending.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Blit the perf framebuffer onto the scene.
  // TODO:
  spark.project.assets.sprite_shader.use();
  gl.uniformMatrix4fv(spark.shader.current.u.projection, false, spark.vec.IDENTITY.transform);
  gl.uniformMatrix4fv(spark.shader.current.u.camera, false, spark.vec.IDENTITY.transform);
  gl.uniformMatrix4fv(spark.shader.current.u.world, false, spark.vec.IDENTITY.transform);
  this.target.blit();
};
