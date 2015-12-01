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
  static public function loadXML(src: String, onload: js.html.Document -> Void) {
    loadXHR(src, js.html.XMLHttpRequestResponseType.DOCUMENT, function(req) {
      onload(req.response);
    });
  }

  // issue an XHR request for a JSON document
  static public function loadJSON(src: String, onload: Dynamic -> Void) {
    loadXHR(src, js.html.XMLHttpRequestResponseType.JSON, function(req) {
      onload(req.response);
    });
  }

  // return an asset class reference from a filename using its extension
  static public function classOfFile(src: String): Class<Asset> {
    var ext = src.split('/').pop().split('.').pop().toLowerCase();

    switch(ext) {

      // sounds
      case 'aiff': return spark.audio.Sound;
      case 'au':   return spark.audio.Sound;
      case 'mid':  return spark.audio.Sound;
      case 'midi': return spark.audio.Sound;
      case 'mp3':  return spark.audio.Sound;
      case 'ogg':  return spark.audio.Sound;
      case 'snd':  return spark.audio.Sound;
      case 'wav':  return spark.audio.Sound;
      case 'wave': return spark.audio.Sound;

      // textures
      case 'bmp':  return spark.graphics.Texture;
      case 'exif': return spark.graphics.Texture;
      case 'gif':  return spark.graphics.Texture;
      case 'ico':  return spark.graphics.Texture;
      case 'jpeg': return spark.graphics.Texture;
      case 'jpg':  return spark.graphics.Texture;
      case 'png':  return spark.graphics.Texture;
      case 'tga':  return spark.graphics.Texture;
      case 'tif':  return spark.graphics.Texture;
      case 'tiff': return spark.graphics.Texture;

      // fonts
      case 'fnt':  return spark.graphics.Font;
      case 'otf':  return spark.graphics.Font;
      case 'ttf':  return spark.graphics.Font;
    }

    return null;
  }
}
