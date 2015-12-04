// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.input.*;

@:expose
class Joystick {
  static private var devices: Array<Device>;

  // install gamepad devices and event handlers
  static public function install() {
    var i;

    devices = new Array<Device>();

    // get all the installed gamepads
    var gamepads = js.Browser.navigator.getGamepads();

    // initialize each device as a twin-stick controller
    for(i in 0...gamepads.length) {
      var device = new Device(gamepads[i].buttons.length, gamepads[i].axes.length >> 1);

      // if the gamepad is connected, attach it
      if (gamepads[i].connected) {
        device.attach();
      }
    }
  }

  // reset hit counts on all input devices
  static public function flush() {
    var i, gamepads = js.Browser.navigator.getGamepads();

    // first flush, hit counts on buttons is reset
    for(i in 0...devices.length) {
      devices[i].flush();
    }

    // loop over all gamepads, update buttons and axes
    for(i in 0...gamepads.length) {
      var axis, button;

      // ignore gamepads no longer attached
      if (!gamepads[i].connected) {
        continue;
      }

      // two axis per stick: x and y
      for(axis in 0...gamepads[i].axes.length >> 1) {
        devices[i].move(axis, gamepads[i].axes[axis * 2], gamepads[i].axes[axis * 2 + 1]);
      }

      // update the button status
      for(button in 0...gamepads[i].buttons.length) {
        if (gamepads[i].buttons[button].pressed) {
          devices[i].press(button);
        } else {
          devices[i].release(button);
        }
      }
    }
  }

  // true if the joystick device is active
  static public function isConnected(?joy: Int = 0) {
    return (joy >= 0 && joy < devices.length) && devices[joy].isConnected();
  }

  // returns the left stick x position
  static public function getLeftX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getX(0) : 0;
  }

  // returns the right stick x position
  static public function getRightX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getX(1) : 0;
  }

  // returns the right stick y position
  static public function getRightY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getY(1) : 0;
  }

  // returns the left stick relative x position
  static public function getLeftRelX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getRelX(0) : 0;
  }

  // returns the left stick relative y position
  static public function getLeftRelY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getRelY(0) : 0;
  }

  // returns the left stick relative x position
  static public function getRightRelX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getRelX(1) : 0;
  }

  // returns the left stick relative y position
  static public function getRightRelY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices[joy].getRelY(1) : 0;
  }

  // true if the mouse button was pressed since the last flush
  static public function hit(joy: Int, button: Int = 0): Bool {
    return isConnected(joy) ? devices[joy].hit(button) : false;
  }

  // true if the mouse button is currently pressed
  static public function down(joy: Int, button: Int = 0): Bool {
    return isConnected(joy) ? devices[joy].down(button) : false;
  }

  // the number of times the mouse button was pressed since the last flush
  static public function hits(joy: Int, button: Int = 0): Int {
    return isConnected(joy) ? devices[joy].hits(button) : 0;
  }

  // gamepad button constants
  static public var A: Int = 0;
  static public var B: Int = 1;
  static public var X: Int = 2;
  static public var Y: Int = 3;
  static public var UP: Int = 12;
  static public var DOWN: Int = 13;
  static public var LEFT: Int = 14;
  static public var RIGHT: Int = 15;
}
