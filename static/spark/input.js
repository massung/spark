/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({
  keys: [],
  buttons: [],
  x: 0,
  y: 0,

  // Button constants.
  BUTTON: {
    'LEFT': 0,
    'MIDDLE': 1,
    'RIGHT': 2,
  },

  // Key constants.
  KEY: {
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
  },
});

// Attach this input module to a canvas control.
__MODULE__.init = function() {
  window.addEventListener('keydown', this.onKeyDown.bind(this), false);
  window.addEventListener('keyup', this.onKeyUp.bind(this), false);
  window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

  // Initialize the array of keys.
  for(var i = 0;i < 256;i++) {
    this.keys[i] = { down: false, hits: 0 };
  }

  // Initialize the array of mouse buttons.
  for(var i = 0;i < 16;i++) {
    this.buttons[i] = { down: false, hits: 0 };
  }
};

// Flush the key states every frame.
__MODULE__.flush = function() {
  var flushState = function(state) {
    state.hits = 0;
  };

  this.keys.forEach(flushState);
  this.buttons.forEach(flushState);
};

// Handle keydown events.
__MODULE__.onKeyDown = function(event) {
  var state = this.keys[event.keyCode];

  // Create a new state if none exists.
  if (state === undefined) {
    state = this.keys[event.keyCode] = { hits: 0 };
  }

  // Keyboard repeats shouldn't count as hits.
  if (state.down === false) {
    state.down = true;
    state.hits = state.hits + 1;
  }
};

// Handle keyup events.
__MODULE__.onKeyUp = function(event) {
  this.keys[event.keyCode].down = false;
};

// Handle button down events.
__MODULE__.onMouseDown = function(event) {
  var state = this.buttons[event.button];

  // Create a new state if none exists.
  if (state === undefined) {
    state = this.buttons[event.button] = { hits: 0 };
  }

  state.down = true;
  state.hits = state.hits + 1;
};

// Handle button up events.
__MODULE__.onMouseUp = function(event) {
  this.buttons[event.button].down = false;
};

// Handle mouse movement events.
__MODULE__.onMouseMove = function(event) {
  if (window.view !== undefined) {
    this.x = event.clientX - view.canvas.offsetLeft;
    this.y = event.clientY - view.canvas.offsetTop;
  }
};

// Returns how many times a key has been hit this frame.
__MODULE__.keyHits = function(key) {
  return this.keys[key].hits;
};

// True if the key was hit at all during the frame.
__MODULE__.keyHit = function(key) {
  return this.keys[key].hits > 0;
};

// True if the key is currently down.
__MODULE__.keyDown = function(key) {
  return this.keys[key].down;
};

// Returns how many times a mouse button has been hit this frame.
__MODULE__.mouseHits = function(button) {
  return this.buttons[button || 0].hits;
};

// Returns true if the mouse button was hit at all this frame.
__MODULE__.mouseHit = function(button) {
  return this.buttons[button || 0].hits > 0;
};

// True if the mouse button is currently down.
__MODULE__.mouseDown = function(button) {
  return this.buttons[button || 0].down;
};
