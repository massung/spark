// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // track the current state of all keys and buttons
  var keys = [];
  var buttons = [];

  // current mouse position
  export var x: number = 0;
  export var y: number = 0;

  // delta mouse position
  export var relativeX: number = 0;
  export var relativeY: number = 0;

   // hide the mouse when it's over the canvas
   export function hideCursor() {
     canvas.style.cursor = 'none';
   }

   // show the mouse when it's over the canvas
   export function showCursor(image?) {
     canvas.style.cursor = image || 'pointer';
   }

   // attach callbacks for the mouse
   export function enableMouse() {
     window.addEventListener('mousedown', onMouseDown, false);
     window.addEventListener('mouseup', onMouseUp, false);
     window.addEventListener('mousemove', onMouseMove, false);
   }

   // attach callbacks for the keyboard
   export function enableKeyboard() {
     window.addEventListener('keydown', onKeyDown, false);
     window.addEventListener('keyup', onKeyUp, false);
   }

   // clear all the press hits for input devices
   export function flushInput() {
     var flushState = state => { if (state) state.hits = 0; };

     // flush each input device
     keys.forEach(flushState);
     buttons.forEach(flushState);

     // Clear all relative motion.
     relativeX = 0;
     relativeY = 0;
   }

   // true if a key is currently pressed
   export function keyDown(key: number): boolean {
     var state = keys[key];

     if (state) {
       return state.down;
     }

     // unknown key
     return false;
   }

   // returns the number of times a key was pressed since the last flush
   export function keyHits(key: number): number {
     var state = keys[key];

     if (state) {
       return state.hits;
     }

     // unknown key
     return 0;
   }

   // true if a key has been hit since the last flush
   export function keyHit(key: number): boolean {
     return keyHits(key) > 0;
   }

   // true if the mouse button is currently pressed
   export function mouseDown(button?: number): boolean {
     var state = buttons[button];

     if (state) {
       return state.down;
     }

     // unknown button
     return false;
   };

   // the number of times the mouse has been clicked since the last flush
   export function mouseHits(button?: number): number {
     var state = buttons[button];

     if (state) {
       return state.hits;
     }

     // unknown button
     return 0;
   };

   // true if the mouse has been clicked since the last flush
   export function mouseHit(button?: number): boolean {
     return mouseHits(button) > 0;
   };

  // mouse button constants
  export enum Button {
    LEFT,
    MIDDLE,
    RIGHT,
  }

  // key code constants
  export enum Key {
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    PAUSE = 19,
    CAPS = 20,
    ESC = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    INSERT = 45,
    DELETE = 46,
    _0 = 48,
    _1 = 49,
    _2 = 50,
    _3 = 51,
    _4 = 52,
    _5 = 53,
    _6 = 54,
    _7 = 55,
    _8 = 56,
    _9 = 57,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    NUMPAD_0 = 96,
    NUMPAD_1 = 97,
    NUMPAD_2 = 98,
    NUMPAD_3 = 99,
    NUMPAD_4 = 100,
    NUMPAD_5 = 101,
    NUMPAD_6 = 102,
    NUMPAD_7 = 103,
    NUMPAD_8 = 104,
    NUMPAD_9 = 105,
    MULTIPLY = 106,
    ADD = 107,
    SUBSTRACT = 109,
    DECIMAL = 110,
    DIVIDE = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    SHIFT = 16,
    CTRL = 17,
    ALT = 18,
    PLUS = 187,
    COMMA = 188,
    MINUS = 189,
    PERIOD = 190,
  }

  // keydown event handler
  function onKeyDown(event) {
    var state = keys[event.keyCode];

    if (state) {
      state.down = true;
      state.hits++;
    } else {
      keys[event.keyCode] = {
        down: true,
        hits: 1,
      }
    }
  }

  // keyup event handler
  function onKeyUp(event) {
    var state = keys[event.keyCode];

    if (state) {
      state.down = false;
    }
  }

  // mouse click handler
  function onMouseDown(event) {
    var state = buttons[event.button];

    if (state) {
      state.down = true;
      state.hits++;
    } else {
      buttons[event.button] = {
        down: true,
        hits: 1,
      }
    }
  }

  // mouse release handler
  function onMouseUp(event) {
    var state = buttons[event.button];

    if (state) {
      state.down = false;
    }
  }

  // mouse move handler
  function onMouseMove(event) {
    var eventX = event.clientX - canvas.offsetLeft;
    var eventY = event.clientY - canvas.offsetTop;

    // update relative motion
    relativeX += eventX - x;
    relativeY += eventY - y;

    // update position
    x = eventX;
    y = eventY;
  }
}
