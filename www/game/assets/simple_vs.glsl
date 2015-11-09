// Simple vertex shader.

attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);

  // Set fragment shader values.
  v_uv = a_uv;
  v_color = a_color;
}
