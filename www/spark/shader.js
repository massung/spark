/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec').defines({

  // This is the currently active shader.
  current: null,

  // A linked vertex and fragment shader.
  Program: function(vss, fss) {
    this.program = gl.createProgram();

    // Request this object, because it needs to request others.
    this.vs = spark.shader.compileShader(gl.VERTEX_SHADER, vss);
    this.fs = spark.shader.compileShader(gl.FRAGMENT_SHADER, fss);

    // Attach the shaders.
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);

    // Make sure the position attribute is always bound to location 0.
    gl.bindAttribLocation(this.program, 0, 'a_pos');

    // Link the program after binding the position attribute to location 0.
    gl.linkProgram(this.program);

    // Make sure the link succeeded.
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.program);
    }

    // Set the common attribute locations.
    this.a_pos = gl.getAttribLocation(this.program, 'a_pos');
    this.a_uv = gl.getAttribLocation(this.program, 'a_uv');
    this.a_color = gl.getAttribLocation(this.program, 'a_color');

    // Set the common uniform locations.
    this.u_proj = gl.getUniformLocation(this.program, 'u_proj');
    this.u_camera = gl.getUniformLocation(this.program, 'u_camera');
    this.u_world = gl.getUniformLocation(this.program, 'u_world');
    this.u_sampler = gl.getUniformLocation(this.program, 'u_sampler');
    this.u_alpha = gl.getUniformLocation(this.program, 'u_alpha');
  },

  // Simple, color-only, vertex shader.
  simpleVertexShader: `
    attribute vec2 a_pos;
    attribute vec4 a_color;

    varying highp vec4 v_color;

    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
      v_color = a_color;
    }`,

  // Simple, color-only, fragment shader.
  simpleFragmentShader: `
    varying highp vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }`,

  // When no vertex shader is specified, use this one.
  spriteVertexShader: `
    attribute vec2 a_pos;
    attribute vec2 a_uv;

    uniform mat4 u_proj;
    uniform mat4 u_camera;
    uniform mat4 u_world;

    varying lowp vec2 v_uv;

    void main() {
      gl_Position = u_proj * u_camera * u_world * vec4(a_pos, 0.0, 1.0);
      v_uv = a_uv;
    }`,

  // When no fragment shader is specified, use this one.
  spriteFragmentShader: `
    precision highp float;

    varying vec2 v_uv;

    uniform float u_alpha;
    uniform sampler2D u_sampler;

    void main() {
      vec4 sample = texture2D(u_sampler, vec2(v_uv.s, v_uv.t));
      gl_FragColor = vec4(sample.rgb, sample.a * u_alpha);
    }`,
});

// Set constructors.
__MODULE__.Program.prototype.constructor = __MODULE__.Program;

// Make this shader current.
__MODULE__.Program.prototype.use = function() {
  gl.useProgram((spark.shader.current = this).program);
};

// Callback when the vertex shader source is done loading.
__MODULE__.compileShader = function(type, source) {
  var shader = gl.createShader(type);

  // Set source and compile.
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Make sure it compiled successfully.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
};
