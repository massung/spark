/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.platform', 'spark.util').defines({
  title: 'Untitled',
  version: 1.0,
  path: '/',
  assetRelativePath: '',
  assets: {},
});

// Load a manifest XML file into an object.
__MODULE__.load = function(src, onload) {
  spark.project.path = src.split('/').slice(0, -1).join('/') + '/';

  // Load the manifest and then issue requests for all the assets inside.
  spark.loadJSON(src, function(json) {

    // Merge the properties into the project. This will override defaults.
    spark.util.merge(spark.project, json);

    // Issue a load request for each asset.
    for(var id in spark.project.assets) {
      var cls = spark.project.assets[id].class;
      var src = spark.project.assets[id].source;

      if (cls === undefined || src === undefined) {
        console.log('Invalid asset "' + id + '"; skipping...');
      } else {
        var ctor = spark.project.assetConstructor(cls);
        var path = spark.project.assetPath(src);

        // Create the asset, which will issue the load request.
        spark.project.assets[id] = new ctor(path);
      }
    };

    // Call the onload callback now.
    if (onload !== undefined) {
      onload();
    }
  });
};

// Return the full path to an asset.
__MODULE__.assetPath = function(src) {
  return spark.project.path + spark.project.assetRelativePath + src;
};

// Find the class for a given asset type.
__MODULE__.assetConstructor = function(path) {
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
