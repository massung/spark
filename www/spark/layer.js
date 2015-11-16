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

  // Apply the layer matrix.
  spark.view.save();
  spark.view.transform.apply(spark.view, this.m.transform);

  // Calculate the scaling.
  var sx = spark.game.scene.camera.s.x / this.m.s.x;
  var sy = spark.game.scene.camera.s.y / this.m.s.y;

  // Cache off the image size.
  var iw = this.image.width;
  var ih = this.image.height;

  // No matter what the translation is, always wrap to the image.
  this.m.p.x %= iw * this.m.s.x;
  this.m.p.y %= ih * this.m.s.y;

  // Find the middle of the screen.
  var middle = spark.game.scene.middle;

  // Get the width and height of the scene in local space.
  var w = (spark.game.scene.width + iw) * sx;
  var h = (spark.game.scene.height + ih) * sy;

  // Calculate how many tiles need to be drawn.
  var size = Math.sqrt((w * w) + (h * h));

  // Find the top/left corner to begin tiling from in local space.
  var left = middle.x * sx - (size / 2);
  var top = middle.y * sy - (size / 2);

  // Draw all the tiles.
  for(var x = 0;x <= size;x += iw - 1) {
    for (var y = 0;y <= size;y += ih - 1) {
      this.image.blitEx(0, 0, iw, ih, left + x, top + y);
    }
  }

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
