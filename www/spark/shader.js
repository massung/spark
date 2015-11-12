/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec').defines({

  // This is the currently active shader.
  current: null,

  // A linked vertex and fragment shader.
  Program: function(src) {
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
  },

  // The basic shader is a simple projection + color shader.
  Basic: function() {
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
  },
});

// A basic shader is a shader program.
__MODULE__.Basic.prototype = Object.create(__MODULE__.Program.prototype);

// Set constructors.
__MODULE__.Program.prototype.constructor = __MODULE__.Program;
__MODULE__.Basic.prototype.constructor = __MODULE__.Basic;

// Make this shader current.
__MODULE__.Program.prototype.use = function() {
  gl.useProgram((spark.shader.current = this).program);
};

// Callback when the vertex shader source is done loading.
__MODULE__.Program.prototype.compileShader = function(type, source) {
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
__MODULE__.Program.prototype.link = function() {
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
