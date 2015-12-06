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

    // initialize debugging
    spark.Debug.init();

    // install input device handlers
    spark.Key.install();
    spark.Mouse.install();
    spark.Joystick.install();

    // hide the mouse within the canvas
    spark.Mouse.hide();

    // disable the context menu
    canvas.oncontextmenu = function(event) {
      event.preventDefault();
    };
  }

  // issue an XHR request
  static public function loadXHR(src: String, respType: js.html.XMLHttpRequestResponseType, onload: js.html.XMLHttpRequest -> Void) {
    var req = new js.html.XMLHttpRequest();

    // when the request is complete, resolve
    req.onloadend = function() {
      if (req.status >= 200 && req.status <= 299) {
        onload(req);
      }
    }

    // set the response type desired
    req.responseType = respType;

    // load the file
    req.open('GET', src, true);
    req.send();
  }

  // issue an XHR request for an XML document
  static public function loadXML(src: String, onload: Xml -> Void) {
    loadXHR(src, js.html.XMLHttpRequestResponseType.TEXT, function(req) {
      var doc = Xml.parse(req.response);

      if (doc == null) {
        throw 'Illegal XML document: ' + src;
      }

      onload(doc);
    });
  }

  // issue an XHR request for a JSON document
  static public function loadJSON(src: String, onload: Dynamic -> Void) {
    loadXHR(src, js.html.XMLHttpRequestResponseType.JSON, function(req) {
      onload(req.response);
    });
  }
}
