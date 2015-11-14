/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

// Initialize the Spark framework.
(function(window) {

  // Define a new module.
  function Module() {
    this.loaded = false;
    this.dependencies = [];
  }

  // True when all dependencies for this module have been loaded.
  Module.prototype.import = function() {
    if (this.loaded === true) {
      return false;
    }

    // Are all the dependencies met?
    if (this.loaded = this.dependencies.every(spark.moduleLoaded.bind(spark))) {
      if (this.init !== undefined) {
        this.init();
      }
    }

    return this.loaded;
  };

  // List of module dependencies that need to be imported.
  Module.prototype.requires = function() {
    var sources = Array.prototype.slice.call(arguments);

    // Each dependency is a function that finds the module in question.
    this.dependencies = sources.map(function(src) {
      var link = document.createElement('a');

      // Create a link that will expand to the full HREF location.
      link.href = src.split('.').join('/') + '.js';

      // Return the parsed (and expanded) href.
      return link.href;
    });

    // For each source load the script.
    this.dependencies.forEach((function(href) {
      spark.loadScript(href, spark.importModules.bind(spark));
    }).bind(this));

    return this;
  };

  // Returns 'this' module.
  window.__defineGetter__('__MODULE__', function() {
    return spark.modules[document.currentScript.src];
  });

  // Primary interface to framework.
  window.spark = new (function() {
    this.modules = {};
    this.loadedScripts = [];

    // Track requested and resolved assets.
    this.loadQueue = {
      requests: [],
      resources: [],
    };

    // Loop over all modules and initialize/load those whose dependencies are loaded.
    this.importModules = function() {
      do {
        var moduleImported = false;

        // Try and import each module.
        for(var mod in this.modules) {
          moduleImported |= this.modules[mod].import();
        }

        // As long as one module imported, try and import more.
      } while(moduleImported);
    };

    // True if a source is being - or has been - loaded.
    this.scriptLoaded = function(src) {
      return this.loadedScripts.some(function(script) {
        return script.src === src;
      });
    };

    // Request a text file using a <script> tag and then call onload
    this.loadScript = function(src, onload) {
      if (this.scriptLoaded(src)) {
        return;
      }

      var script = document.createElement('script');

      // Set this to be javascript so it evaluates.
      script.setAttribute('type', 'application/javascript');
      script.setAttribute('src', src);

      // Be notified when the resource is done loading.
      script.onload = (function() {
        if (onload !== undefined) {
          onload.call(script.text);
        }
      }).bind(this);

      // Track the script so it doesn't get reloaded.
      this.loadedScripts.push(script);

      // Add it to the document so it begins loading.
      document.head.appendChild(script);
    };

    // Make an XHR request.
    this.loadXHR = function(src, resType, onload) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = (function() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status <= 299) {
            if (onload !== undefined) {
              onload(req);
            }

            // Resolve the request.
            this.resolve(req);
          }
        }
      }).bind(this);

      // Add this source to the load queue.
      this.request(req);

      // Set the mime and response types.
      req.responseType = resType;

      // Perform the request.
      req.open('GET', src, true);
      req.send();
    };

    // Request a text file using XHR.
    this.loadText = function(src, onload) {
      this.loadXHR(src, 'text', onload);
    };

    // Load a file as an XML document.
    this.loadXML = function(src, onload) {
      this.loadXHR(src, 'document', function(req) {
        onload(req.responseXML);
      });
    };

    // Load a file as JSON.
    this.loadJSON = function(src, onload) {
      this.loadXHR(src, 'json', function(req) {
        onload(req.response);
      });
    };

    // Define a new module.
    this.module = function() {
      var a = document.createElement('a');
      var sliceIndex = 1;

      // Use the anchor to parse the source path.
      a.href = document.currentScript.src;

      // Remove the base path from the platform.
      if (window['cordova']) {
        if (cordova.platformId === 'android') {
          sliceIndex = 3;
        } else if (cordova.platformId !== 'browser') {
          throw 'Unsupported platform!';
        }
      }

      // Get the path the module name.
      var path = a.pathname.split('/').slice(sliceIndex);
      var file = path.pop().split('.')[0];

      // Start at the root and create the module hierarchy.
      var root = window;

      // Create all the namespaces leading up to the module.
      path.forEach(function(s) {
        root = root[s] = (root[s] || new Module());
      });

      // Create the new module and track it.
      return root[file] = this.modules[document.currentScript.src] = new Module();
    };

    // True once a module has been loaded.
    this.moduleLoaded = function(m) {
      return this.modules[m] !== undefined && this.modules[m].loaded;
    };

    // Called once to initialize.
    this.main = function(canvasId, width, height) {
      this.canvas = document.getElementById(canvasId);

      // Resize the canvas.
      if (this.canvas !== undefined) {
        this.canvas.width = width || (spark.mobile ? spark.screenWidth : this.canvas.width);
        this.canvas.height = height || (spark.mobile ? spark.screenHeight : this.canvas.height);

        // Hide the mouse over the canvas by default.
        this.canvas.style.cursor = 'none';

        // Disable the context menu.
        spark.canvas.oncontextmenu = function(event) {
          event.preventDefault();
        };

        // Get the render context of the canvas.
        this.view = this.canvas.getContext('2d');
      }

      // Return a new module and start loading the framework.
      return this.module().requires('spark.game');
    };

    // Add an asset to the load queue.
    this.request = function(req, src) {
      this.loadQueue.requests.push(req);

      // Sometimes the asset needs a source path set to begin the request.
      if (src !== undefined) {
        req.src = src;
      }
    };

    // Register an asset as having been loaded successfully.
    this.resolve = function(req) {
      if (this.loadQueue.requests.indexOf(req) >= 0) {
        this.loadQueue.resources.push(req);
      }
    };

    // Return the current load status.
    this.loadProgress = function() {
      if (this.loadQueue.resources.length === this.loadQueue.requests.length) {
        return true;
      }

      // Percentage of assets in the queue that are loaded.
      return this.loadQueue.resources.length / this.loadQueue.requests.length;
    };
  })();
})(window);
