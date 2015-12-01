// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

import js.Lib;
import js.Browser;

import spark.*;

class Spark {

  // the global audio context used to play sound sources
  static public var audio: js.html.audio.AudioContext;

  // the global canvas element being drawn to
  static public var canvas: js.html.CanvasElement;

  // the global render context
  static public var view: js.html.CanvasRenderingContext2D;

  // entry point of the spark library
  static function main() {
    canvas = cast js.Browser.document.getElementById('spark');

    // retrieve the render context from the canvas
    view = canvas.getContext2d();

    // initialize audio
    audio = new js.html.audio.AudioContext();

    // initialize input devices
    spark.Input.init();
    spark.Input.hideCursor();

    // enable all input devices
    spark.Input.enableMouse();
    spark.Input.enableKeyboard();

    // disable the context menu
    canvas.oncontextmenu = function(event) {
      event.preventDefault();
    };
  }
}
