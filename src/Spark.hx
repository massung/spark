// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

import js.Lib;
import js.Browser;

// get all of spark
import spark.*;

class Spark {
  static private var loadQueue: Array<Asset>;

  // the global canvas DOM element to render to and its view context
  static public var canvas: js.html.CanvasElement;
  static public var view: js.html.CanvasRenderingContext2D;

  // entry point
  static function main() {
    loadQueue = [];

    // find the view
    canvas = cast js.Browser.document.getElementById('canvas');
    view = canvas.getContext2d();

    // initialize audio
    spark.Audio.init();

    // initialize input devices
    spark.Input.init();
    spark.Input.hideCursor();

    // disable the context menu
    canvas.oncontextmenu = function(event) {
      event.preventDefault();
    };
  }

  // request a new asset to be loaded
  static public function request(asset: Asset) {
    loadQueue.push(asset);
  }

  // true if all assets are loaded, otherwise the percent
  static public function loadProgress(): Dynamic {
    var n: Int = 0;
    var i: Int;

    // count all the loaded assets
    for (i in 0...loadQueue.length) {
      if (loadQueue[i].isLoaded()) n++;
    }

    // if all are loaded, true, otherwise the percent loaded [0,1]
    return (n == loadQueue.length) ? true : cast(n, Float) / loadQueue.length;
  }
}
