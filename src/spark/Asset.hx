// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

class Asset {
  private var source: String;
  private var loaded: Bool;

  // create a new asset request
  public function new(src: String) {
    this.source = src;
    this.loaded = false;
  }

  // true once the loaded flag has been set
  public function isLoaded(): Bool {
    return this.loaded;
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
