// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import spark.math.*;

@:expose
class Texture extends Asset {
  private var img: js.html.Image;

  // load a new texture image
  public function new(src: String) {
    super(src);

    // allocate the image to load
    this.img = new js.html.Image();

    // resolve the request when done
    img.onload = function() {
      this.loaded = true;
    }

    // start load
    this.img.src = src;
  }

  // the width of the texture in pixels
  public function getWidth(): Float {
    return this.loaded ? this.img.width : 0;
  }

  // the height of the texture in pixels
  public function getHeight(): Float {
    return this.loaded ? this.img.height : 0;
  }

  // blit the entire texture to the view
  public function draw(?pivot: Vec) {
    if (this.loaded) {
      var w = this.img.width;
      var h = this.img.height;

      // calculate the offset
      var x = pivot == null ? 0 : -w * pivot.x;
      var y = pivot == null ? 0 : -h * pivot.y;

      // blit the image
      Spark.view.drawImage(this.img, 0, 0, w, h, x, y, w, h);
    }
  }

  // blit a portion of the texture to the view
  public function drawq(quad: Rect, ?pivot: Vec) {
    if (this.loaded) {
      var w = quad.getWidth();
      var h = quad.getHeight();

      // calculate the offset
      var x = pivot == null ? 0 : -w * pivot.x;
      var y = pivot == null ? 0 : -h * pivot.y;

      // blit a portion of the image
      Spark.view.drawImage(this.img, quad.getLeft(), quad.getTop(), w, h, x, y, w, h);
    }
  }
}
