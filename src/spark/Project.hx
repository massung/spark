// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import haxe.ds.StringMap;

typedef ProjectInfo = {
  title: String,
  version: String,
  path: String
}

class Project {
  private var info: ProjectInfo;
  private var assets: StringMap<Asset>;

  // the queue of assets waiting to be loaded
  private var loadQueue: Array<Asset>;

  // game objects can only be constructed with the main() function
  public function new(projectFile: String, onload: Project -> Void) {
    var root = projectFile.split('/').slice(0, -1).join('/') + '/';

    // create the asset mapping and load queue
    this.assets = new StringMap<Asset>();
    this.loadQueue = new Array<Asset>();

    // default project info
    this.info = {
      title: 'Untitled',
      version: '1.0',
      path: root,
    };

    // request the project file and finish initializing once loaded
    Spark.loadXML(projectFile, function(doc: Xml) {
      var assets, asset, project = doc.firstElement();

      if (project == null || project.nodeName != 'project') {
        throw 'Invalid Spark project file: ' + projectFile;
      }

      // see if any project settings are overridden
      Util.mergeXml(this.info, project);

      // find all the asset groups
      for(assets in project.elementsNamed('assets')) {
        var assetPath = assets.get('path');

        // load all the assets in the group
        for(asset in assets.elementsNamed('asset')) {
          var src = asset.get('src');
          var id = asset.get('id');
          var ref = asset.get('class');

          // default the unique id to the source filename
          if (id == null) id = src;

          if (src != null) {
            var path = this.info.path + assetPath + src;

            if (ref != null) {
              this.load(id, path, cast Type.resolveClass(ref));
            } else {
              this.load(id, path);
            }
          }
        }
      }

      // execute the callback, which may load more assets
      onload(this);
    });
  }

  // create a new asset instance and add it to the load queue
  private function load(id: String, src: String, ?classRef: Class<Asset>): Asset {
    if (classRef == null) {
      classRef = Asset.classOfExt(src.split('/').pop().split('.').pop());

      // no class reference given, and not deduced from the filename
      if (classRef == null) {
        trace('Unknown asset type "' + src + '"; skipping...');
        return null;
      }
    }

    // if an asset already exists with that name, don't overwrite it
    if (this.assets.exists(id)) {
      trace('Asset "' + id + '" already loaded; skipping...');
      return null;
    }

    // create an instance of the asset
    var asset: Asset = Type.createInstance(classRef, [src]);

    // save the asset and track the load
    this.assets.set(id, asset);
    this.loadQueue.push(asset);

    return asset;
  }

  // lookup a loaded asset by id
  public function get(id: String): Asset return this.assets.get(id);

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
}
