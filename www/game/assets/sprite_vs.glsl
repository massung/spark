// Sprite vertex shader.

attribute vec2 a_pos;
attribute vec2 a_uv;

uniform mat4 u_proj;
uniform mat4 u_camera;
uniform mat4 u_world;

varying lowp vec2 v_uv;

void main() {
  gl_Position = u_proj * u_camera * u_world * vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}
