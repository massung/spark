// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

class Font extends Asset {
  private var style: js.html.StyleElement;

  // request that a font be loaded
  public function new(src: String) {
    super(src);

    // use the filename as a face name
    var family = src.split('/').slice(-1)[0].split('.')[0];
    var face = '@font-face{ font-family: "' + family + '"; src: url("' + src + '"); }';

    // add the style to the document
    this.style = js.Browser.document.createStyleElement();
    this.style.appendChild(js.Browser.document.createTextNode(face));

    // the font will actually load on first use
    js.Browser.document.head.appendChild(this.style);

    // mark the asset as loaded
    this.loaded = true;
  }
}
