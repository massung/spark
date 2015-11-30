// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Util {

  // convert degrees to radians
  static public function degToRad(r: Float): Float {
    return r * Math.PI / 180.0;
  }

  // convert radians to degrees
  static public function radToDeg(r: Float): Float {
    return r * 180.0 / Math.PI;
  }

  // the signum function
  static public function signum(n: Float): Int {
    if (Math.abs(n) < 0.00001) {
      return 0;
    }

    return (n > 0) ? 1 : -1;
  }

  // returns the next power of two from a give number
  static public function nextPow2(n: Int): Int {
    return cast Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
  }

  // returns a value, clamped to the range [min,max]
  static public function clamp(n: Float, min: Float, max: Float): Float {
    return Math.max(min, Math.min(n, max));
  }

  // a random number in the range [min,max]
  static public function rand(min: Float, max: Float): Float {
    return Math.random() * (max - min) + min;
  }

  // a random integer in the range [min,max)
  static public function irand(min: Int, max: Int): Int {
    return Math.floor(rand(min, max));
  }

  // a random element from an array
  static public function arand(array: Array<Dynamic>): Dynamic {
    return array[irand(0, array.length)];
  }

  // linearly interpolate from p to q by k in the range [0,max | 1]
  static public function lerp(p: Float, q: Float, k: Float, ?max: Float = 1): Float {
    return p + (q - p) * k / max;
  }
}
