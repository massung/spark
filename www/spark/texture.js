/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({

  // A single image.
  Image: function(src) {
    this.source = new Image();

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
__MODULE__.Image.prototype.blit = function(frame, pivot) {
  var w = this.source.width;
  var h = this.source.height;
  var x = 0;
  var y = 0;

  // If a subframe was passed in, use that.
  if (frame !== undefined) {
    w = frame.w || frame.width;
    h = frame.h || frame.width;
    x = frame.x;
    y = frame.y;

    // The frame might override a default pivot.
    if (pivot === undefined && frame.pivot !== undefined) {
      pivot = pivot || [frame.pivot.x, frame.pivot.y];
    }
  }

  // Offset the blit destination pos by the pivot.
  var dx = -w * (pivot ? pivot.x : 0);
  var dy = -h * (pivot ? pivot.y : 0);

  // Render it using the center of the image as its pivot.
  spark.view.drawImage(this.source, x, y, w, h, dx, dy, w, h);
};

// Blit a sprite from an atlas to the canvas.
__MODULE__.Atlas.prototype.blit = function(frame, pivot) {
  this.image.blit(this.frames[frame], pivot);
};
