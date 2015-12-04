// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.input.*;

@:expose
class Key {
  static private var device: Device;

  // initialize the keyboard input module
  static public function install() {
    device = new Device(256, 0);

    // add event handlers
    js.Browser.window.addEventListener('keydown', onKeyDown, false);
    js.Browser.window.addEventListener('keyup', onKeyUp, false);

    // this device is now connected
    device.attach();
  }

  // reset hit counts on all input devices
  static public function flush() {
    device.flush();
  }

  // true if a key has been hit since the last flush
  static public function hit(key: Int): Bool {
    return device.hit(key);
  }

  // true if the key is currently pressed
  static public function down(key: Int): Bool {
    return device.down(key);
  }

  // the number of times a key has been hit since the last flush
  static public function hits(key: Int): Int {
    return device.hits(key);
  }

  // keydown event handler
  static private function onKeyDown(event: js.html.KeyboardEvent) {
    if (!event.repeat) {
      device.press(event.keyCode);
    }
  }

  // keyup event handler
  static private function onKeyUp(event: js.html.KeyboardEvent) {
    device.release(event.keyCode);
  }

  // key code constants
  static public var BACKSPACE: Int = 8;
  static public var TAB: Int = 9;
  static public var ENTER: Int = 13;
  static public var PAUSE: Int = 19;
  static public var CAPS: Int = 20;
  static public var ESC: Int = 27;
  static public var SPACE: Int = 32;
  static public var PAGE_UP: Int = 33;
  static public var PAGE_DOWN: Int = 34;
  static public var END: Int = 35;
  static public var HOME: Int = 36;
  static public var LEFT: Int = 37;
  static public var UP: Int = 38;
  static public var RIGHT: Int = 39;
  static public var DOWN: Int = 40;
  static public var INSERT: Int = 45;
  static public var DELETE: Int = 46;
  static public var _0: Int = 48;
  static public var _1: Int = 49;
  static public var _2: Int = 50;
  static public var _3: Int = 51;
  static public var _4: Int = 52;
  static public var _5: Int = 53;
  static public var _6: Int = 54;
  static public var _7: Int = 55;
  static public var _8: Int = 56;
  static public var _9: Int = 57;
  static public var A: Int = 65;
  static public var B: Int = 66;
  static public var C: Int = 67;
  static public var D: Int = 68;
  static public var E: Int = 69;
  static public var F: Int = 70;
  static public var G: Int = 71;
  static public var H: Int = 72;
  static public var I: Int = 73;
  static public var J: Int = 74;
  static public var K: Int = 75;
  static public var L: Int = 76;
  static public var M: Int = 77;
  static public var N: Int = 78;
  static public var O: Int = 79;
  static public var P: Int = 80;
  static public var Q: Int = 81;
  static public var R: Int = 82;
  static public var S: Int = 83;
  static public var T: Int = 84;
  static public var U: Int = 85;
  static public var V: Int = 86;
  static public var W: Int = 87;
  static public var X: Int = 88;
  static public var Y: Int = 89;
  static public var Z: Int = 90;
  static public var NUMPAD_0: Int = 96;
  static public var NUMPAD_1: Int = 97;
  static public var NUMPAD_2: Int = 98;
  static public var NUMPAD_3: Int = 99;
  static public var NUMPAD_4: Int = 100;
  static public var NUMPAD_5: Int = 101;
  static public var NUMPAD_6: Int = 102;
  static public var NUMPAD_7: Int = 103;
  static public var NUMPAD_8: Int = 104;
  static public var NUMPAD_9: Int = 105;
  static public var MULTIPLY: Int = 106;
  static public var ADD: Int = 107;
  static public var SUBSTRACT: Int = 109;
  static public var DECIMAL: Int = 110;
  static public var DIVIDE: Int = 111;
  static public var F1: Int = 112;
  static public var F2: Int = 113;
  static public var F3: Int = 114;
  static public var F4: Int = 115;
  static public var F5: Int = 116;
  static public var F6: Int = 117;
  static public var F7: Int = 118;
  static public var F8: Int = 119;
  static public var F9: Int = 120;
  static public var F10: Int = 121;
  static public var F11: Int = 122;
  static public var F12: Int = 123;
  static public var SHIFT: Int = 16;
  static public var CTRL: Int = 17;
  static public var ALT: Int = 18;
  static public var PLUS: Int = 187;
  static public var COMMA: Int = 188;
  static public var MINUS: Int = 189;
  static public var PERIOD: Int = 190;
}
