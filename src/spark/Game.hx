// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.anim.*;
import spark.graphics.*;

typedef GameCallback = Game -> Void;
typedef LoadCallback = Void -> Void;

typedef Project = {
  path: String,
  assetPath: String,
  title: String,
  version: Float,
}

@:expose
class Game extends Asset.JSONAsset {
  private var project: Project;

  // game objects can only be constructed with the main() function
  private function new(projectFile: String, init: GameCallback) {
    super(projectFile, function(json: Dynamic) {
      this.project = json;

      // use the path the project is located in if none set
      if (this.project.path == null) {
        this.project.path = projectFile.split('/').slice(0, -1).join('/') + '/';
      }

      // set defaults
      if (this.project.assetPath == null) this.project.assetPath = '/';
      if (this.project.title == null) this.project.title = 'Spark Game';
      if (this.project.version == null) this.project.version = 1.0;

      // execute the callback, which may load more assets
      init(this);

      // project file is now loaded
      this.loaded = true;
    });
  }

  // load a project and run with a new game instance
  static public function main(projectFile: String, init: GameCallback): Game {
    return new Game(projectFile, init);
  }

  // waits until all loading is complete
  public function launch(onload: LoadCallback) {
    if (Spark.loadProgress() == true) {
      onload();
    } else {
      js.Browser.window.requestAnimationFrame(function(now: Float) {
        var x = Spark.canvas.width / 2;
        var y = Spark.canvas.height / 2;

        // max width of the progress bar i 60% of the width
        var w = x * 3 / 5;

        // erase the display
        Spark.view.save();
        Spark.view.setTransform(1, 0, 0, 1, 0, 0);
        Spark.view.clearRect(0, 0, Spark.canvas.width, Spark.canvas.height);

        // display a loading bar
        Spark.view.strokeStyle = '#fff';
        Spark.view.shadowBlur = 10;
        Spark.view.shadowOffsetX = 0;
        Spark.view.shadowOffsetY = 0;
        Spark.view.shadowColor = '#fff';
        Spark.view.font = 'bold 10px "Courier", sans-serif';
        Spark.view.fillStyle = '#fff';
        Spark.view.fillText('Loading...', 10, Spark.canvas.height - 10);

        // Render the progress as a simple load bar.
        Spark.view.beginPath();
        Spark.view.moveTo(x - w, y);
        Spark.view.lineTo(x - w + w * 2 * Spark.loadProgress(), y);
        Spark.view.stroke();
        Spark.view.restore();

        // continue loading...
        this.launch(onload);
      });
    }
  }

  // return the full server path to an asset
  public function asset(src: String): String {
    return this.project.path + this.project.assetPath + src;
  }

  // load a new texture
  public function newTexture(src: String): Texture {
    return new Texture(this.asset(src));
  }

  // load a new audio clip
  public function newAudio(src: String): Audio {
    return new Audio(this.asset(src));
  }

  // load a new timeline animation
  public function newTimeline(src: String): Timeline {
    return new Timeline(this.asset(src));
  }
}
