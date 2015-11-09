/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({

  // A single image.
  Image: function(src) {
    this.source = new Image();
    this.texture = gl.createTexture();

    // Dummy data.
    var data = new Uint8Array([255, 0, 255, 0]);

    // Until the source is loaded, this is the size of the texture.
    this.width = 1;
    this.height = 1;

    // Create arrays that will be used as the UV and vertex data.
    this.uvs = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);
    this.quad = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);

    // Create a 1x1 texture until it is loaded.
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Handle registeration when done loading.
    this.source.onload = (function() {
      var i = this.source;

      // Calculate an optimal size for the texture.
      this.width = spark.util.nextPow2(this.source.width);
      this.height = spark.util.nextPow2(this.source.height);

      // If the source is a non-power-of-2 texture, create a new image that is.
      if (this.width !== this.source.width || this.height !== this.source.height) {
        i = document.createElement('canvas');

        // Set the power-of-2 texture size.
        i.width = this.width;
        i.height = this.height;

        // Blit the loaded image onto the new canvas.
        i.getContext('2d').drawImage(this.source, 0, 0);

        // Recalculate the U/Vs due to size change.
        var s = this.source.width / this.width;
        var t = this.source.height / this.height;

        // Update the UVs.
        this.uvs[3] = t;
        this.uvs[4] = s;
        this.uvs[6] = s;
        this.uvs[7] = t;
      }

      // Rebind and copy texture data.
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, i);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Done.
      spark.register(this.source);
    }).bind(this);

    // Tell spark to load this element.
    spark.request(this.source, src);
  },

  // A sprite atlas.
  Atlas: function(src) {
    this.images = [];
    this.frames = {};

    // Load the JSON source of frames.
    spark.loadJSON(src, (function(json) {
      this.frames = json.frames;
    }).bind(this));
  },

  // A CSS font.
  Font: function(src) {
    var family = src.split('/').slice(-1)[0].split('.')[0];
    var face = `@font-face{
      font-family: "` + family + `"; src: url("` + src + `");
    }`;

    // Create the <style> node.
    this.style = document.createElement('style');
    this.style.appendChild(document.createTextNode(face));

    // Add it to the document. This won't load, but will be good enough.
    document.head.appendChild(this.style);
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

  // The frame is the texture coordinates to use.
  var frame = frame || this.uvs;

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
