// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import haxe.ds.StringMap;

typedef ProjectInfo = {
  title: String,
  version: Float,
  path: String,
  assetPath: String,

  // list of assets that are a source + optional class ref
  assets: Array<{ src: String, ?ref: String }>,
}

class Project {
  private var title: String;
  private var version: String;
  private var path: String;
  private var assetPath: String;

  // all loaded assets
  private var assets: StringMap<Asset>;

  // the queue of assets waiting to be loaded
  private var loadQueue: Array<Asset>;

  // game objects can only be constructed with the main() function
  public function new(projectFile: String, onload: Project -> Void) {
    this.title = 'Spark Demo';
    this.version = '1.0';
    this.path = projectFile.split('/').slice(0, -1).join('/') + '/';
    this.assetPath = '';

    // create a new asset list and load queue
    this.assets = new StringMap<Asset>();
    this.loadQueue = new Array<Asset>();

    // request the project file and finish initializing once loaded
    Spark.loadXML(projectFile, function(doc: js.html.XMLDocument) {
      var i;

      this.title = doc.querySelector('spark/project@title').nodeValue ?? this.title;

      // overwrite the default project settings
      Util.merge(this.info, json);

      // issue load requests for any assets specified
      for(i in 0...this.info.assets.length) {
        var asset = this.info.assets[i];

        if (asset.ref != null) {
          this.load(asset.src, cast Type.resolveClass(asset.ref));
        } else {
          this.load(asset.src);
        }
      }

      // execute the callback, which may load more assets
      onload(this);
    });
  }

  // create a new asset instance and add it to the load queue
  private function load(src: String, ?classRef: Class<Asset>): Asset {
    if (classRef == null) {
      classRef = Asset.classOfExt(src.split('/').pop().split('.').pop());

      // no class reference given, and not deduced from the filename
      if (classRef == null) {
        trace('Unknown asset type "' + src + '"; skipping...');
        return null;
      }
    }

    // if an asset already exists with that name, don't overwrite it
    if (this.assets.exists(src)) {
      trace('Asset "' + src + '" already loaded; skipping...');
      return null;
    }

    // create an instance of the asset
    var asset: Asset = Type.createInstance(classRef, [this.info.path + this.info.assetPath + src]);

    // save the asset and track the load
    this.assets.set(src, asset);
    this.loadQueue.push(asset);

    return asset;
  }

  // waits until all loading is complete, then call onload
  public function launch(onload: Void -> Void) {
    var n: Int = 0;
    var i: Int;

    // count all the loaded assets
    for (i in 0...this.loadQueue.length) {
      if (this.loadQueue[i].isLoaded()) n++;
    }

    // are all the assets in the load queue done loading?
    if (n == this.loadQueue.length) {
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
        Spark.view.lineTo(x - w + w * 2 * cast(n, Float) / this.loadQueue.length, y);
        Spark.view.stroke();
        Spark.view.restore();

        // continue loading...
        this.launch(onload);
      });
    }
  }

  // load a particle emitter
  public function newEmitter(src: String): spark.graphics.Emitter {
    return cast this.load(src, spark.graphics.Emitter);
  }

  // load a new font
  public function newFont(src: String): spark.graphics.Font {
    return cast this.load(src, spark.graphics.Font);
  }

  // load a new audio sound clip
  public function newSound(src: String): spark.audio.Sound {
    return cast this.load(src, spark.audio.Sound);
  }

  // load a new texture
  public function newTexture(src: String): spark.graphics.Texture {
    return cast this.load(src, spark.graphics.Texture);
  }

  // load a new timeline animation
  public function newTimeline(src: String): spark.anim.Timeline {
    return cast this.load(src, spark.anim.Timeline);
  }

  // lookup a loaded asset by source filename
  public function get(src: String): Asset return this.assets.get(src);
}
