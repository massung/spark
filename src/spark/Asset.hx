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
  public function new(src: String, respType: js.html.XMLHttpRequestResponseType, onload: js.html.XMLHttpRequest -> Void) {
    super(src);

    // create the request
    req = new js.html.XMLHttpRequest();

    // when the request is complete, resolve
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        if (req.status >= 200 && req.status <= 299) {
          onload(req);
        }

        // the load is complete
        this.loaded = true;
      }
    }

    req.responseType = respType;

    req.open('GET', src, true);
    req.send();
  }
}

// an asset that is an XML document
class XMLAsset extends XHRAsset {
  var doc: js.html.Document;

  // issue the request for the asset
  public function new(src: String, onload: js.html.Document -> Void) {
    super(src, js.html.XMLHttpRequestResponseType.DOCUMENT, function(req) {
      onload(this.doc = req.response);
    });
  }
}

// an asset that is an JSON document
class JSONAsset extends XHRAsset {
  var json: Dynamic;

  // issue the request for the asset
  public function new(src: String, onload: Dynamic -> Void) {
    super(src, js.html.XMLHttpRequestResponseType.JSON, function(req) {
      onload(this.json = req.response);
    });
  }

  // merge the loaded JSON document into a field
  public function mergeInto(obj: String) {
    var k: String;

    // merge the document with the fields in this object
    for(k in Reflect.fields(this.json)) {
      if (Reflect.hasField(obj, k)) {
        Reflect.setProperty(obj, k, Reflect.field(this.json, k));
      }
    }
  }
}
