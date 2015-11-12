// Sprite fragment shader.

precision highp float;

varying vec2 v_uv;

uniform vec4 u_color;
uniform sampler2D u_sampler;

void main() {
  vec4 sample = texture2D(u_sampler, vec2(v_uv.s, v_uv.t));
  gl_FragColor = vec4(sample * u_color);
}
