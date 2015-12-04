// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import haxe.ds.IntMap;
import spark.input.*;

@:expose
class Joystick {
  static private var devices: IntMap<Device>;

  // install gamepad devices and event handlers
  static public function install() {
    var i;

    devices = new IntMap<Device>();

    // get all the installed gamepads
    var gamepads = js.Browser.navigator.getGamepads();

    // initialize each device as a twin-stick controller
    for(i in 0...gamepads.length) {
      if (gamepads[i] == null) {
        continue;
      }

      // create the device for the gamepad
      var device = new Device(gamepads[i].buttons.length, gamepads[i].axes.length >> 1);

      // if the gamepad is connected, attach it
      if (gamepads[i].connected) {
        device.attach();
      }

      // add the gamepad to the device list
      devices.set(gamepads[i].index, device);
    }
  }

  // reset hit counts on all input devices
  static public function flush() {
    var device, gamepads = js.Browser.navigator.getGamepads();

    // first flush, hit counts on buttons is reset
    for(device in devices) {
      device.flush();
    }

    // loop over all gamepads, update buttons and axes
    for(i in 0...gamepads.length) {
      var axis, button;

      // ignore gamepads no longer attached
      if (gamepads[i] == null) {
        continue;
      }

      var device = devices.get(gamepads[i].index);

      // ignore disconnected devices
      if (device == null || !gamepads[i].connected) {
        continue;
      }

      // two axis per stick: x and y
      for(axis in 0...gamepads[i].axes.length >> 1) {
        device.move(axis, gamepads[i].axes[axis * 2], gamepads[i].axes[axis * 2 + 1]);
      }

      // update the button status
      for(button in 0...gamepads[i].buttons.length) {
        if (gamepads[i].buttons[button].pressed) {
          device.press(button);
        } else {
          device.release(button);
        }
      }
    }
  }

  // true if the joystick device is active
  static public function isConnected(?joy: Int = 0) {
    return devices.exists(joy) && devices.get(joy).isConnected();
  }

  // returns the left stick x position
  static public function getLeftX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getX(0) : 0;
  }

  // returns the right stick x position
  static public function getRightX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getX(1) : 0;
  }

  // returns the right stick y position
  static public function getRightY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getY(1) : 0;
  }

  // returns the left stick relative x position
  static public function getLeftRelX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getRelX(0) : 0;
  }

  // returns the left stick relative y position
  static public function getLeftRelY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getRelY(0) : 0;
  }

  // returns the left stick relative x position
  static public function getRightRelX(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getRelX(1) : 0;
  }

  // returns the left stick relative y position
  static public function getRightRelY(?joy: Int = 0): Float {
    return isConnected(joy) ? devices.get(joy).getRelY(1) : 0;
  }

  // true if the mouse button was pressed since the last flush
  static public function hit(joy: Int, button: Int = 0): Bool {
    return isConnected(joy) ? devices.get(joy).hit(button) : false;
  }

  // true if the mouse button is currently pressed
  static public function down(joy: Int, button: Int = 0): Bool {
    return isConnected(joy) ? devices.get(joy).down(button) : false;
  }

  // the number of times the mouse button was pressed since the last flush
  static public function hits(joy: Int, button: Int = 0): Int {
    return isConnected(joy) ? devices.get(joy).hits(button) : 0;
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
