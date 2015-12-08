// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object.layer;

import spark.collision.*;
import spark.graphics.*;

class BackgroundLayer extends Layer {
  private var frame: Quad;
  private var tiled: Bool;

  // create a new background layer
  public function new(frame: Quad, ?tiled: Bool = true) {
    super();

    // initialize
    this.frame = frame;
    this.tiled = tiled;
  }

  // run behaviors
  public override function update(step: Float) {
    super.update(step);

    // when tiled, wrap the position offset
    if (this.tiled && this.frame != null) {
      this.m.p.x %= this.frame.getRect().getWidth() * this.m.s.x;
      this.m.p.y %= this.frame.getRect().getHeight() * this.m.s.y;
    }
  }

  // render the background as a single image or tiles
  public override function draw() {
    if (this.frame == null) {
      return;
    }

    Spark.view.save();

    // apply the layer's transform
    this.m.apply();

    // cache the image size
    var iw = this.frame.getRect().getWidth();
    var ih = this.frame.getRect().getHeight();

    // render once or tiled?
    if (this.tiled == false) {
      this.frame.draw();
    } else {
      var l = Game.getScene().rect.getLeft();
      var t = Game.getScene().rect.getTop();
      var w = Game.getScene().rect.getWidth();
      var h = Game.getScene().rect.getHeight();

      // loop until the entire scene is covered
      var x = -iw;
      while(x < w) {
        var y = -ih;

        while(y < h) {
          Spark.view.save();
          {
            Spark.view.translate(l + x, t + y);

            // render the quad
            this.frame.draw();
          }
          Spark.view.restore();

          y += ih - 1;
        }

        x += iw - 1;
      }
    }

    // done
    Spark.view.restore();
  }
}
