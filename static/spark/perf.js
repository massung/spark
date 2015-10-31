/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({
  updateTime: 0,
  collisionTime: 0,
  drawTime: 0,
});

// Create an offscreen canvas to render performance data to.
__MODULE__.start = function() {
  this.canvas = document.createElement('canvas');

  // Set the dimensions of the canvas.
  this.canvas.width = 0;
  this.canvas.height= 200;

  // Get the context to render with.
  this.view = this.canvas.getContext('2d');
};

// Track some time.
__MODULE__.sample = function(f) {
  var t0 = window.performance.now();

  // Execute.
  f();

  // Tally how much time it took to call the function
  return window.performance.now() - t0;
};

// Reset timings for a new frame.
__MODULE__.reset = function() {
  this.updateTime = 0;
  this.collisionTime = 0;
  this.drawTime = 0;
};

// Draw a trace on the performance canvas.
__MODULE__.trace = function(frame) {
  if (this.canvas === undefined) {
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
  var updateY = Math.round(this.updateTime * y);
  var collisionY = Math.round(this.collisionTime * y);
  var drawY = Math.round(this.drawTime * y);

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
  this.view.moveTo(x, h - updateY - 1);
  this.view.lineTo(x, h - updateY - collisionY);
  this.view.stroke();

  // Green for draw time.
  this.view.strokeStyle = '#2dffb2';
  this.view.beginPath();
  this.view.moveTo(x, h - updateY - collisionY - 1);
  this.view.lineTo(x, h - updateY - collisionY - drawY);
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
  spark.view.font = 'bold 10px "Courier New", sans-serif';
  spark.view.fillStyle = '#66b2ff';
  spark.view.fillText('Update', 10, spark.view.canvas.height - y - 48);
  spark.view.fillStyle = '#c354ff';
  spark.view.fillText('Collision', 10, spark.view.canvas.height - y - 36);
  spark.view.fillStyle = '#2dffb2';
  spark.view.fillText('Draw', 10, spark.view.canvas.height - y - 24);
  spark.view.fillStyle = '#ccc';
  spark.view.fillText('60 FPS', 10, spark.view.canvas.height - y - 2);
};
