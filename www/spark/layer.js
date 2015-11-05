/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.particle').defines({

  // A layer that has sprites on it.
  SpriteLayer: function(n) {
    Array.call(this);

    // Sprites waiting to be added and free sprites to draw from.
    this.pending = [];
    this.pool = [];

    // Initialize the pool with a bunch of sprites.
    for(var i = 0;i < (n || 100);i++) {
      this.pool.push(new spark.entity.Sprite());
    }
  },

  // A tilemap layer for a map.
  TilemapLayer: function() {
  },
});

// SpriteLayers are a subclass of Array.
__MODULE__.SpriteLayer.prototype = Object.create(Array.prototype);

// Set constructors.
__MODULE__.SpriteLayer.prototype.constructor = __MODULE__.SpriteLayer;
__MODULE__.TilemapLayer.prototype.constructor = __MODULE__.TilemapLayer;

// Allocate a new sprite to add to the layer.
__MODULE__.SpriteLayer.prototype.spawn = function(init) {
  var sprite;

  if (this.pool.length === 0) {
    sprite = new spark.entity.Sprite();
  } else {
    sprite = this.pool.pop();

    // Initialize the sprite from the pool.
    spark.entity.Sprite.call(sprite);
  }

  // Set the layer this sprite is on.
  sprite.layer = this;

  // Call an optional callback to initialize.
  if (init !== undefined) {
    init(sprite);
  }

  // Add the sprite to the pending list to be added later.
  this.pending.push(sprite);

  return sprite;
};

// Process gameplay and collisions.
__MODULE__.SpriteLayer.prototype.update = function() {
  var i;

  // Delete all the dead sprites.
  for(i = 0;i < this.length;) {
    var sprite = this[i];

    if (sprite.dead) {
      var x = this.pop();

      // Remove all the custom properties from this sprite.
      spark.util.wipe(sprite);

      // Release the dead sprite back to the pool.
      this.pool.push(sprite);

      // Swap this sprite with the last one.
      if (i < this.length) {
        this[i] = x;
      }
    } else {
      i++;
    }
  }

  // Add all the pending sprites from the previous frame.
  for(i = 0;i < this.pending.length;i++) {
    this.push(this.pending.pop());
  }

  // Process the remaining sprites.
  for(i = 0;i < this.length;i++) {
    this[i].update();
  }
};

// Add sprites to the collision spacial hash.
__MODULE__.SpriteLayer.prototype.updateCollisions = function(space) {
  for(var i = 0;i < this.length;i++) {
    var sprite = this[i];

    if (sprite.visible === true) {
      for(var k = 0;k < sprite.colliders.length;k++) {
        sprite.colliders[k].addToQuadtree(space);
      }
    }
  }
};

// Render all the sprites onto the view.
__MODULE__.SpriteLayer.prototype.draw = function() {
  for(var i = 0;i < this.length;i++) {
    this[i].draw();
  }
};

__MODULE__.TilemapLayer.prototype.update = function() {
  // TODO:
};

__MODULE__.TilemapLayer.prototype.draw = function() {
  // TODO:
};
