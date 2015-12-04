// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.input.*;

@:expose
class Mouse {
  static private var device: Device;

  // initialize the input module
  static public function install() {
    device = new Device(32, 1);

    // install handlers
    js.Browser.window.addEventListener('mousedown', onMouseDown, false);
    js.Browser.window.addEventListener('mouseup', onMouseUp, false);
    js.Browser.window.addEventListener('mousemove', onMouseMove, false);

    // this device is now connected
    device.attach();
  }

  // clear all per-frame data
  static public function flush() {
    device.flush();
  }

  // hide the mouse when it's over the canvas
  static public function hide() {
    Spark.canvas.style.cursor = 'none';
  }

  // show the mouse when it's over the canvas
  static public function show(?image: js.html.Image = null) {
    if (image == null) {
      Spark.canvas.style.cursor = 'pointer';
    } else {
      Spark.canvas.style.cursor = cast image;
    }
  }

  // returns the mouse position
  static public function getX(): Float return device.getX(0);
  static public function getY(): Float return device.getY(0);

  // returns the relative mouse position
  static public function getRelX(): Float return device.getRelX(0);
  static public function getRelY(): Float return device.getRelY(0);

  // true if the mouse button was pressed since the last flush
  static public function hit(?button: Int = 0): Bool {
    return device.hit(button);
  }

  // true if the mouse button is currently pressed
  static public function down(?button: Int = 0): Bool {
    return device.down(button);
  }

  // the number of times the mouse button was pressed since the last flush
  static public function hits(?button: Int = 0): Int {
    return device.hits(button);
  }

  // mousedown event handler
  static private function onMouseDown(event: js.html.MouseEvent) {
    device.press(event.button);
  }

  // mouseup event handler
  static private function onMouseUp(event: js.html.MouseEvent) {
    device.release(event.button);
  }

  // mousemove event handler
  static private function onMouseMove(event: js.html.MouseEvent) {
    var x = event.clientX - Spark.canvas.offsetLeft;
    var y = event.clientY - Spark.canvas.offsetTop;

    // move the dvice stick position
    device.move(0, x, y);
  }

  // mouse button constants
  static public var LEFT: Int = 0;
  static public var MIDDLE: Int = 1;
  static public var RIGHT: Int = 2;
}
