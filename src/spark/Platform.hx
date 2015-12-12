// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Platform {

  // return the device being run on
  static public function getDevice(): String {
    if (Reflect.hasField(js.Browser.window, 'cordova')) {
      return Reflect.field(js.Browser.window, 'cordova');
    }

    // the default platform
    return 'browser';
  }

  // true if this device is mobile
  static public function isMobile(): Bool return getDevice() != 'browser';

  // returns the width of the device display
  static public function getWidth(): Int {
    return isMobile() ? js.Browser.window.screen.width : js.Browser.window.innerWidth;
  }

  // returns the height of the device display
  static public function getHeight(): Int {
    return isMobile() ? js.Browser.window.screen.height : js.Browser.window.innerHeight;
  }
}
