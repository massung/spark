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

// Render the entire texture image to the canvas.
__MODULE__.Image.prototype.blit = function(x, y, rx, ry, sx, sy) {
  var w = this.source.width;
  var h = this.source.height;

  /*
  // Default arguments.
  rx = rx || 1.0;
  ry = ry || 0.0;
  sx = sx || 1.0;
  sy = sy || 1.0;

  // Set the render transform.
  view.setTransform(rx * sx, -ry * sy, ry * sx, rx * sy, x, y);
  */

  // Render it using the center of the image as its pivot.
  spark.view.drawImage(this.source, 0, 0, w, h, -w / 2, -h / 2, w, h);
};

// Blit a sprite from an atlas to the canvas.
__MODULE__.Atlas.prototype.blit = function(frame) {
  var f = this.frames[frame];

  if (f === undefined) {
    return;
  }

  var x = -f.frame.w * f.pivot.x;
  var y = -f.frame.w * f.pivot.y;

  // Render at <x, y>.
  spark.view.drawImage(this.image.source, f.frame.x, f.frame.y, f.frame.w, f.frame.h, x, y, f.frame.w, f.frame.h);
};
