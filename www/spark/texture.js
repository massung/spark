/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// A single image.
__MODULE__.Image = function(src) {
  this.source = new Image();

  // Handle registeration when done loading.
  this.source.onload = (function() {
    spark.resolve(this.source);
  }).bind(this);

  // Tell spark to load this element.
  spark.request(this.source, src);
};

// A CSS font.
__MODULE__.Font = function(src) {
  var family = src.split('/').slice(-1)[0].split('.')[0];
  var face = `@font-face{ font-family: "` + family + `"; src: url("` + src + `"); }`;

  // Create the <style> node.
  this.style = document.createElement('style');
  this.style.appendChild(document.createTextNode(face));

  // Add it to the document. This won't load, but will be good enough.
  document.head.appendChild(this.style);
};

// A texture atlas.
__MODULE__.Atlas = function(src) {
  this.images = [];
  this.frames = {};

  // Load the JSON source of frames.
  spark.loadJSON(src, (function(json) {
    this.frames = json.frames;
  }).bind(this));
},

// Set constructors.
__MODULE__.Image.prototype.constructor = __MODULE__.Image;
__MODULE__.Font.prototype.constructor = __MODULE__.Font;
__MODULE__.Atlas.prototype.constructor = __MODULE__.Atlas;

// Get the width of the texture image.
__MODULE__.Image.prototype.__defineGetter__('width', function() {
  return this.source.width;
});

// Get the width of the texture image.
__MODULE__.Image.prototype.__defineGetter__('height', function() {
  return this.source.height;
});

// Render a texture image to the canvas.
__MODULE__.Image.prototype.blitEx = function(sx, sy, sw, sh, dx, dy, dw, dh) {
  spark.view.drawImage(this.source, sx, sy, sw, sh, dx, dy, dw || sw, dh || sh);
};

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
  this.blitEx(x, y, w, h, dx, dy);
};

// Blit a sprite from an atlas to the canvas.
__MODULE__.Atlas.prototype.blit = function(frame, pivot) {
  this.image.blit(this.frames[frame], pivot);
};
