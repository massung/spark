/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().defines({
  Clip: function(src, onload) {
    this.sound = new Audio();

    // Preloading will cause the 'canplaythrough' event to fire.
    this.sound.preload = 'auto';
    this.sound.loop = true;

    // When the sound is done loading, resolve the asset.
    this.sound.addEventListener('canplaythrough', (function() {
      spark.register(this.sound);

      // Allow the user additional setup.
      if (onload !== undefined) {
        onload(this);
      }
    }).bind(this));

    // Looping isn't actually implemented in the browser, so we do it here.
    this.sound.addEventListener('ended', (function() {
      if (this.sound.loop === true) {
        this.sound.currentTime = 0;
        this.sound.play();
      }
    }).bind(this));

    // Create an asset for this sound so it loads.
    spark.request(this.sound, src);
  },
});

// Play the sound associated with this audio clip.
__MODULE__.Clip.prototype.woof = function() {
  var clone = this.sound.cloneNode(true);

  // Do not loop the clone.
  clone.loop = false;
  clone.play();
};

__MODULE__.Clip.prototype.play = function() {
  if (this.loopClone === undefined) {
    this.loopClone = this.sound.cloneNode(true);
  }

  this.loopClone.play();
};

__MODULE__.Clip.prototype.pause = function() {
  if (this.loopClone !== undefined) {
    this.loopClone.pause();
  }
};
