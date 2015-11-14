/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// Create an AudioContext for all sounds to use.
__MODULE__.init = function() {
  this.context = new AudioContext();
};

// Sound resource.
__MODULE__.Clip = function(src) {
  spark.loadXHR(src, 'arraybuffer', (function(req) {
    spark.audio.context.decodeAudioData(req.response, (function(buffer) {
      this.buffer = buffer;
    }).bind(this));
  }).bind(this));
};

// Set constructors.
__MODULE__.Clip.prototype.constructor = __MODULE__.Clip;

// Play the sound associated with this audio clip.
__MODULE__.Clip.prototype.woof = function() {
  if (this.buffer === undefined) {
    return;
  }

  // Create a new source to play from.
  var source = spark.audio.context.createBufferSource();

  // Wire and go.
  source.buffer = this.buffer;
  source.connect(spark.audio.context.destination);
  source.start(0);
};

__MODULE__.Clip.prototype.play = function() {
//  this.loop.play();
};

__MODULE__.Clip.prototype.pause = function() {
//  this.loop.pause();
};
