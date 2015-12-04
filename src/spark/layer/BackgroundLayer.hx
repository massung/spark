// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.layer;

import spark.collision.*;
import spark.graphics.*;
import spark.object.*;

class BackgroundLayer extends Actor implements Layer {
  public var z: Float;

  // the texture to render
  private var texture: Texture;

  // if not tiled, the image just renders once
  private var tiled: Bool;

  // create a new background layer
  public function new(texture: Texture, ?tiled: Bool = true) {
    super();

    // default z-ordering
    this.z = 0.0;

    // setup
    this.texture = texture;
    this.tiled = tiled;
  }

  // run behaviors
  override public function update(step: Float) {
    super.update(step);

    // if tiled, wrap the background
    if (this.tiled && this.texture != null) {
      this.m.p.x %= this.texture.getWidth() * this.m.s.x;
      this.m.p.y %= this.texture.getHeight() * this.m.s.y;
    }
  }

  // background layers have no collision
  public function updateCollision(space: Quadtree) { }

  // render the
  public function draw() {
    if (this.texture == null) {
      return;
    }

    Spark.view.save();

    // apply the layer's transform
    this.m.apply();

    // cache the image size
    var iw = this.texture.getWidth();
    var ih = this.texture.getHeight();

    // render once or tiled?
    if (this.tiled == false) {
      this.texture.draw();
    } else {
      var l = Game.scene.rect.getLeft();
      var b = Game.scene.rect.getBottom();
      var w = Game.scene.rect.getWidth();
      var h = Game.scene.rect.getHeight();

      // loop until the entire scene is covered
      var x = -iw;
      while(x < w) {
        var y = -ih;

        while(y < h) {
          Spark.view.save();
          {
            Spark.view.translate(l + x, b + y);

            this.texture.draw();
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

  // for debugging, accumulate stats
  public function debugStats(stats: Debug.Stats) {
    stats.layers++;
  }
}
