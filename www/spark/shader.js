/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.project').defines({

  // Always set the last program to call .use().
  current: undefined,

  // A linked vertex and fragment shader.
  Program: function(src) {
    this.program = gl.createProgram();

    // Request this object, because it needs to request others.
    spark.request(this);

    // The JSON file defines the program, attributes, uniforms, etc.
    if (src === undefined) {
      this.compileVertexShader(spark.shader.defaultVertexShader);
      this.compileFragmentShader(spark.shader.defaultFragmentShader);
    } else {
      spark.loadJSON(src, (function(json) {
        this.attributes = json.attributes;
        this.uniforms = json.uniforms;

        // Issue requests for the vertex and fragment shader sources.
        spark.loadText(spark.project.assetPath(json.vss), this.compileVertexShader.bind(this));
        spark.loadText(spark.project.assetPath(json.fss), this.compileFragmentShader.bind(this));
      }).bind(this));
    }
  },

  // When no vertex shader is specified, use this one.
  defaultVertexShader: `
    attribute vec2 a_pos;
    attribute vec2 a_uv;
    attribute vec4 a_color;

    uniform mat4 u_proj;
    uniform mat4 u_world;

    varying vec2 v_uv;
    varying vec4 v_color;

    void main() {
      gl_Position = u_proj * u_world * vec4(a_pos, 0.0, 1.0);

      // Set fragment shader values.
      v_uv = a_uv;
      v_color = a_color;
    }`,

  // When no fragment shader is specified, use this one.
  defaultFragmentShader: `
    precision mediump float;

    varying vec2 v_uv;
    varying vec4 v_color;

    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); //v_color;
    }`,
});

// Set constructors.
__MODULE__.Program.prototype.constructor = __MODULE__.Program;

// Callback when the vertex shader source is done loading.
__MODULE__.Program.prototype.compileVertexShader = function(source) {
  var shader = gl.createShader(gl.VERTEX_SHADER);

  // Set source and compile.
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Make sure it compiled successfully.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw 'Vertex shader: ' + gl.getShaderInfoLog(shader);
  }

  // Attach the shader to the program.
  gl.attachShader(this.program, shader);

  // Set the vertex shader source.
  this.vss = source;

  // If both sources are compiled, link the program.
  if (this.vss !== undefined && this.fss !== undefined) {
    this.link();
  }
};

// Callback when the fragment shader source is done loading.
__MODULE__.Program.prototype.compileFragmentShader = function(source) {
  var shader = gl.createShader(gl.FRAGMENT_SHADER);

  // Set source and compile.
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Make sure it compiled successfully.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw 'Fragment shader: ' + gl.getShaderInfoLog(shader);
  }

  // Attach the shader to the program.
  gl.attachShader(this.program, shader);

  // Set the fragment shader source.
  this.fss = source;

  // If both sources are compiled, link the program.
  if (this.vss !== undefined && this.fss !== undefined) {
    this.link();
  }
};

// Once both the vertex and fragment shaders are loaded, link.
__MODULE__.Program.prototype.link = function() {
  gl.bindAttribLocation(this.program, 0, 'a_pos');

  // Link the program after binding the position attribute to location 0.
  gl.linkProgram(this.program);

  // Did it successfully link?
  if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
    throw 'Shader program: ' + gl.getProgramInfoLog(this.program);
  }

  // Set the required attributes and uniforms for all shader programs.
  this.a_pos = gl.getAttribLocation(this.program, 'a_pos');
  this.a_uv = gl.getAttribLocation(this.program, 'a_uv');
  this.a_color = gl.getAttribLocation(this.program, 'a_color');
  this.u_proj = gl.getUniformLocation(this.program, 'u_proj');
  this.u_world = gl.getUniformLocation(this.program, 'u_world');

  // Find custom attributes.
  if (this.attributeVariables !== undefined) {
    this.attributeVariables.forEach((function(attrib) {
      this[attrib] = gl.getAttribLocation(this.program, attrib);
    }).bind(this));
  }

  // Find custom uniforms.
  if (this.uniformVariables !== undefined) {
    this.uniformVariables.forEach((function(uniform) {
      this[uniform] = gl.getUniformLocation(this.program, uniform);
    }).bind(this));
  }

  // This asset is now done loading.
  spark.register(this);
};

// Make this shader current.
__MODULE__.Program.prototype.use = function() {
  gl.useProgram((spark.shader.current = this).program);
};
