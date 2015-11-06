/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.platform', 'spark.texture', 'spark.audio');

// Load a manifest XML file into an object.
__MODULE__.load = function(src, onload) {
  var project = {
    title: 'Untitled',
    version: 1.0,
    assetRelativePath: '',
    assets: {},
  };

  // Set the asset path to the same path as the project file.
  project.assetPath = src.split('/').slice(0, -1).join('/') + '/';

  // Load the manifest and then issue requests for all the assets inside.
  spark.loadJSON(src, function(json) {

    // Merge the properties into the project. This will override defaults.
    for(var prop in json) {
      project[prop] = json[prop];
    }

    // Issue a load request for each asset.
    for(var id in project.assets) {
      var cls = project.assets[id].class;
      var src = project.assets[id].source;

      if (cls === undefined || src === undefined) {
        console.log('Invalid asset "' + id + '"; skipping...');
      } else {
        var ctor = spark.project.assetConstructor(cls);

        // Create the asset, which will issue the load request.
        project.assets[id] = new ctor(project.assetPath + project.assetRelativePath + src);
      }
    };

    // Call the onload callback now.
    if (onload !== undefined) {
      onload(project);
    }
  });

  // Return the object that will hold all the assets in it.
  return project;
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
