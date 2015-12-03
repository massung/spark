// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import haxe.ds.Option;

@:expose
class Util {

  // float to string conversion with precision
  static public function flToStr(f: Float, ?prec: Int = 2): String {
    var s: String = '' + (f * Math.pow(10, prec) / Math.pow(10, prec));
    var n: Int = s.lastIndexOf('.');

    // no decimal, add one and pad
    if (n < 0) {
      return StringTools.rpad(s + '.', '0', s.length + 1 + prec);
    }

    // not enough zeroes, pad out
    if (s.length - n < prec) {
      return StringTools.rpad(s, '0', s.length - n + prec);
    }

    return s.substr(0, n + 1 + prec);
  }

  // convert degrees to radians
  static public function degToRad(r: Float): Float {
    return r * Math.PI / 180.0;
  }

  // convert radians to degrees
  static public function radToDeg(r: Float): Float {
    return r * 180.0 / Math.PI;
  }

  // the signum function
  static public function sign(n: Float): Int {
    return (Math.abs(n) < 0.00001) ? 0 : ((n > 0) ? 1 : -1);
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

  // merge one anonymous structure (b) into another (a), overwrite
  static public function merge(a: Dynamic, b: Dynamic) {
    var i, fields = Reflect.fields(b);

    // any fields in a not in b will be unchanged
    for(i in 0...fields.length) {
      Reflect.setField(a, fields[i], Reflect.field(b, fields[i]));
    }
  }

  // get next next result in a query result and merge attributes into an anonymous struct
  static public function mergeElement(obj: Dynamic, node: js.html.Element) {
    var i, fields = Reflect.fields(obj);

    for(i in 0...fields.length) {
      var attr = node.getAttribute(fields[i]);

      if (attr != null) {
        Reflect.setField(obj, fields[i], attr);
      }
    }
  }
}
