// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {
  var loadQueue: Asset[];

  // the global project settings and asset list
  export var project: any = {
    title: 'Untitled',
    author: 'Someone',
    date: 'Today',
    version: 1.0,
    path: '/',
    assetRelativePath: '',
    assets: {},
  };

  // callback signatures
  export type UpdateCallback = () => void;
  export type LoadCallback = (data: any) => void;

  // the global canvas and viewport
  export var canvas: HTMLCanvasElement;
  export var view: CanvasRenderingContext2D;

  // call this first! sets up the canvas, view, and load queue
  export function main(canvasId: string, width?: number, height?: number): boolean {
    canvas = <HTMLCanvasElement>document.getElementById(canvasId);

    if (!canvas) {
      return false;
    }

    // if the size isn't specified, use the canvas size
    width = width || canvas.width;
    height = height || width * canvas.height / canvas.width;

    // resize the canvas to the desired size
    canvas.width = width;
    canvas.height = height;

    // hide the mouse cursor by default
    hideCursor();

    // disable the context menu
    canvas.oncontextmenu = function(event) {
      event.preventDefault();
    };

    // get the 2D view for the canvas
    view = canvas.getContext('2d');

    // erase the load queue
    loadQueue = [];

    return true;
  }

  // called once to load the project source file, assets, and begin
  export function launch(projectFile: string, onload: LoadCallback) {
    new JSONAsset(projectFile, json => {
      enableMouse();
      enableKeyboard();

      // initialize audio
      initAudio();

      // set the project path to be the same as where the project file is
      project.path = projectFile.split('/').slice(0, -1).join('/') + '/';

      // assign the project object
      spark.merge(project, json);

      // issue load requests for all the assets
      for (var id in project.assets) {
        var cls = project.assets[id].class;
        var src = project.assets[id].source;

        // lookup the asset class constructor from the class path
        var ctor = assetCtor(cls);
        var path = project.path + project.assetRelativePath + src;

        // the constructor will issue the load for the asset
        project.assets[id] = new ctor(path);
      }
    });

    // start the load loop
    load(onload);
  }

  // looks up a constructor function from a string
  export function assetCtor(path: string) {
    var ctor: any = window;

    path.split('.').forEach(name => {
      if ((ctor = ctor[name]) === undefined) {
        throw 'Unknown asset class constructor: "' + path + '"';
      }
    });

    // make sure it's a constructor
    if (typeof(ctor.constructor) !== 'function') {
      throw 'Not an asset class constructor: "' + path + '"';
    }

    return ctor;
  }

  // async loop request assets and display a progress bar
  export function load(onload: LoadCallback) {
    if (loadProgress() === true) {
      onload(project);
    } else {
      window.requestAnimationFrame(now => {
        var x = canvas.width / 2;
        var y = canvas.height / 2;

        // max width of the progress bar i 60% of the width
        var w = x * 3 / 5;

        // erase the display
        view.save();
        view.setTransform(1, 0, 0, 1, 0, 0);
        view.clearRect(0, 0, canvas.width, canvas.height);

        // display a loading bar
        view.strokeStyle = '#fff';
        view.shadowBlur = 10;
        view.shadowOffsetX = 0;
        view.shadowOffsetY = 0;
        view.shadowColor = '#fff';
        view.font = 'bold 10px "Courier", sans-serif';
        view.fillStyle = '#fff';
        view.fillText('Loading...', 10, canvas.height - 10);

        // Render the progress as a simple load bar.
        view.beginPath();
        view.moveTo(x - w, y);
        view.lineTo(x - w + w * 2 * spark.loadProgress(), y);
        view.stroke();
        view.restore();

        // continue loading...
        load(onload);
      });
    }
  }

  // true when the load is complete or a percentage
  export function loadProgress(): any {
    var n: number = 0;

    // count all the loaded assets
    for (var i = 0;i < loadQueue.length;i++) {
      if (loadQueue[i].data) n++;
    }

    return (n === loadQueue.length) ? true : n / loadQueue.length;
  }

  // base asset type from which all other assets should derive
  export class Asset {
    source: string;
    data: any;

    // adds this asset to the load queue
    constructor(src: string) {
      this.source = src;
      this.data = null;

      // add it to the load queue
      loadQueue.push(this);
    }
  }

  // an asset loaded via an XMLHttpRequest
  export class XHRAsset extends Asset {
    constructor(src: string, resType: string, onload: LoadCallback) {
      var req = new XMLHttpRequest();

      // when the asset is done loading, call the onload callback
      req.onreadystatechange = (function() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status <= 299) {
            onload(req);

            // if onload didn't resolve the asset, do that now
            this.data = this.data || req;
          }
        }
      }).bind(this);

      // add to the load queue
      super(src);

      // set the desired response type
      req.responseType = resType;

      // request the asset
      req.open('GET', src, true);
      req.send();
    }
  }

  // an XML document asset
  export class XMLAsset extends XHRAsset {
    constructor(src: string, onload: LoadCallback) {
      super(src, 'document', req => {
        onload(req.response);
      });
    }
  }

  // a JSON document asset
  export class JSONAsset extends XHRAsset {
    constructor(src: string, onload: LoadCallback) {
      super(src, 'json', req => {
        onload(req.response);
      });
    }
  }
}
