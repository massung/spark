/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.shader');

// A framebuffer and render-to-texture target.
spark.RenderTarget = function(w, h) {
  this.framebuffer = gl.createFramebuffer();
  this.renderbuffer = gl.createRenderbuffer();
  this.texture = gl.createTexture();

  // Set the size of the framebuffer.
  this.framebuffer.width = w;
  this.framebuffer.height = h;

  // Bind all state variables.
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);

  // Setup the texture.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // Setup the render target.
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

  // Cleanup.
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Allocate arrays for the quad and texture coordinates.
  this.quad = new Float32Array([0.0, 0.0, 0.0, 1, 1, 0.0, 1, 1]);
  this.uvs = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);

  // Create a simple UV buffer and quad buffer for the texture.
  this.quadBuffer = gl.createBuffer();
  this.uvBuffer = gl.createBuffer();
};

// Set constructors.
spark.RenderTarget.prototype.constructor = spark.RenderTarget;

// Render to a target.
spark.RenderTarget.prototype.withFramebuffer = function(f) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

  // Render.
  try {
    f();
  }

  // Clear the render target.
  finally {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
};

// Render a target to the viewport.
spark.RenderTarget.prototype.blit = function() {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.uniform1i(spark.shader.current.u.sampler, 0);

  // Bind the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.quad, gl.STATIC_DRAW);
  gl.vertexAttribPointer(spark.shader.current.a.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(spark.shader.current.a.position);

  // Bind the texture coordinates.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
  gl.vertexAttribPointer(spark.shader.current.a.uv, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(spark.shader.current.a.uv);

  // Render the quad.
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// Use the basic shader and screen-space projection matrix.
spark.drawColor = function(r, g, b, a) {
  gl.uniform4f(spark.shader.current.u.color, r, g, b, a || 1.0);
};

// Draw a line from <x1,y1> - <x2,y2>.
spark.drawLine = function(x1, y1, x2, y2) {
  var vbuf = gl.createBuffer();

  // Set the vertices.
  spark.render.vertices[0] = x1;
  spark.render.vertices[1] = y1;
  spark.render.vertices[2] = x2;
  spark.render.vertices[3] = y2;

  // Fill out the vertex buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, spark.render.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.LINES, 0, 2);

  // Free buffer.
  gl.deleteBuffer(vbuf);
};

// Draw a rectangle from <x,y> - <x+w, y+h>.
spark.drawRect = function(x, y, w, h) {
  var vbuf = gl.createBuffer();

  // Set the vertices.
  spark.render.vertices[0] = x;
  spark.render.vertices[1] = y;
  spark.render.vertices[2] = x + w;
  spark.render.vertices[3] = y;
  spark.render.vertices[4] = x + w;
  spark.render.vertices[5] = y + h;
  spark.render.vertices[6] = x;
  spark.render.vertices[7] = y + h;

  // Fill out the vertex buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, spark.render.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);

  // Free buffer.
  gl.deleteBuffer(vbuf);
};

// Draw an arc at <x,y> with a radius from angle t - u.
spark.drawArc = function(x, y, r, t, u, slices) {
  var vbuf = gl.createBuffer();

  // Default number of slices.
  slices = slices || 40;

  // Degrees to radians.
  t = spark.util.degToRad(t || 0.0);
  u = spark.util.degToRad(u || 360.0);

  // Set the vertices.
  for(var i = 0;i < slices;i++) {
    spark.render.vertices[i * 2 + 0] = x + r * Math.cos(t + i * (u - t) / slices);
    spark.render.vertices[i * 2 + 1] = y + r * Math.sin(t + i * (u - t) / slices);
  }

  // Fill out the vertex buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, spark.render.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.LINE_STRIP, 0, slices);

  // Free buffer.
  gl.deleteBuffer(vbuf);
};

// Draw a circle at <x,y> with a given radius.
spark.drawCircle = function(x, y, r, slices) {
  var vbuf = gl.createBuffer();

  // Default number of slices.
  slices = slices || 40;

  // Set the vertices.
  for(var i = 0;i < slices;i++) {
    spark.render.vertices[i * 2 + 0] = x + r * Math.cos(i * 2.0 * Math.PI / slices);
    spark.render.vertices[i * 2 + 1] = y + r * Math.sin(i * 2.0 * Math.PI / slices);
  }

  // Fill out the vertex buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, spark.render.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.LINE_LOOP, 0, slices);

  // Free buffer.
  gl.deleteBuffer(vbuf);
};

// Draw a solid rectangle from <x,y> - <x+w,y+h>.
spark.fillRect = function(x, y, w, h) {
  var vbuf = gl.createBuffer();

  // Set the vertices.
  spark.render.vertices[0] = x;
  spark.render.vertices[1] = y;
  spark.render.vertices[2] = x + w;
  spark.render.vertices[3] = y;
  spark.render.vertices[4] = x + w;
  spark.render.vertices[5] = y + h;
  spark.render.vertices[6] = x;
  spark.render.vertices[7] = y + h;

  // Fill out the vertex buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, spark.render.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  // Free buffer.
  gl.deleteBuffer(vbuf);
};
