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
  var div = document.createElement('div');
  var elements = document.body.childNodes;

  // Get the body, we're going to wrap everything in it in a DIV.
  while(elements.length > 0) {
    div.appendChild(elements[0]);
  }

  // Create a new canvas for the performance output.
  this.canvas = document.createElement('canvas');

  // Set the dimensions of the canvas.
  this.canvas.background = '#000';
  this.canvas.style.width = '100%';
  this.canvas.style.height = '100px';
  this.canvas.style.position = 'relative';
  this.canvas.style.left = '0px';
  this.canvas.style.bottom = '0px';
  this.canvas.style.margin.left = '0px';
  this.canvas.style.margin.bottom = '0px';

  // Add it to the document so we can see performance.
  document.body.appendChild(this.canvas);
  document.body.appendChild(div);

  // Get the context to render with.
  this.view = this.canvas.getContext('2d');
};

// Track some time.
__MODULE__.sample = function(f) {
  if (this.canvas === undefined) {
    f();
    return 0;
  }
  
  var t0 = window.performance.now();
  {
    f();
  }
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

  if (this.canvas.width !== window.innerWidth) {
    this.canvas.width = window.innerWidth;
  }

  // Get the size.
  var w = this.canvas.width;
  var h = this.canvas.height;

  // Keep scrolling and wrapping.
  var x = (frame % (w / 2)) * 2;

  // Determine the vertical slice of time spent in update.
  var updateY = Math.round(this.updateTime * 80);
  var collisionY = Math.round(this.collisionTime * 80);
  var drawY = Math.round(this.drawTime * 80);

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

  // Draw a gray line at the 60 FPS mark.
  this.view.strokeStyle = '#333';
  this.view.beginPath();
  this.view.moveTo(0, 20);
  this.view.lineTo(w, 20);
  this.view.stroke();

  // Show the legend.
  this.view.font = '18px monospace';
  this.view.fillStyle = '#66b2ff';
  this.view.fillText('Update', 10, 54);
  this.view.fillStyle = '#c354ff';
  this.view.fillText('Collision', 10, 36);
  this.view.fillStyle = '#2dffb2';
  this.view.fillText('Draw', 10, 18);
};
