// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // where in the scene is the origin <0,0>
  export enum Origin {
    TOP_LEFT,
    TOP_MIDDLE,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_MIDDLE,
    BOTTOM_RIGHT,
    MIDDLE_LEFT,
    MIDDLE_RIGHT,
    MIDDLE,
  }

  // every game is a stack of scenes
  export class Scene {
    frametime: number;
    framecount: number;
    paused: boolean;
    runloop: number;

    // playfield area and camera view
    rect: Rect;
    camera: Mat;

    // collision spacial hash
    space: Quadtree;

    // sprite pool
    sprites: Sprite[] = [];
    pool: Sprite[] = [];

    // free, active, and pending sprites
    private sp: number = 0;
    private count: number = 0;
    private pending: number = 0;

    // create a new scene object
    constructor(origin?: Origin, width?: number, height?: number) {
      var i;

      // get the canvas size in pixels
      var vw = canvas.width;
      var vh = canvas.height;

      // default size fo the scene
      var w = width || vw;
      var h = height || vh * w / vw;

      // origin coordinates
      var x = 0;
      var y = 0;

      // create a table of possible origin coordinates
      switch(origin || Origin.TOP_LEFT) {
        case Origin.TOP_LEFT:      x = 0;     y = 0;     break;
        case Origin.TOP_MIDDLE:    x = w / 2; y = 0;     break;
        case Origin.TOP_RIGHT:     x = w;     y = 0;     break;
        case Origin.BOTTOM_LEFT:   x = 0;     y = h;     break;
        case Origin.BOTTOM_MIDDLE: x = w / 2; y = h;     break;
        case Origin.BOTTOM_RIGHT:  x = w;     y = h;     break;
        case Origin.MIDDLE_LEFT:   x = 0;     y = h / 2; break;
        case Origin.MIDDLE_RIGHT:  x = w;     y = h / 2; break;
        case Origin.MIDDLE:        x = w / 2; y = h / 2; break;
      }

      // initialize the playfield and camera
      this.rect = new Rect(-x, -y, w, h);
      this.camera = new Mat(0, 0, 1, 0, canvas.width / 2, canvas.height / 2);

      // initialize the sprite pool
      for (i = 0;i < 1000;i++) {
        this.pool.push(new Sprite());
      }
    }

    // set the camera viewport size, default to the canvas size
    setViewport(w?: number, h?: number): void {
      w = w || canvas.width;

      // maintain the aspect ratio if no height provided
      if (!h) {
        h = w * canvas.height / canvas.width;
      }

      // set the scale of the camera (zoom)
      this.camera.s.x = w / 2;
      this.camera.s.y = h / 2;
    }

    // start the main game loop
    run(): void {
      this.frametime = performance.now();
      this.framecount = 0;
      this.paused = false;
      this.runloop = requestAnimationFrame(this.stepFrame.bind(this));
    }

    // stop the main game loop
    quit(): void {
      cancelAnimationFrame(this.runloop);
    }

    // create a new sprite
    spawn(): Sprite {
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

    // advance the frame
    private stepFrame(now: number): void {
      var step = this.paused ? 0 : (now - this.frametime) / 1000;

      // advance time and count
      this.frametime = now;
      this.framecount++;

      // update the scene and render it
      this.update(step);
      this.draw();

      // clear input states
      flushInput();

      // TODO: show the performance trace

      // continue
      this.runloop = requestAnimationFrame(this.stepFrame.bind(this));
    }

    // advance background layers, sprites, etc.
    private update(step: number) {
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
    }

    // render the scene
    private draw() {
      var i;

      view.save();

      // reset context settings for the view
      view.globalAlpha = 1.0;
      view.globalCompositeOperation = 'source-over';
      view.shadowBlur = 0.0;
      view.lineWidth = 1;
      view.fillStyle = '#000';
      view.strokeStyle = '#fff';

      // erase the viewport
      view.clearRect(0, 0, canvas.width, canvas.height);

      // half the size of the canvas
      var w2 = canvas.width / 2;
      var h2 = canvas.height / 2;

      // find the middle of the playfield
      var mx = this.rect.x + (this.rect.width / 2);
      var my = this.rect.y + (this.rect.height / 2);

      // set the projection matrix
      view.setTransform(1, 0, 0, 1, 0, 0);

      // camera -> viewport
      view.translate(w2, h2);
      view.scale(w2 / this.camera.s.x, h2 / this.camera.s.y);

      // playfield -> camera
      view.transform(this.camera.r.x, this.camera.r.y, -this.camera.r.y, this.camera.r.x, 0, 0);
      view.translate(-this.camera.p.x - mx, -this.camera.p.y - my);

      // TODO: z-ordering of sprites/layers

      // render all the sprites
      for (i = 0;i < this.count;i++) {
        this.sprites[i].draw();
      }

      // done
      view.restore();
    }

    // transform a point from world to screen space
    worldToScreen(x: number, y: number): Vec {
      var mx = this.rect.x + (this.rect.width / 2);
      var my = this.rect.y + (this.rect.height / 2);

      // untranslate
      var cx = x - (this.camera.p.x + mx);
      var cy = y - (this.camera.p.y + my);

      // unrotate
      var rx = (cx * this.camera.r.x) - (cy * this.camera.r.y);
      var ry = (cy * this.camera.r.x) + (cx * this.camera.r.y);

      // unscale
      var sx = rx * canvas.height / (2 * this.camera.s.x);
      var sy = ry * canvas.width / (2 * this.camera.s.y);

      // project onto the screen
      return new Vec(sx + canvas.width / 2, sy + canvas.height / 2);
    }

    // transform a point from screen space to world space
    screenToWorld(x: number, y: number): Vec {
      var cx = (x - canvas.width / 2) * this.camera.s.x * 2 / canvas.width;
      var cy = (y - canvas.height / 2) * this.camera.s.y * 2 / canvas.height;

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
    pick(x: number, y: number, radius?: number): Collider[] {
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
  }
}
