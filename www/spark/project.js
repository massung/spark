/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.platform', 'spark.util');

// Asset management object.
spark.Project = function() {
  this.title = 'Untitled';
  this.version = 1.0;
  this.path = '/';
  this.assetRelativePath = '';
  this.assets = {};
};

// Set constructor.
spark.Project.prototype.constructor = spark.Project;

// Load a manifest XML file into an object.
spark.Project.prototype.load = function(src, onload) {
  this.path = src.split('/').slice(0, -1).join('/') + '/';

  // Load the manifest and then issue requests for all the assets inside.
  spark.loadJSON(src, (function(json) {

    // Merge the properties into this.
    spark.merge(this, json);

    // Issue a load request for each asset.
    for(var id in this.assets) {
      var cls = this.assets[id].class;
      var src = this.assets[id].source;

      if (cls === undefined || src === undefined) {
        console.log('Invalid asset "' + id + '"; skipping...');
      } else {
        var ctor = this.assetConstructor(cls);
        var path = this.assetPath(src);

        // Create the asset, which will issue the load request.
        this.assets[id] = new ctor(path);
      }
    };

    // Call the onload callback now.
    if (onload !== undefined) {
      onload();
    }
  }).bind(this));
};

// Return the full path to an asset.
spark.Project.prototype.assetPath = function(src) {
  return this.path + this.assetRelativePath + src;
};

// Find the class for a given asset type.
spark.Project.prototype.assetConstructor = function(path) {
  var ctor = window;

  // Traverse the class name from the window to find it.
  path.split('.').forEach(function(name) {
    if ((ctor = ctor[name]) === undefined) {
      throw 'Unknown asset class "' + path + '"';
    }
  });

  // Make sure we're at a constructor function.
  if (typeof(ctor.constructor) !== 'function') {
    throw 'Not an asset constructor "' + path + '"';
  }

  return ctor;
};
