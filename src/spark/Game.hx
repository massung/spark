// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import haxe.ds.StringMap;

typedef GameCallback = Game -> Void;
typedef LoadCallback = Void -> Void;

typedef Project = {
  path: String,
  assetPath: String,
  title: String,
  version: Float,
}

@:expose
class Game {
  private var project: Project;
  private var loadQueue: Array<Asset>;

  // game objects can only be constructed with the main() function
  private function new(projectFile: String, init: GameCallback) {
    this.loadQueue = new Array<Asset>();

    // request the project file
    Spark.loadJSON(projectFile, function(json: Dynamic) {
      this.project = json;

      // use the path the project is located in if none set
      if (this.project.path == null) {
        this.project.path = projectFile.split('/').slice(0, -1).join('/') + '/';
      }

      // set project defaults
      if (this.project.assetPath == null) this.project.assetPath = '/';
      if (this.project.title == null) this.project.title = 'Spark Game';
      if (this.project.version == null) this.project.version = 1.0;

      // execute the callback, which may load more assets
      init(this);
    });
  }

  // load a project and run with a new game instance
  static public function main(projectFile: String, init: GameCallback): Game {
    return new Game(projectFile, init);
  }

  // waits until all loading is complete
  public function launch(onload: LoadCallback) {
    var n: Int = 0;
    var i: Int;

    // count all the loaded assets
    for (i in 0...loadQueue.length) {
      if (loadQueue[i].isLoaded()) n++;
    }

    // are all the assets in the load queue done loading?
    if (n == loadQueue.length) {
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
        Spark.view.lineTo(x - w + w * 2 * cast(n, Float) / loadQueue.length, y);
        Spark.view.stroke();
        Spark.view.restore();

        // continue loading...
        this.launch(onload);
      });
    }
  }

  // create a new asset instance and add it to the load queue
  private function load(classRef: Class<Asset>, src: String): Asset {
    var asset: Asset = Type.createInstance(classRef, [this.project.path + this.project.assetPath + src]);

    // track this asset being loaded
    this.loadQueue.push(asset);

    return asset;
  }

  // load a new font
  public function newFont(src: String): spark.graphics.Font {
    return cast this.load(spark.graphics.Font, src);
  }

  // load a new audio sound clip
  public function newSound(src: String): spark.audio.Sound {
    return cast this.load(spark.audio.Sound, src);
  }

  // load a new texture
  public function newTexture(src: String): spark.graphics.Texture {
    return cast this.load(spark.graphics.Texture, src);
  }

  // load a new timeline animation
  public function newTimeline(src: String): spark.anim.Timeline {
    return cast this.load(spark.anim.Timeline, src);
  }
}
