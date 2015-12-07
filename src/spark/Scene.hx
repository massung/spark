// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.collision.*;
import spark.collision.shape.*;
import spark.graphics.*;
import spark.layer.*;
import spark.object.*;
import spark.object.layer.*;

@:expose
class Scene {
  private var frametime: Float;
  private var framecount: Int;

  // id of the next requested animation frame
  private var runloop: Int;

  // collision spacial hash
  private var space: Quadtree;

  // layers
  private var layers: Array<Layer>;

  // playfield area and camera view
  public var rect: Rect;
  public var camera: Camera;

  // create a new scene object
  public function new(?origin: String, ?width: Float, ?height: Float) {
    var i;

    // get the canvas size in pixels
    var vw = Spark.canvas.width;
    var vh = Spark.canvas.height;

    // default size fo the scene
    var w = width == null ? vw : width;
    var h = height == null ? vh : height;

    // origin coordinates - default to top/left
    var x: Float = 0;
    var y: Float = 0;

    // create a table of possible origin coordinates
    switch(origin == null ? 'top-left' : origin) {
      case 'top-left':      x = 0;     y = 0;
      case 'top-middle':    x = w / 2; y = 0;
      case 'top-right':     x = w;     y = 0;
      case 'bottom-left':   x = 0;     y = h;
      case 'bottom-middle': x = w / 2; y = h;
      case 'bottom-right':  x = w;     y = h;
      case 'middle-left':   x = 0;     y = h / 2;
      case 'middle-right':  x = w;     y = h / 2;
      case 'middle':        x = w / 2; y = h / 2;
    }

    // initialize the playfield and camera
    this.rect = new Rect(-x, -y, w, h);
    this.camera = new Camera(Spark.canvas.width, Spark.canvas.height);

    // initialize the layer list
    this.layers = new Array<Layer>();
  }

  // set the camera viewport size, default to the canvas size
  public function setViewport(?w: Float, ?h: Float) {
    w = w == null ? Spark.canvas.width : w;

    // maintain the aspect ratio if no height provided
    if (h == null) {
      h = w * Spark.canvas.height / Spark.canvas.width;
    }

    // set the scale of the camera (zoom)
    this.camera.m.s.set(w / 2, h / 2);
  }

  // create a new layer of a given type and return it
  public function newLayer(classRef: Class<Layer>, initargs: Array<Dynamic>): Layer {
    var layer = Type.createInstance(classRef, initargs);

    // add the layer to the list
    this.layers.push(layer);

    return layer;
  }

  // add a new tiled background layer to the scene
  public function newBackgroundLayer(texture: Texture, ?tiled: Bool = true): BackgroundLayer {
    return cast this.newLayer(BackgroundLayer, [texture, tiled]);
  }

  // add a new sprite layer to the scene
  public function newSpriteLayer(?n: Int = 100): SpriteLayer {
    return cast this.newLayer(SpriteLayer, [n]);
  }

  // create a new tilemap layer and add it to the scene
  //public function newTilemapLayer(tmx: Tilemap): TilemapLayer {
  //  return cast this.newLayer(TilemapLayer, [tmx]);
  //}

  // start the main game loop
  public function run() {
    this.framecount = 0;
    this.frametime = js.Browser.window.performance.now();
    this.runloop = js.Browser.window.requestAnimationFrame(this.stepFrame);

    // make this scene the global scene for the game
    Game.scene = this;
  }

  // stop the main game loop
  public function quit() {
    js.Browser.window.cancelAnimationFrame(this.runloop);
  }

  // advance the frame
  private function stepFrame(now: Float) {
    var step = (now - this.frametime) / 1000;

    // advance time and count
    this.frametime = now;
    this.framecount++;

    // update the scene
    Debug.beginUpdate();
    {
      this.update(step);
    }
    Debug.endUpdate();

    // process collsions
    Debug.beginCollision();
    {
      this.processCollisions();
    }
    Debug.endCollision();

    // render all layers
    Debug.beginDraw();
    {
      this.draw();
    }
    Debug.endDraw();

    // render gui
    Debug.beginGui();
    {
      // TODO:
    }
    Debug.endGui();

    // clear input devices
    Key.flush();
    Mouse.flush();
    Joystick.flush();

    // show the performance trace
    if (Debug.isEnabled(Debug.PERF)) {
      var stats = {
        fps: 1 / step,
        layers: 0,
        sprites: 0,
      }

      // count all the active sprites on all layers
      for(i in 0...this.layers.length) {
        this.layers[i].debugStats(stats);
      }

      // draw the performance trace with stats
      Debug.drawPerf(this.framecount, stats);
    }

    // continue if this is still the main scene
    if (spark.Game.scene == this) {
      this.runloop = js.Browser.window.requestAnimationFrame(this.stepFrame);
    }
  }

  // advance background layers, sprites, etc.
  private function update(step: Float) {
    var i;

    // update the camera behaviors and animations
    this.camera.update(step);

    // update all the layers
    for(i in 0...this.layers.length) {
      this.layers[i].update(step);
    }
  }

  // create a new spacial hash and all all layers to it
  private function processCollisions() {
    this.space = new Quadtree(this.rect);

    // let each layer add collision shapes to the spacial hash
    for(i in 0...this.layers.length) {
      this.layers[i].updateCollision(this.space);
    }

    // allow colliding sprites to react to the collisions
    this.space.processCollisions();
  }

  // render the scene
  private function draw() {
    var i;

    Spark.view.save();

    // reset context settings for the view
    Spark.view.globalAlpha = 1.0;
    Spark.view.globalCompositeOperation = 'source-over';
    Spark.view.shadowBlur = 0;
    Spark.view.lineWidth = 1;
    Spark.view.fillStyle = '#000';
    Spark.view.strokeStyle = '#fff';

    // erase the viewport
    Spark.view.clearRect(0, 0, Spark.canvas.width, Spark.canvas.height);

    // half the size of the canvas
    var w2 = Spark.canvas.width / 2;
    var h2 = Spark.canvas.height / 2;

    // find the middle of the playfield
    var mx = this.rect.getLeft() + (this.rect.getWidth() / 2);
    var my = this.rect.getTop() + (this.rect.getHeight() / 2);

    // set the projection matrix (camera -> viewport)
    Spark.view.setTransform(w2, 0, 0, h2, w2, h2);

    // set the playfield -> camera transform
    this.camera.applyProjection();

    // offset to origin of playfield
    Spark.view.translate(-mx, -my);

    // z-ordering of layers
    //this.layers.sort(function(a, b) return Util.sign(a.z - b.z));

    // render all the layers
    for(i in 0...this.layers.length) {
      this.layers[i].draw();
    }

    // debug draw the spacial hash - must happen in world space!
    if (Debug.isEnabled(Debug.COLLISION)) {
      this.space.draw();
    }

    // done
    Spark.view.restore();
  }

  // transform a point from world to screen space
  public function worldToScreen(x: Float, y: Float): Vec {
    var mx = this.rect.getLeft() + (this.rect.getWidth() / 2);
    var my = this.rect.getTop() + (this.rect.getHeight() / 2);

    // untranslate
    var cx = x - (this.camera.m.p.x + mx);
    var cy = y - (this.camera.m.p.y + my);

    // unrotate
    var rx = (cx * this.camera.m.r.x) + (cy * this.camera.m.r.y);
    var ry = (cy * this.camera.m.r.x) - (cx * this.camera.m.r.y);

    // unscale
    var sx = rx * Spark.canvas.height / (2 * this.camera.m.s.x);
    var sy = ry * Spark.canvas.width / (2 * this.camera.m.s.y);

    // project onto the screen
    return new Vec(sx + Spark.canvas.width / 2, sy + Spark.canvas.height / 2);
  }

  // transform a point from screen space to world space
  public function screenToWorld(x: Float, y: Float): Vec {
    var cx = (x - Spark.canvas.width / 2) * this.camera.m.s.x * 2 / Spark.canvas.width;
    var cy = (y - Spark.canvas.height / 2) * this.camera.m.s.y * 2 / Spark.canvas.height;

    // rotate
    var vx = (cx * this.camera.m.r.x) - (cy * this.camera.m.r.y);
    var vy = (cy * this.camera.m.r.x) + (cx * this.camera.m.r.y);

    // find the middle of the playfield
    var mx = this.rect.getLeft() + (this.rect.getWidth() / 2);
    var my = this.rect.getTop() + (this.rect.getHeight() / 2);

    // translate
    return new Vec(vx + this.camera.m.p.x + mx, vy + this.camera.m.p.y + my);
  }

  // perform a pick at a given point
  public function pick(x: Float, y: Float, ?radius: Float = 5): Array<Body> {
    if (this.space == null) {
      return [];
    }

    // get the world space point from screen space
    var c = this.screenToWorld(x, y);

    // fail to pick anything when offscreen
    if (!this.rect.contains(c.x, c.y)) {
      return [];
    }

    // create a new circle shape to collide against
    var shape = new Circle(null, c.x, c.y, radius);

    // update the shape cache to get world space coordinates
    shape.updateShapeCache(Mat.identity());

    return this.space.collect(shape);
  }
}
