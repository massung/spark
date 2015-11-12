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
    this.target = new spark.render.Target(gl.canvas.width, gl.canvas.height);
  }
};

// Stop profiling.
__MODULE__.stop = function() {
  this.view = undefined;

  // NOTE: Don't clear the canvas, because why re-create it?
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
  if (this.view === undefined) {
    return;
  }

  // Resize the offscreen canvas if necessary.
  if (this.canvas.width !== spark.view.canvas.width) {
    this.canvas.width = spark.view.canvas.width;
  }

  // Get the size.
  var w = this.canvas.width;
  var h = this.canvas.height;

  // Keep scrolling and wrapping.
  var x = (frame % (w / 2)) * 2;
  var y = h / 2;

  // Determine the vertical slice of time spent in update.
  var updateY = Math.round(this.updateTime * 60 * y / 1000);
  var collisionY = Math.round(this.collisionTime * 60 * y / 1000);
  var drawY = Math.round(this.drawTime * 60 * y / 1000);
  var guiY = Math.round(this.guiTime * 60 * y / 1000);

  // Clear an around around the draw section.
  this.view.clearRect(x, 0, 10, h);

  // A nice blue for update time.
  this.view.lineWidth = 2;
  this.view.fillStyle = '#000';
  this.view.strokeStyle = '#66b2ff';
  this.view.beginPath();
  this.view.moveTo(x, h);
  this.view.lineTo(x, h - updateY);
  this.view.stroke();

  // Purple for collision time.
  this.view.strokeStyle = '#c354ff';
  this.view.beginPath();
  this.view.moveTo(x, h - updateY);
  this.view.lineTo(x, h - updateY - collisionY);
  this.view.stroke();

  // Green for draw time.
  this.view.strokeStyle = '#2dffb2';
  this.view.beginPath();
  this.view.moveTo(x, h - updateY - collisionY);
  this.view.lineTo(x, h - updateY - collisionY - drawY);
  this.view.stroke();

  // Pink for gui time.
  this.view.strokeStyle = '#fa5882';
  this.view.beginPath();
  this.view.moveTo(x, h - updateY - collisionY - drawY);
  this.view.lineTo(x, h - updateY - collisionY - drawY - guiY);
  this.view.stroke();

  // Draw a gray line at the 60 FPS mark.
  this.view.strokeStyle = '#333';
  this.view.beginPath();
  this.view.moveTo(0, y);
  this.view.lineTo(w, y);
  this.view.stroke();

  // Blit the performance canvas onto the spark canvas.
  spark.view.save();
  spark.view.globalAlpha = 0.8;
  spark.view.setTransform(1, 0, 0, 1, 0, 0);
  spark.view.drawImage(this.canvas, 0, spark.view.canvas.height - h);
  spark.view.restore();

  // Show the legend.
  spark.view.lineWidth = 1;
  spark.view.shadowOffsetX = 0;
  spark.view.shadowOffsetY = 1;
  spark.view.shadowBlur = 3;
  spark.view.shadowColor = '#000';
  spark.view.font = 'bold 10px "Courier New", sans-serif';

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
};
