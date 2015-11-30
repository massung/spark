// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

class Asset {
  var source: String;
  var loaded: Bool;

  public function new(src: String) {
    this.source = src;
    this.loaded = false;

    // add this asset to the load queue
    Spark.request(this);
  }

  // true once the loaded flag has been set
  public function isLoaded(): Bool {
    return this.loaded;
  }
}

// an asset that is loaded with an XMLHttpRequest
class XHRAsset extends Asset {
  var req: js.html.XMLHttpRequest;

  // issue the request for the asset
  public function new(src: String, respType: String, onload: js.html.XMLHttpRequest -> Void) {
    super(src);

    // create the request
    req = new js.html.XMLHttpRequest();

    // when the request is complete, resolve
    req.onloadend = function() {
      if (req.status >= 200 && req.status <= 299) {
        onload(req);
      }

      // the load is complete
      this.loaded = true;
    }
  }
}

// an asset that is an XML document
class XMLAsset extends XHRAsset {
  var doc: js.html.Document;

  // issue the request for the asset
  public function new(src: String, onload: js.html.Document -> Void) {
    super(src, 'document', function(req) {
      onload(this.doc = req.response);
    });
  }
}

// an asset that is an JSON document
class JSONAsset extends XHRAsset {
  var json: Dynamic;

  // issue the request for the asset
  public function new(src: String, onload: js.html.Document -> Void) {
    super(src, 'json', function(req) {
      onload(this.json = req.response);
    });
  }
}
