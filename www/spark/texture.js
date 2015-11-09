/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({

  // A single, quad and UV buffer.
  Frame: function(x1, y1, x2, y2, u1, v1, u2, v2) {

    // Create arrays that will be used as the UV and vertex data.
    this.uvs = new Float32Array([u1, v1, u1, v2, u2, v1, u2, v2]);
    this.quad = new Float32Array([x1, y1, x1, y2, x2, y1, x2, y2]);

    // Create buffers for rendering uvs and the quad.
    this.uvBuffer = gl.createBuffer();
    this.quadBuffer = gl.createBuffer();
  },

  // A single image.
  Image: function(src) {
    this.source = new Image();
    this.texture = gl.createTexture();

    // Dummy data.
    var data = new Uint8Array([255, 0, 255, 0]);

    // Until the source is loaded, this is the size of the texture.
    this.width = 1;
    this.height = 1;

    // Default frame.
    this.frame = new spark.texture.Frame(-1, -1, 1, 1, 0, 0, 1, 1);

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
        this.frame.uvs[3] = t;
        this.frame.uvs[4] = s;
        this.frame.uvs[6] = s;
        this.frame.uvs[7] = t;
      }

      // Rebind and copy texture data.
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, i);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Update the quad to be 1:1 pixels, with the pivot in the middle.
      this.setPivot(0.5, 0.5);

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
__MODULE__.Frame.prototype.constructor = __MODULE__.Frame;
__MODULE__.Image.prototype.constructor = __MODULE__.Image;
__MODULE__.Atlas.prototype.constructor = __MODULE__.Atlas;

// Bind a frame to be rendered.
__MODULE__.Frame.prototype.bind = function() {

  // Bind the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.quad, gl.STATIC_DRAW);
  gl.vertexAttribPointer(spark.shader.current.a_pos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(spark.shader.current.a_pos);

  // Bind the texture coordinates.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
  gl.vertexAttribPointer(spark.shader.current.a_uv, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(spark.shader.current.a_uv);
};

// Set the pivot of an image. This alters the quad.
__MODULE__.Image.prototype.setPivot = function(x, y) {
  x = this.source.width * x;
  y = this.source.height * y;

  // Update the quad boundaries.
  this.frame.quad[0] = -x;
  this.frame.quad[1] = -y;
  this.frame.quad[2] = -x;
  this.frame.quad[3] =  y;
  this.frame.quad[4] =  x;
  this.frame.quad[5] = -y;
  this.frame.quad[6] =  x;
  this.frame.quad[7] =  y;
};

// Render the entire texture image to the canvas.
__MODULE__.Image.prototype.blit = function(frame) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(spark.shader.current.u_sampler, 0);

  // If a frame is passed in, use the vertices and UVs from it.
  (frame || this.frame).bind();

  // Render the quad.
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// Blit a sprite from an atlas to the canvas.
__MODULE__.Atlas.prototype.blit = function(frame) {
  this.image.blit(this.frames[frame]);
};
