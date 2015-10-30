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

// Set constructors.
__MODULE__.SpriteLayer.prototype.constructor = __MODULE__.SpriteLayer;
__MODULE__.TilemapLayer.prototype.constructor = __MODULE__.TilemapLayer;

// Process gameplay and collisions.
__MODULE__.SpriteLayer.prototype.update = function() {
  var i = 0;

  for(i = 0;i < this.length;) {
    if (this[i].dead) {
      var x = this.pop();

      if (i < this.length) {
        this[i] = x;
      }
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
  this.forEach(function(sprite) {
    if (sprite.visible === true) {
      sprite.collision.shapes.forEach(function(shape) {
        space.push(shape, true);
      });
    }
  });
};

// Render all the sprites onto the view.
__MODULE__.SpriteLayer.prototype.draw = function() {
  this.forEach(function(sprite) {
    sprite.draw();
  });
};

__MODULE__.TilemapLayer.prototype.update = function() {
  // TODO:
};

__MODULE__.TilemapLayer.prototype.draw = function() {
  // TODO:
};
