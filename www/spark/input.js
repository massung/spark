/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({
  keys: [],
  buttons: [],
  touches: [],
  x: 0,
  y: 0,
  relativeX: 0,
  relativeY: 0,

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
  var i;

  // Initialize the array of keys.
  for(i = 0;i < 256;i++) {
    this.keys[i] = { down: false, hits: 0 };
  }

  // Initialize the array of mouse buttons.
  for(i = 0;i < 16;i++) {
    this.buttons[i] = { down: false, hits: 0 };
  }

  // Initialize the array of touches.
  for(i = 0;i < 10;i++) {
    this.touches[i] = { /* TODO */ };
  }
};

// Hide the cursor.
__MODULE__.hideCursor = function() {
  spark.view.canvas.style.cursor = 'none';
};

// Show the cursor with an optional sprite image.
__MODULE__.showCursor = function(image) {
  spark.view.canvas.style.cursor = image || 'pointer';
};

// Add mouse support.
__MODULE__.enableMouse = function() {
  window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
};

// Add keyboard support.
__MODULE__.enableKeyboard = function() {
  window.addEventListener('keydown', this.onKeyDown.bind(this), false);
  window.addEventListener('keyup', this.onKeyUp.bind(this), false);
};

// Add touch support on a mobile device.
__MODULE__.enableTouch = function() {
  spark.view.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
  spark.view.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
  spark.view.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
};

// Flush the key states every frame.
__MODULE__.flush = function() {
  var flushState = function(state) {
    state.hits = 0;
  };

  this.keys.forEach(flushState);
  this.buttons.forEach(flushState);

  // Clear all relative motion.
  this.relativeX = 0;
  this.relativeY = 0;
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
  var x = event.clientX - spark.view.canvas.offsetLeft;
  var y = event.clientY - spark.view.canvas.offsetTop;

  // Update relative motion.
  this.relativeX += x - this.x;
  this.relativeY += y - this.y;

  // Update position.
  this.x = x;
  this.y = y;
};

// Handle touch down.
__MODULE__.onTouchStart = function(event) {
  if (event.targetTouches.length === 1) {
    this.touch = true;

    this.x = event.targetTouches[0].pageX - spark.view.canvas.offsetLeft;
    this.y = event.targetTouches[0].pageY - spark.view.canvas.offsetTop;

    // Reset relative motion.
    this.relativeX = 0;
    this.relativeY = 0;
  }

  // Don't send mouse events.
  event.preventDefault();
};

// Handle touch up.
__MODULE__.onTouchEnd = function(event) {
  if (event.targetTouches.length === 1) {
    this.touches[0].down = false;
  }

  // Don't send mouse events.
  event.preventDefault();
};

// Handle touch motion.
__MODULE__.onTouchMove = function(event) {
  if (event.targetTouches.length === 1) {
    var x = event.targetTouches[0].pageX - spark.view.canvas.offsetLeft;
    var y = event.targetTouches[0].pageY - spark.view.canvas.offsetTop;

    // Update the touch data.
    this.touches[0].relativeX += x - this.touches[0].x;
    this.touches[0].relativeY += x - this.touches[0].y;
    this.touches[0].x = x;
    this.touches[0].y = y;
  }

  // Don't send mouse events.
  event.preventDefault();
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
