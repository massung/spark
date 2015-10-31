/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({

  // A single image.
  Image: function(src, pivot) {
    this.source = new Image();

    // Set the pivot.
    this.pivot = pivot || [0.5, 0.5];

    // Handle registeration when done loading.
    this.source.onload = (function() {
      spark.register(this.source);
    }).bind(this);

    // Tell spark to load this element.
    spark.request(this.source, src);
  },

  // A sprite atlas.
  Atlas: function(image, src) {
    this.image = image;
    this.frames = {};

    // Load the JSON source of frames.
    spark.loadJSON(src, (function(json) {
      this.frames = json.frames;
    }).bind(this));
  },
});

// Set constructors.
__MODULE__.Image.prototype.constructor = __MODULE__.Image;
__MODULE__.Atlas.prototype.constructor = __MODULE__.Atlas;

// Render the entire texture image to the canvas.
__MODULE__.Image.prototype.blit = function(x, y, rx, ry, sx, sy) {
  var w = this.source.width;
  var h = this.source.height;
  var x = -w * this.pivot.x;
  var y = -h * this.pivot.y;

  // Render it using the center of the image as its pivot.
  spark.view.drawImage(this.source, 0, 0, w, h, x, y, w, h);
};

// Blit a sprite from an atlas to the canvas.
__MODULE__.Atlas.prototype.blit = function(frame) {
  var f = this.frames[frame];

  if (f === undefined) {
    return;
  }

  var w = Math.floor(f.frame.w);
  var h = Math.floor(f.frame.h);
  var x = Math.round(-w * f.pivot.x);
  var y = Math.round(-h * f.pivot.y);

  // Render at <x, y>.
  spark.view.drawImage(this.image.source, f.frame.x, f.frame.y, w, h, x, y, w, h);
};
