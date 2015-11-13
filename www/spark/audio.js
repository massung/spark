/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

spark.AudioClip = function(src) {
  this.sound = new Audio();

  // Preloading will cause the 'canplaythrough' event to fire.
  this.sound.preload = 'auto';
  this.sound.loop = true;

  // When the sound is done loading, resolve the asset.
  this.sound.addEventListener('canplaythrough', (function() {
    spark.register(this.sound);
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
};

// Set constructors.
spark.AudioClip.prototype.constructor = spark.AudioClip;

// Play the sound associated with this audio clip.
spark.AudioClip.prototype.woof = function() {
  var clone = this.sound.cloneNode(true);

  // Do not loop the clone.
  clone.loop = false;
  clone.play();
};

spark.AudioClip.prototype.play = function() {
  if (this.loopClone === undefined) {
    this.loopClone = this.sound.cloneNode(true);
  }

  this.loopClone.play();
};

spark.AudioClip.prototype.pause = function() {
  if (this.loopClone !== undefined) {
    this.loopClone.pause();
  }
};
