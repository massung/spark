/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.particle', 'spark.shader').defines({

  // The base layer object.
  Basic: function() {
    this.shader = null;
  },

  // A background layer is a single texture.
  BackgroundLayer: function() {
    spark.layer.Basic.call(this);

    // TODO:
  },

  // A layer that has sprites on it.
  SpriteLayer: function(n) {
    spark.layer.Basic.call(this);

    // Lists of active and free sprites.
    this.sprites = [];
    this.pool = [];

    // Initialize the pool with a bunch of sprites.
    for(var i = 0;i < (n || 100);i++) {
      this.pool.push(new spark.entity.Sprite());
    }

    // Track the free list with a stack pointer and in-use with a count.
    this.sp = this.pool.length;
    this.count = 0;
    this.pending = 0;

    // Set the shader for this layer.
    this.shader = null; // spark.project.assets.spriteShader;
  },

  // A tilemap layer for a map.
  TilemapLayer: function() {
    spark.layer.Basic.call(this);

    // TODO:
  },
});

// All layers derive from a base layer.
__MODULE__.BackgroundLayer.prototype = Object.create(__MODULE__.Basic);
__MODULE__.SpriteLayer.prototype = Object.create(__MODULE__.Basic);
__MODULE__.TilemapLayer.prototype = Object.create(__MODULE__.Basic);

// Set constructors.
__MODULE__.Basic.prototype.constructor = __MODULE__.Basic;
__MODULE__.BackgroundLayer.prototype.constructor = __MODULE__.BackgroundLayer;
__MODULE__.SpriteLayer.prototype.constructor = __MODULE__.SpriteLayer;
__MODULE__.TilemapLayer.prototype.constructor = __MODULE__.TilemapLayer;

// The basic layer does nothing.
__MODULE__.Basic.prototype.update = function() { };
__MODULE__.Basic.prototype.updateCollisions = function() { };
__MODULE__.Basic.prototype.draw = function() { };

// Allocate a new sprite to add to the layer.
__MODULE__.SpriteLayer.prototype.spawn = function(init) {
  var sprite;

  if (this.sp === 0) {
    sprite = new spark.entity.Sprite();
  } else {
    sprite = this.pool[--this.sp];

    // Initialize the sprite from the pool.
    spark.entity.Sprite.call(sprite);
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
