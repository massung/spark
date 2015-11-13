/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

// Initialize the Spark framework.
(function(window) {

  // Define a new module.
  function Module() {
    this.src = document.currentScript.src;
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
    this.loadQueue = [];
    this.registeredAssets = [];
    this.modules = {};

    // Track all the scripts so they don't get reloaded.
    this.scripts = {};

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

    // Request a text file using a <script> tag and then call onload
    this.loadScript = function(src, onload) {
      if (this.scripts[src] !== undefined) {
        return;
      }

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

      // Add this script to the set of loading/loaded scripts.
      this.scripts[src] = script;

      // Add it to the document so it begins loading.
      document.head.appendChild(script);
    };

    // Request a text file using XHR.
    this.loadText = function(src, onload) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = (function() {
        if (req.readyState === 4 && req.status === 200) {
          onload(req.responseText);
          this.register(req);
        }
      }).bind(this);

      // Add this source to the load queue.
      this.loadQueue.push(req);

      // Perform the request.
      req.open('GET', src, true);
      req.send();
    };

    // Load a file as an XML document.
    this.loadXML = function(src, onload) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = (function() {
        if (req.readyState === 4 && req.status === 200) {
          onload(req.response.documentElement);
          this.register(req);
        }
      }).bind(this);

      // Add this source to the load queue.
      this.loadQueue.push(req);

      // Set the response type to be an XML document.
      req.responseType = 'document';

      // Perform the request.
      req.overrideMimeType('application/xml');
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
      return this.modules[document.currentScript.src] = new Module();
    };

    // True once a module has been loaded.
    this.moduleLoaded = function(m) {
      return this.modules[m] !== undefined && this.modules[m].loaded;
    };

    // Define the main game module. This loads the rest of spark.
    this.game = function() {
      return this.module().requires('spark.game');
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
        window.gl = this.canvas.getContext('webgl');

        // Create the basic shader that's the default for load screens, etc.
        gl.basicShader = new spark.BasicShader();
        gl.spriteShader = new spark.SpriteShader();
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
