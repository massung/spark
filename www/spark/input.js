/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// Module state.
spark.keys = [];
spark.buttons = [];
spark.touches = [];
spark.x = 0;
spark.y = 0;
spark.relativeX = 0;
spark.relativeY = 0;

// Button constants.
spark.BUTTON = {
  'LEFT': 0,
  'MIDDLE': 1,
  'RIGHT': 2,
};

// Key constants.
spark.KEY = {
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
};

// Called once when the module's dependencies are met.
__MODULE__.init = function() {
  var i;

  // Initialize the array of keys.
  for(i = 0;i < 256;i++) {
    spark.keys[i] = { down: false, hits: 0 };
  }

  // Initialize the array of mouse buttons.
  for(i = 0;i < 16;i++) {
    spark.buttons[i] = { down: false, hits: 0 };
  }

  // Initialize the array of touches.
  for(i = 0;i < 10;i++) {
    spark.touches[i] = { /* TODO */ };
  }
};

// Hide the cursor.
spark.hideCursor = function() {
  gl.canvas.style.cursor = 'none';
};

// Show the cursor with an optional sprite image.
spark.showCursor = function(image) {
  gl.canvas.style.cursor = image || 'pointer';
};

// Add mouse support.
spark.enableMouse = function() {
  window.addEventListener('mousedown', spark.onMouseDown.bind(spark), false);
  window.addEventListener('mouseup', spark.onMouseUp.bind(spark), false);
  window.addEventListener('mousemove', spark.onMouseMove.bind(spark), false);
};

// Add keyboard support.
spark.enableKeyboard = function() {
  window.addEventListener('keydown', spark.onKeyDown.bind(spark), false);
  window.addEventListener('keyup', spark.onKeyUp.bind(spark), false);
};

// Add touch support on a mobile device.
spark.enableTouch = function() {
  gl.canvas.addEventListener('touchstart', spark.onTouchStart.bind(spark), false);
  gl.canvas.addEventListener('touchend', spark.onTouchEnd.bind(spark), false);
  gl.canvas.addEventListener('touchmove', spark.onTouchMove.bind(spark), false);
};

// Flush the key states every frame.
spark.flushInput = function() {
  var flushState = function(state) {
    state.hits = 0;
  };

  spark.keys.forEach(flushState);
  spark.buttons.forEach(flushState);

  // Clear all relative motion.
  spark.relativeX = 0;
  spark.relativeY = 0;
};

// Handle keydown events.
spark.onKeyDown = function(event) {
  var state = spark.keys[event.keyCode];

  // Create a new state if none exists.
  if (state === undefined) {
    state = spark.keys[event.keyCode] = { hits: 0 };
  }

  // Keyboard repeats shouldn't count as hits.
  if (state.down === false) {
    state.down = true;
    state.hits = state.hits + 1;
  }
};

// Handle keyup events.
spark.onKeyUp = function(event) {
  spark.keys[event.keyCode].down = false;
};

// Handle button down events.
spark.onMouseDown = function(event) {
  var state = spark.buttons[event.button];

  // Create a new state if none exists.
  if (state === undefined) {
    state = spark.buttons[event.button] = { hits: 0 };
  }

  state.down = true;
  state.hits = state.hits + 1;
};

// Handle button up events.
spark.onMouseUp = function(event) {
  spark.buttons[event.button].down = false;
};

// Handle mouse movement events.
spark.onMouseMove = function(event) {
  var x = event.clientX - gl.canvas.offsetLeft;
  var y = event.clientY - gl.canvas.offsetTop;

  // Update relative motion.
  spark.relativeX += x - spark.x;
  spark.relativeY += y - spark.y;

  // Update position.
  spark.x = x;
  spark.y = y;
};

// Handle touch down.
spark.onTouchStart = function(event) {
  if (event.targetTouches.length === 1) {
    spark.touch = true;

    spark.x = event.targetTouches[0].pageX - gl.canvas.offsetLeft;
    spark.y = event.targetTouches[0].pageY - gl.canvas.offsetTop;

    // Reset relative motion.
    spark.relativeX = 0;
    spark.relativeY = 0;
  }

  // Don't send mouse events.
  event.preventDefault();
};

// Handle touch up.
spark.onTouchEnd = function(event) {
  if (event.targetTouches.length === 1) {
    spark.touches[0].down = false;
  }

  // Don't send mouse events.
  event.preventDefault();
};

// Handle touch motion.
spark.onTouchMove = function(event) {
  if (event.targetTouches.length === 1) {
    var x = event.targetTouches[0].pageX - gl.canvas.offsetLeft;
    var y = event.targetTouches[0].pageY - gl.canvas.offsetTop;

    // Update the touch data.
    spark.touches[0].relativeX += x - spark.touches[0].x;
    spark.touches[0].relativeY += x - spark.touches[0].y;
    spark.touches[0].x = x;
    spark.touches[0].y = y;
  }

  // Don't send mouse events.
  event.preventDefault();
};

// Returns how many times a key has been hit this frame.
spark.keyHits = function(key) {
  return key < spark.keys.length ? spark.keys[key].hits : 0;
};

// True if the key was hit at all during the frame.
spark.keyHit = function(key) {
  return key < spark.keys.length ? spark.keys[key].hits > 0 : false;
};

// True if the key is currently down.
spark.keyDown = function(key) {
  return key < spark.keys.length ? spark.keys[key].down : false;
};

// Returns how many times a mouse button has been hit this frame.
spark.mouseHits = function(button) {
  return button < spark.buttons.lenght ? spark.buttons[button || 0].hits : 0;
};

// Returns true if the mouse button was hit at all this frame.
spark.mouseHit = function(button) {
  return button < spark.buttons.lenght ? spark.buttons[button || 0].hits > 0 : false;
};

// True if the mouse button is currently down.
spark.mouseDown = function(button) {
  return button < spark.buttons.lenght ? spark.buttons[button || 0].down : false;
};
