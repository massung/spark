// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

typedef State = { down: Bool, hits: Int }

@:expose
class Input {

  // track the current state of all keys and buttons
  static private var keys: Array<State>;
  static private var buttons: Array<State>;

  // current mouse position
  static private var x: Float;
  static private var y: Float;

  // relative mouse position since last flush
  static private var relX: Float;
  static private var relY: Float;

  // initialize the input module
  static public function init() {
    var i: Int;

    // create device states
    keys = new Array<State>();
    buttons = new Array<State>();

    // initialize all the keys
    for(i in 0...255) keys.push({ down: false, hits: 0 });
    for(i in 0...31) buttons.push({ down: false, hits: 0 });

    // no relative motion
    relX = 0;
    relY = 0;
  }

  // enable the keyboard input device
  static public function enableKeyboard() {
    js.Browser.window.addEventListener('keydown', onKeyDown, false);
    js.Browser.window.addEventListener('keyup', onKeyUp, false);
  }

  // enable the mouse input device
  static public function enableMouse() {
    js.Browser.window.addEventListener('mousedown', onMouseDown, false);
    js.Browser.window.addEventListener('mouseup', onMouseUp, false);
    js.Browser.window.addEventListener('mousemove', onMouseMove, false);
  }

  // reset hit counts on all input devices
  static public function flush() {
    for(i in 0...keys.length) keys[i].hits = 0;
    for(i in 0...buttons.length) buttons[i].hits = 0;

    // clear relative motion
    relX = 0;
    relY = 0;
  }

  // hide the mouse when it's over the canvas
  static public function hideCursor() {
    Spark.canvas.style.cursor = 'none';
  }

  // show the mouse when it's over the canvas
  static public function showCursor(?image: js.html.Image = null) {
    if (image == null) {
      Spark.canvas.style.cursor = 'pointer';
    } else {
      Spark.canvas.style.cursor = cast image;
    }
  }

  // returns the mouse position as a vector
  static public function mousePos(): Vec {
    return new Vec(x, y);
  }

  // returns the relative mouse position as a vector
  static public function mouseRel(): Vec {
    return new Vec(relX, relY);
  }

  // true if the key is currently pressed
  static public function keyDown(key: Int): Bool {
    return (key >= 0 && key < keys.length) ? keys[key].down : false;
  }

  // true if a key has been hit since the last flush
  static public function keyHit(key: Int): Bool {
    return keyHits(key) > 0;
  }

  // the number of times a key has been hit since the last flush
  static public function keyHits(key: Int): Int {
    return (key >= 0 && key < keys.length) ? keys[key].hits : 0;
  }

  // true if the mouse button is currently pressed
  static public function buttonDown(?button: Int = 0): Bool {
    return (button >= 0 && button < buttons.length) ? buttons[button].down : false;
  }

  // true if a button has been hit since the last flush
  static public function buttonHit(?button: Int = 0): Bool {
    return buttonHits(button) > 0;
  }

  // the number of times a button has been hit since the last flush
  static public function buttonHits(?button: Int = 0): Int {
    return (button >= 0 && button < buttons.length) ? buttons[button].hits : 0;
  }

  // keydown event handler
  static function onKeyDown(event: js.html.KeyboardEvent) {
    if (!event.repeat && event.keyCode < keys.length) {
      keys[event.keyCode].down = true;
      keys[event.keyCode].hits++;
    }
  }

  // keyup event handler
  static function onKeyUp(event: js.html.KeyboardEvent) {
    if (event.keyCode < keys.length) {
      keys[event.keyCode].down = false;
    }
  }

  // mousedown event handler
  static function onMouseDown(event: js.html.MouseEvent) {
    if (event.button < buttons.length) {
      buttons[event.button].down = true;
      buttons[event.button].hits++;
    }
  }

  // mouseup event handler
  static function onMouseUp(event: js.html.MouseEvent) {
    if (event.button < buttons.length) {
      buttons[event.button].down = false;
    }
  }

  // mousemove event handler
  static function onMouseMove(event: js.html.MouseEvent) {
    x = event.clientX - Spark.canvas.offsetLeft;
    y = event.clientY - Spark.canvas.offsetTop;

    // update relative motion
    relX = event.movementX;
    relY = event.movementY;
  }

  // mouse button constants
  static public var Button = {
    'LEFT': 0,
    'MIDDLE': 1,
    'RIGHT': 2,
  }

  // key code constants
  static public var Key = {
    'BACKSPACE': 8,
    'TAB': 9,
    'ENTER': 13,
    'PAUSE': 19,
    'CAPS': 20,
    'ESC': 27,
    'SPACE': 32,
    'PAGE_UP': 33,
    'PAGE_DOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40,
    'INSERT': 45,
    'DELETE': 46,
    '_0': 48,
    '_1': 49,
    '_2': 50,
    '_3': 51,
    '_4': 52,
    '_5': 53,
    '_6': 54,
    '_7': 55,
    '_8': 56,
    '_9': 57,
    'A': 65,
    'B': 66,
    'C': 67,
    'D': 68,
    'E': 69,
    'F': 70,
    'G': 71,
    'H': 72,
    'I': 73,
    'J': 74,
    'K': 75,
    'L': 76,
    'M': 77,
    'N': 78,
    'O': 79,
    'P': 80,
    'Q': 81,
    'R': 82,
    'S': 83,
    'T': 84,
    'U': 85,
    'V': 86,
    'W': 87,
    'X': 88,
    'Y': 89,
    'Z': 90,
    'NUMPAD_0': 96,
    'NUMPAD_1': 97,
    'NUMPAD_2': 98,
    'NUMPAD_3': 99,
    'NUMPAD_4': 100,
    'NUMPAD_5': 101,
    'NUMPAD_6': 102,
    'NUMPAD_7': 103,
    'NUMPAD_8': 104,
    'NUMPAD_9': 105,
    'MULTIPLY': 106,
    'ADD': 107,
    'SUBSTRACT': 109,
    'DECIMAL': 110,
    'DIVIDE': 111,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'SHIFT': 16,
    'CTRL': 17,
    'ALT': 18,
    'PLUS': 187,
    'COMMA': 188,
    'MINUS': 189,
    'PERIOD': 190,
  }
}
