/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.particle', 'spark.shader');

// A layer is a grouping of similarly drawn things.
spark.Layer = function() {
  this.shader = null;
  this.visible = true;
  this.z = 0.0;
};

// A layer for rendering.
spark.SpriteLayer = function(n) {
  spark.Layer.call(this);

  // Lists of active and free sprites.
  this.sprites = [];
  this.pool = [];

  // Initialize the pool with a bunch of sprites.
  for(var i = 0;i < (n || 100);i++) {
    this.pool.push(new spark.Sprite());
  }

  // Track the free list with a stack pointer and in-use with a count.
  this.sp = this.pool.length;
  this.count = 0;
  this.pending = 0;

  // Set the shader for this layer.
  this.shader = new spark.SpriteShader();
};

// All layers derive from a base layer.
spark.SpriteLayer.prototype = Object.create(spark.Layer);

// Set constructors.
spark.Layer.prototype.constructor = spark.Layer;
spark.SpriteLayer.prototype.constructor = spark.SpriteLayer;

// The basic layer does nothing.
spark.Layer.prototype.update = function() { };
spark.Layer.prototype.updateCollisions = function() { };
spark.Layer.prototype.draw = function() { };

// Allocate a new sprite to add to the layer.
spark.SpriteLayer.prototype.spawn = function(init) {
  var sprite;

  if (this.sp === 0) {
    sprite = new spark.Sprite();
  } else {
    sprite = this.pool[--this.sp];

    // Initialize the sprite from the pool.
    spark.Sprite.call(sprite);
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
spark.SpriteLayer.prototype.update = function() {
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
      spark.wipe(sprite);

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
spark.SpriteLayer.prototype.updateCollisions = function(space) {
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
spark.SpriteLayer.prototype.draw = function() {
  if (this.visible) {
    for(var i = 0;i < this.count;i++) {
      this.sprites[i].draw();
    }
  }
};
