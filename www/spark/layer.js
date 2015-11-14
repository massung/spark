/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.particle');

// A simple background layer.
__MODULE__.BackgroundLayer = function() {
  this.m = new spark.vec.Mat();

  // The background image to display.
  this.image = null;

  // Is wrapping on/off?
  this.wrapX = true;
  this.wrapY = true;
};

// A layer for rendering.
__MODULE__.SpriteLayer = function(n) {
  this.sprites = [];
  this.pool = [];

  // Initialize the pool with a bunch of sprites.
  for(var i = 0;i < (n || 100);i++) {
    this.pool.push(new spark.sprite.Sprite());
  }

  // Track the free list with a stack pointer and in-use with a count.
  this.sp = this.pool.length;
  this.count = 0;
  this.pending = 0;
};

// Set constructors.
__MODULE__.BackgroundLayer.prototype.constructor = __MODULE__.BackgroundLayer;
__MODULE__.SpriteLayer.prototype.constructor = __MODULE__.SpriteLayer;

// No update or collisions on background layers.
__MODULE__.BackgroundLayer.prototype.update = function() {};
__MODULE__.BackgroundLayer.prototype.updateCollisions = function() {};

// Render the background, wrapping if set.
__MODULE__.BackgroundLayer.prototype.draw = function() {
  if (this.image === undefined) {
    return;
  }

  // Save transform information.
  spark.view.save();

  // Set the transform.
  spark.view.transform.apply(spark.view, this.m.transform);

  // Blit the image.
  this.image.blit();

  // Done.
  spark.view.restore();
};

// Allocate a new sprite to add to the layer.
__MODULE__.SpriteLayer.prototype.spawn = function(init) {
  var sprite;

  if (this.sp === 0) {
    sprite = new spark.sprite.Sprite();
  } else {
    sprite = this.pool[--this.sp];

    // Initialize the sprite from the pool.
    spark.sprite.Sprite.call(sprite);
  }

  // Set the layer this sprite is on.
  sprite.layer = this;

  // Call an optional callback to initialize.
  if (init !== undefined) {
    init(sprite);
  }

  // Append the sprite, but it will be on the pending side of the count.
  if (this.count + this.pending < this.sprites.length) {
    this.sprites[this.count + this.pending] = sprite;
  } else {
    this.sprites.push(sprite);
  }

  // Tally the number of pending sprites.
  this.pending++;

  return sprite;
};

// Process gameplay and collisions.
__MODULE__.SpriteLayer.prototype.update = function() {
  var i;

  // Add all the pending sprites to the scene.
  this.count += this.pending;
  this.pending = 0;

  // Delete all the dead sprites.
  for(i = 0;i < this.count;) {
    var sprite = this.sprites[i];

    if (sprite.dead) {
      this.sprites[i] = this.sprites[--this.count];

      // Remove all the custom properties from this sprite.
      spark.util.wipe(sprite);

      // Add this sprite back to the pool.
      if (this.sp < this.pool.length) {
        this.pool[this.sp] = sprite;
      } else {
        this.pool.push(sprite);
      }

      // Tally free list.
      this.sp++;
    } else {
      i++;
    }
  }

  // Process the remaining sprites.
  for(i = 0;i < this.count;i++) {
    this.sprites[i].update();
  }
};

// Add sprites to the collision spacial hash.
__MODULE__.SpriteLayer.prototype.updateCollisions = function(space) {
  for(var i = 0;i < this.count;i++) {
    var sprite = this.sprites[i];

    if (sprite.visible === true) {
      for(var k = 0;k < sprite.colliders.length;k++) {
        sprite.colliders[k].addToQuadtree(space);
      }
    }
  }
};

// Render all the sprites onto the view.
__MODULE__.SpriteLayer.prototype.draw = function() {
  for(var i = 0;i < this.count;i++) {
    this.sprites[i].draw();
  }
};
