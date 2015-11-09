// Simple vertex shader.

attribute vec2 a_pos;
attribute vec4 a_color;

varying vec4 v_color;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_color = a_color;
}
