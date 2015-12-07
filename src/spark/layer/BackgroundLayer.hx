// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.layer;

import spark.collision.*;
import spark.graphics.*;

class BackgroundLayer implements Layer {
  private var frame: Quad;
  private var tiled: Bool;

  // scrolling offset
  public var x: Float;
  public var y: Float;

  // create a new background layer
  public function new(frame: Quad, ?tiled: Bool = true) {
    this.frame = frame;
    this.tiled = tiled;
  }

  // scroll the background
  public function scroll(dx: Float, dy: Float) {
    x += dx;
    y += dy;
  }

  // run behaviors
  public function update(step: Float) {
    if (this.tiled && this.frame != null) {
      this.x %= this.frame.getRect().getWidth();
      this.y %= this.frame.getRect().getHeight();
    }
  }

  // background layers have no collision data
  public function updateCollision(space: Quadtree) { }

  // render the background as a single image or tiles
  public function draw() {
    if (this.frame == null) {
      return;
    }

    Spark.view.save();

    // apply the layer's transform
    Spark.view.translate(this.x, this.y);

    // cache the image size
    var iw = this.frame.getRect().getWidth();
    var ih = this.frame.getRect().getHeight();

    // render once or tiled?
    if (this.tiled == false) {
      this.frame.draw();
    } else {
      var l = Game.scene.rect.getLeft();
      var t = Game.scene.rect.getTop();
      var w = Game.scene.rect.getWidth();
      var h = Game.scene.rect.getHeight();

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

  // update debug statistics
  public function debugStats(stats: Debug.Stats) {
    stats.layers++;
  }
}
