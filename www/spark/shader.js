/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.matrix');

// A shader program.
spark.Shader = function(src) {
  this.program = gl.createProgram();

  // Load a JSON file describing the shader.
  spark.loadJSON(src, (function(json) {
    var vss = spark.project.assetPath(json.vertex);
    var fss = spark.project.assetPath(json.fragment);

    // Save the bindings for use later.
    this.a = json.attributes || {};
    this.u = json.uniforms || {};

    // Issue a request for the vertex shader.
    spark.loadText(vss, (function(source) {
      this.vs = this.compileShader(gl.VERTEX_SHADER, source);

      // When both the vertex and fragment shaders are loaded, link.
      if (this.vs !== undefined && this.fs !== undefined) {
        this.link();
      }
    }).bind(this));

    // Issue a request for the fragment shader.
    spark.loadText(fss, (function(source) {
      this.fs = this.compileShader(gl.FRAGMENT_SHADER, source);

      // When both the vertex and fragment shaders are loaded, link.
      if (this.vs !== undefined && this.fs !== undefined) {
        this.link();
      }
    }).bind(this));
  }).bind(this));
};

// Define the basic shader.
spark.BasicShader = function() {
  var vss = `uniform mat4 u_proj; attribute vec2 a_pos; void main() { gl_Position = u_proj * vec4(a_pos, 0.0, 1.0); }`;
  var fss = `uniform highp vec4 u_color; void main() { gl_FragColor = u_color; }`;

  // Create the program.
  this.program = gl.createProgram();

  // Compile the vertex and fragment shaders.
  this.vs = this.compileShader(gl.VERTEX_SHADER, vss);
  this.fs = this.compileShader(gl.FRAGMENT_SHADER, fss);

  // Set default attribute and uniform bindings.
  this.u = { projection: 'u_proj', color: 'u_color' };
  this.a = { position: 'a_pos' };

  // Link the program.
  this.link();
};

// The common sprite shader.
spark.SpriteShader = function() {
  var vss = `attribute vec2 a_pos, a_uv; uniform mat4 u_proj, u_camera, u_world; uniform lowp float u_z; varying lowp vec2 v_uv; void main() { v_uv = a_uv; gl_Position = u_proj * u_camera * u_world * vec4(a_pos, u_z, 1.0); }`;
  var fss = `precision highp float; varying vec2 v_uv; uniform vec4 u_color; uniform sampler2D u_sampler; void main() { gl_FragColor = vec4(texture2D(u_sampler, vec2(v_uv.s, v_uv.t)) * u_color); }`;

  // Create the program.
  this.program = gl.createProgram();

  // Compile the vertex and fragment shaders.
  this.vs = this.compileShader(gl.VERTEX_SHADER, vss);
  this.fs = this.compileShader(gl.FRAGMENT_SHADER, fss);

  // Set default attribute and uniform bindings.
  this.u = { projection: 'u_proj', camera: 'u_camera', world: 'u_world', color: 'u_color', alpha: 'u_alpha', z: 'u_z', sampler: 'u_sampler' };
  this.a = { position: 'a_pos', uv: 'a_uv' };

  // Link the program.
  this.link();
};

// A basic shader is a shader program.
spark.BasicShader.prototype = Object.create(spark.Shader.prototype);
spark.SpriteShader.prototype = Object.create(spark.Shader.prototype);

// Set constructors.
spark.Shader.prototype.constructor = spark.Shader;
spark.BasicShader.prototype.constructor = spark.BasicShader;
spark.SpriteShader.prototype.constructor = spark.SpriteShader;

// Make this shader current.
spark.Shader.prototype.use = function() {
  gl.useProgram((spark.currentShader = this).program);
};

// Callback when the vertex shader source is done loading.
spark.Shader.prototype.compileShader = function(type, source) {
  var shader = gl.createShader(type);

  // Bind and compile.
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Make sure it compiled successfully.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  // Attach the shader.
  gl.attachShader(this.program, shader);

  return shader;
};

// Link the vertex and fragment shaders together, bind variables.
spark.Shader.prototype.link = function() {
  if (this.a.position === undefined) {
    throw 'No position attribute in shader!';
  }

  // Make sure the position attribute is always bound to location 0.
  gl.bindAttribLocation(this.program, 0, this.a.position);

  // Link the program after binding the position attribute to location 0.
  gl.linkProgram(this.program);

  // Make sure the link succeeded.
  if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(this.program);
  }

  // Lookup attribute bindings.
  for(var k in this.a) {
    this.a[k] = gl.getAttribLocation(this.program, this.a[k]);
  }

  // Lookup uniform bindings.
  for(var k in this.u) {
    this.u[k] = gl.getUniformLocation(this.program, this.u[k]);
  }
};
