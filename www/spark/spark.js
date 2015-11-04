/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

// Initialize the Spark framework.
(function(window) {

  // Returns the path to the script file being executed.
  window.__defineGetter__('__PATH__', function() {
    var parser = document.createElement('a');
    var sliceIndex = 1;

    // Set the HREF of the anchor, which will parse it.
    parser.href = document.currentScript.src;

    // Remove the platform base path.
    if (window['cordova']) {
      if (cordova.platformId === 'android') {
        sliceIndex = 3;
      } else if (cordova.platformId !== 'browser') {
        throw 'Unsupported platform!';
      }
    }

    // Return the path.
    return parser.pathname.split('/').slice(sliceIndex);
  });

  // The last element in the __PATH__ is the actual filename.
  window.__defineGetter__('__FILE__', function() {
    return __PATH__.pop();
  });

  // Returns the module for the current module.
  window.__defineGetter__('__MODULE__', function() {
    var path = __PATH__;

    // Strip the file and extension off the path to this script.
    var name = path.pop().split('.')[0];
    var root = window;

    // Create all the namespaces leading up to the module.
    path.forEach(function(s) {
      root = root[s] = (root[s] || new Module());
    });

    // If the module doesn't exist, create it.
    return root[name] || (root[name] = new Module());
  });

  // Define a new module.
  function Module() {
    this.path = __FILE__;
    this.loaded = false;
    this.dependencies = [];
  }

  // True when all dependencies for this module have been loaded.
  Module.prototype.import = function() {
    if (this.loaded !== true && this.dependencies.every(function(m) {
      return m();
    })) {
      if (this.init !== undefined) {
        this.init();
      }

      // This module is now loaded.
      return this.loaded = true;
    }

    return false;
  };

  // List the module dependencies that need to be loaded first.
  Module.prototype.requires = function() {
    var sources = Array.prototype.slice.call(arguments);

    // Each dependency is a function that finds the module in question.
    this.dependencies = sources.map(function(src) {
      var path = src.split('.');

      return function() {
        var m = window;

        for(var i = 0;i < path.length;i++) {
          m = m[path[i]];

          if (m === undefined) {
            return false;
          }
        }

        return m.loaded;
      };
    });

    // For each source load the script.
    sources.forEach((function(src) {
      var path = src.split('.').join('/') + '.js';

      // Load the dependency script.
      spark.loadScript(path, (function() {
        spark.importModules();
      }).bind(this));
    }).bind(this));

    return this;
  };

  // Setup the module with properties that are globally accessible.
  Module.prototype.defines = function(props) {
    for(var prop in props) {
      this[prop] = props[prop];
    }

    return this;
  }

  // Primary interface to framework.
  window.spark = new (function() {
    this.loadQueue = [];
    this.registeredAssets = [];
    this.modules = [];

    // Set the true for visualization, entity selection, etc.
    this.DEBUG = false;

    // Loop over all modules and initialize/load those whose dependencies are loaded.
    this.importModules = function() {
      do {
        var moduleImported = false;

        this.modules.forEach(function(module) {
          moduleImported |= module.import();
        });

        // As long as one module imported, try and import more.
      } while(moduleImported);
    };

    // Request a text file using a <script> tag and then call onload
    this.loadScript = function(src, onload) {
      var script = document.createElement('script');

      script.setAttribute('type', 'application/javascript');
      script.setAttribute('src', src);

      // Be notified when the resource is done loading.
      script.onload = (function() {
        if (onload !== undefined) {
          onload.call(script.text);
        }

        // The resource is now considered loaded.
        this.register(script);
      }).bind(this);

      // Queue this element.
      this.loadQueue.push(script);

      // Add it to the document so it begins loading.
      document.head.appendChild(script);
    };

    // Request a text file using XHR.
    this.loadText = function(src, onload) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = (function() {
        if (req.readyState === 4) {
          if (req.status === 200) {
            onload(req.responseText);
          }

          // The source is loaded.
          this.register(req);
        }
      }).bind(this);

      // Add this source to the load queue.
      this.loadQueue.push(req);

      // Perform the request.
      req.open('GET', src, true);
      req.send();
    };

    // Load a file as JSON.
    this.loadJSON = function(src, onload) {
      this.loadText(src, function(text) {
        var json;

        try {
          json = JSON.parse(text);
        }

        // JSON errors can be difficult to differentiate.
        catch(e) {
          throw 'Syntax error parsing JSON (' + src + '): "' + e + '"';
        }

        // Callback with parsed JSON object.
        onload(json);
      });
    };

    // Define a new module.
    this.module = function() {
      var module = __MODULE__;

      // Track the module so it can be imported when dependencies are met.
      this.modules.push(module);

      return module;
    };

    // Called once to initialize.
    this.main = function(canvasId, width, height) {
      this.canvas = document.getElementById(canvasId);

      // Resize the canvas.
      if (this.canvas !== undefined) {
        this.canvas.width = width || spark.platform.width || this.canvas.width;
        this.canvas.height = height || spark.platform.height || this.canvas.height;

        // Hide the mouse over the canvas by default.
        this.canvas.style.cursor = 'none';

        // Disable the context menu.
        spark.canvas.oncontextmenu = function(event) {
          event.preventDefault();
        };

        // Get the render context of the canvas.
        this.view = this.canvas.getContext('2d');
      }
    };

    // Add an asset to the load queue.
    this.request = function(element, src) {
      this.loadQueue.push(element);

      // Start loading it. Redundant when called from loadScript().
      element.src = src;
    };

    // Register an asset as having been loaded successfully.
    this.register = function(element) {
      this.registeredAssets.push(element);
    };

    // Return the current load status.
    this.loadProgress = function() {
      if (this.registeredAssets.length === this.loadQueue.length) {
        this.registeredAssets = []
        this.loadQueue = [];

        // Done loading assets.
        return true;
      }

      // Percentage of assets in the queue that are loaded.
      return this.registeredAssets.length / this.loadQueue.length;
    };
  })();
})(window);
