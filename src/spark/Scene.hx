// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Scene {
  private var frametime: Float;
  private var framecount: Float;

  // id of the next requested animation frame
  private var runloop: Int;

  // collision spacial hash
  //private var space: Quadtree;

  // sprite pool
  //private var sprites: Array<Sprite>;
  //private var pool: Array<Sprite>;

  // free, active, and pending sprites
  private var sp: Int;
  private var count: Int;
  private var pending: Int;

  // playfield area and camera view
  public var rect: Rect;
  public var camera: Mat;

  // create a new scene object
  public function new(?origin: Origin, ?width: Float, ?height: Float) {
    var i;

    // get the canvas size in pixels
    var vw = Spark.canvas.width;
    var vh = Spark.canvas.height;

    // default size fo the scene
    var w = width == null ? vw : width;
    var h = height == null ? vh : height;

    // origin coordinates
    var x: Float = 0;
    var y: Float = 0;

    // create a table of possible origin coordinates
    switch(origin == null ? Origin.TOP_LEFT : origin) {
      case Origin.TOP_LEFT:      x = 0;     y = 0;
      case Origin.TOP_MIDDLE:    x = w / 2; y = 0;
      case Origin.TOP_RIGHT:     x = w;     y = 0;
      case Origin.BOTTOM_LEFT:   x = 0;     y = h;
      case Origin.BOTTOM_MIDDLE: x = w / 2; y = h;
      case Origin.BOTTOM_RIGHT:  x = w;     y = h;
      case Origin.MIDDLE_LEFT:   x = 0;     y = h / 2;
      case Origin.MIDDLE_RIGHT:  x = w;     y = h / 2;
      case Origin.MIDDLE:        x = w / 2; y = h / 2;
    }

    // initialize the playfield and camera
    this.rect = new Rect(-x, -y, w, h);
    this.camera = new Mat(0, 0, 1, 0, Spark.canvas.width / 2, Spark.canvas.height / 2);

    // initialize the sprite pool
    //for (i = 0;i < 1000;i++) {
    //  this.pool.push(new Sprite());
    //}
  }

  // set the camera viewport size, default to the canvas size
  public function setViewport(?w: Float, ?h: Float) {
    w = w == null ? Spark.canvas.width : w;

    // maintain the aspect ratio if no height provided
    if (h == null) {
      h = w * Spark.canvas.height / Spark.canvas.width;
    }

    // set the scale of the camera (zoom)
    this.camera.s.x = w / 2;
    this.camera.s.y = h / 2;
  }

  // start the main game loop
  public function run() {
    this.framecount = 0;
    this.frametime = js.Browser.window.performance.now();
    this.runloop = js.Browser.window.requestAnimationFrame(this.stepFrame);
  }

  // stop the main game loop
  public function quit() {
    js.Browser.window.cancelAnimationFrame(this.runloop);
  }

  // create a new sprite
  /*
  public function spawn(): Sprite {
    var sprite;

    if (this.sp === 0) {
      sprite = new Sprite();
    } else {
      sprite = this.pool[--this.sp];

      // initialize the sprite from the pool
      Sprite.call(sprite);
    }

    // set the scene of this sprite
    sprite.scene = this;

    // append the sprite to the pending side
    if (this.count + this.pending < this.sprites.length) {
      this.sprites[this.count + this.pending] = sprite;
    } else {
      this.sprites.push(sprite);
    }

    // tally the number of pending sprites
    this.pending++;

    return sprite;
  }
  */

  // advance the frame
  private function stepFrame(now: Float) {
    var step = (now - this.frametime) / 1000;

    // advance time and count
    this.frametime = now;
    this.framecount++;

    // update the scene and render it
    this.update(step);
    this.draw();

    // clear input states
    Input.flush();

    // TODO: show the performance trace

    // continue
    this.runloop = js.Browser.window.requestAnimationFrame(this.stepFrame);
  }

  // advance background layers, sprites, etc.
  private function update(step: Float) {
    /*
    var i;

    // add all the pending sprites to the scene
    this.count += this.pending;
    this.pending = 0;

    // delete all the dead sprites
    for (i = 0;i < this.count;) {
      var sprite = this.sprites[i];

      if (sprite.dead) {
        this.sprites[i] = this.sprites[--this.count];

        // remove any custom properties from the sprite
        wipe(sprite);

        // add this sprite back to the pool
        if (this.sp < this.pool.length) {
          this.pool[this.sp] = sprite;
        } else {
          this.pool.push(sprite);
        }

        // tally the free list
        this.sp++;
      } else {
        i++;
      }
    }

    // create a new quadtree to hash all the sprites
    this.space = new Quadtree(this.rect);

    // process all the remaining sprites
    for (i = 0;i < this.count;i++) {
      this.sprites[i].update(step);
      this.sprites[i].addToQuadtree(this.space);
    }
    */
  }

  // render the scene
  private function draw() {
    var i;

    Spark.view.save();

    // reset context settings for the view
    Spark.view.globalAlpha = 1.0;
    Spark.view.globalCompositeOperation = 'source-over';
    Spark.view.shadowBlur = 0.0;
    Spark.view.lineWidth = 1;
    Spark.view.fillStyle = '#000';
    Spark.view.strokeStyle = '#fff';

    // erase the viewport
    Spark.view.clearRect(0, 0, Spark.canvas.width, Spark.canvas.height);

    // half the size of the canvas
    var w2 = Spark.canvas.width / 2;
    var h2 = Spark.canvas.height / 2;

    // find the middle of the playfield
    var mx = this.rect.x + (this.rect.width / 2);
    var my = this.rect.y + (this.rect.height / 2);

    // set the projection matrix
    Spark.view.setTransform(1, 0, 0, 1, 0, 0);

    // camera -> viewport
    Spark.view.translate(w2, h2);
    Spark.view.scale(w2 / this.camera.s.x, h2 / this.camera.s.y);

    // playfield -> camera
    Spark.view.transform(this.camera.r.x, this.camera.r.y, -this.camera.r.y, this.camera.r.x, 0, 0);
    Spark.view.translate(-this.camera.p.x - mx, -this.camera.p.y - my);

    // TODO: z-ordering of sprites/layers
    /*
    // render all the sprites
    for (i = 0;i < this.count;i++) {
      this.sprites[i].draw();
    }
    */
    // done
    Spark.view.restore();
  }

  // transform a point from world to screen space
  public function worldToScreen(x: Float, y: Float): Vec {
    var mx = this.rect.x + (this.rect.width / 2);
    var my = this.rect.y + (this.rect.height / 2);

    // untranslate
    var cx = x - (this.camera.p.x + mx);
    var cy = y - (this.camera.p.y + my);

    // unrotate
    var rx = (cx * this.camera.r.x) - (cy * this.camera.r.y);
    var ry = (cy * this.camera.r.x) + (cx * this.camera.r.y);

    // unscale
    var sx = rx * Spark.canvas.height / (2 * this.camera.s.x);
    var sy = ry * Spark.canvas.width / (2 * this.camera.s.y);

    // project onto the screen
    return new Vec(sx + Spark.canvas.width / 2, sy + Spark.canvas.height / 2);
  }

  // transform a point from screen space to world space
  public function screenToWorld(x: Float, y: Float): Vec {
    var cx = (x - Spark.canvas.width / 2) * this.camera.s.x * 2 / Spark.canvas.width;
    var cy = (y - Spark.canvas.height / 2) * this.camera.s.y * 2 / Spark.canvas.height;

    // rotate
    var vx = (cx * this.camera.r.x) + (cy * this.camera.r.y);
    var vy = (cy * this.camera.r.x) - (cx * this.camera.r.y);

    // find the middle of the playfield
    var mx = this.rect.x + (this.rect.width / 2);
    var my = this.rect.y + (this.rect.height / 2);

    // translate
    return new Vec(vx + this.camera.p.x + mx, vy + this.camera.p.y + my);
  }

  // perform a pick at a given point
  /*
  public function pick(x: Float, y: Float, ?radius: Float = 1): Collider[] {
    if (!this.space) {
      return [];
    }

    // get the world space point from screen space
    var c = this.screenToWorld(x, y);

    // fail to pick anything when offscreen
    if (!this.rect.contains(c.x, c.y)) {
      return [];
    }

    // create a new circle shape to collide against
    var shape = new Circle(null, c.x, c.y, radius || 5.0);

    // update the shape cache to get world space coordinates
    shape.updateShapeCache(Mat.IDENTITY);

    return this.space.collect(shape);
  }
  */
}

// where in the scene is the origin <0,0>
enum Origin {
  TOP_LEFT;
  TOP_MIDDLE;
  TOP_RIGHT;
  BOTTOM_LEFT;
  BOTTOM_MIDDLE;
  BOTTOM_RIGHT;
  MIDDLE_LEFT;
  MIDDLE_RIGHT;
  MIDDLE;
}
