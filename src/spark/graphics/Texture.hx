// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

class Texture extends Asset implements Quad {
  private var img: js.html.Image;

  // dimensions of the image as a rectangle
  private var r: Rect;

  // load a new texture image
  public function new(src: String) {
    super(src);

    // allocate the image to load
    this.img = new js.html.Image();

    // resolve the request when done
    img.onload = function() {
      this.r = new Rect(0, 0, this.img.width, this.img.height);

      // asset ready
      this.loaded = true;
    }

    // start load
    this.img.src = src;
  }

  // the width of the texture in pixels
  public function getRect(): Rect return this.r;

  // blit the entire texture to the view
  public function draw() {
    Spark.view.drawImage(this.img, -this.img.width * 0.5, -this.img.height * 0.5);
  }

  // blit a portion of the texture to the view
  public function drawq(r: Rect, p: Vec) {
    var w = r.getWidth();
    var h = r.getHeight();

    // offset from the origin
    var x = -w * p.x;
    var y = -h * p.y;

    // blit a portion of the image
    Spark.view.drawImage(this.img, r.getLeft(), r.getTop(), w, h, x, y, w, h);
  }
}
