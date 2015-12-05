// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object.layer;

import spark.collision.*;

class SpriteLayer extends Layer {
  private var sprites: Array<Sprite>;
  private var pool: Array<Sprite>;

  // free stack pointer, live and pending counts
  private var sp: Int;
  private var count: Int;
  private var pending: Int;

  // returns the length of the live list
  public var length(get,null): Int;

  // create a new sprite layer with a pool of sprites to draw from
  public function new(?n: Int = 100) {
    var i;

    // default z-ordering
    super();

    // identity transform
    this.m = Mat.identity();

    // allocate the lists
    this.sprites = [];

    // fill the free list
    this.pool = [for(i in 0...n) new Sprite(this)];

    // reset counters
    this.sp = n;
    this.count = 0;
    this.pending = 0;
  }

  // returns the number of live objects in the pool
  public inline function get_length(): Int return this.count;

  // access into the sprite list
  @:arrayAccess
  public inline function get(i: Int): Sprite return this.sprites[i];

  // allocate a new sprite from the pool
  public function newSprite(): Sprite {
    var sprite: Sprite;

    if (this.sp > 0) {
      sprite = this.pool[--this.sp];

      // re-initialize the resource
      sprite.init();
    } else {

      // pool is empty, don't fail, just slower...
      sprite = new Sprite(this);
    }

    // append the object to the pending side
    if (this.count + this.pending < this.sprites.length) {
      this.sprites[this.count + this.pending] = sprite;
    } else {
      this.sprites.push(sprite);
    }

    // tally pending sprites
    this.pending++;

    return sprite;
  }

  // update sprites, remove dead sprites
  override public function update(step: Float) {
    var i = 0;

    // add all the pending sprites from the previous frame
    this.count += this.pending;
    this.pending = 0;

    // free dead sprites
    while(i < this.count) {
      var sprite = this.sprites[i];

      if (sprite.dead) {
        this.sprites[i] = this.sprites[--this.count];

        // add this resource back to the pool
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

    // update all the sprites
    for(i in 0...this.count) {
      this.sprites[i].update(step);
    }
  }

  // add sprites to the spacial hash
  override public function updateCollision(space: Quadtree) {
    var i;

    for(i in 0...this.count) {
      this.sprites[i].addToQuadtree(space);
    }
  }

  // render the layer
  override public function draw() {
    var i;

    // render all the sprites
    for (i in 0...this.count) {
      this.sprites[i].draw();
    }
  }

  // add to any debug stats when debugging
  override public function debugStats(stats: Debug.Stats) {
    super.debugStats(stats);

    // accumulate sprites
    stats.sprites += this.count;
  }
}
