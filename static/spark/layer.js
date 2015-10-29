/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.entity').defines({

  // A layer that has sprites on it.
  SpriteLayer: function() {

    // Initialize parent instance data.
    Array.call(this);
  },

  // A tilemap layer for a map.
  TilemapLayer: function() {
  },
});

// A SpriteLayer is just an array of sprites with added properties.
__MODULE__.SpriteLayer.prototype = Object.create(Array.prototype);

// Process gameplay and collisions.
__MODULE__.SpriteLayer.prototype.update = function() {

  // Remove all dead sprites from the layer (unsorted).
  for(var i = 0;i < this.length;) {
    if (this[i].dead) {
      this[i] = this[this.pop()];
    } else {
      i++;
    }
  }

  // Process the remaining sprites.
  this.forEach(function(sprite) {
    sprite.update();
  });
};

// Add sprites to the collision spacial hash.
__MODULE__.SpriteLayer.prototype.updateCollisions = function(space) {
  this.forEach((function(sprite) {
    if (sprite.visible === true && sprite.shapes !== undefined) {
      sprite.shapes.forEach((function(shape) {
        this.quadtree.push(shape, true);
      }).bind(this));
    }
  }).bind(this));
};

// Render all the sprites onto the view.
__MODULE__.SpriteLayer.prototype.draw = function() {
  this.forEach(function(sprite) {
    sprite.draw();
  });
};

/* TilemapLayer
 */

__MODULE__.TilemapLayer.prototype.update = function() {
  // TODO:
};

__MODULE__.TilemapLayer.prototype.draw = function() {
  // TODO:
};
