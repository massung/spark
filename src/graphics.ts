// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // rendering nickname for a rectangle
  export type Quad = Rect;

  // texture asset
  export class Texture extends Asset {

    // load a new texture image from the server
    constructor(src: string) {
      super(src);

      // instantiate a new image to download
      var img = new Image();

      // when done loading, set the object
      img.onload = (function() {
        this.data = img;
      }).bind(this);

      // start the load
      img.src = src;
    }

    // the width of the texture in pixels
    get width(): number {
      return this.data ? this.data.width : 0;
    }

    // the hieght of the texture in pixels
    get height(): number {
      return this.data ? this.data.height : 0;
    }

    // blit the entire texture to the view
    draw(pivot?: Vec) {
      if (this.data) {
        var w = this.data.width;
        var h = this.data.height;
        var x = pivot ? -w * pivot.x : 0;
        var y = pivot ? -h * pivot.y : 0;

        // blit the image
        view.drawImage(this.data, 0, 0, w, h, x, y, w, h);
      }
    }

    // blit a portion of the texture to the view
    drawq(quad: Quad, pivot?: Vec) {
      if (this.data) {
        var w = quad.width;
        var h = quad.height;
        var x = pivot ? -w * pivot.x : 0;
        var y = pivot ? -h * pivot.y : 0;

        // blit a portion of the image
        view.drawImage(this.data, quad.left, quad.top, w, h, x, y, w, h)
      }
    }
  }

  // load an asset using css
  export class Font extends Asset {
    constructor(src: string) {
      super(src);

      // use the filename as the face name
      var family = src.split('/').slice(-1)[0].split('.')[0];
      var face = `@font-face{ font-family: "` + family + `"; src: url("` + src + `"); }`;

      // resolve the asset immediately, because it won't load until first use
      this.data = document.createElement('style');
      this.data.appendChild(document.createTextNode(face));

      // add it to the document
      document.head.appendChild(this.data);
    }
  }
}
