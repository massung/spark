/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec', 'spark.util');

// An animation behavior that will keyframe an object.
__MODULE__.Anim = function(src) {
  spark.loadJSON(src, (function(json) {
    this.fps = 30;
    this.looping = false;
    this.duration = 30;
    this.events = [];
    this.tracks = {};

    // Overwrite defaults.
    spark.util.merge(this, json);

    // Sort all the events by frame #.
    this.events.sort(function(a, b) { return a.frame > b.frame; });

    // Loop over all the tracks and sort keys by frame #.
    for(var prop in this.tracks) {
      var track = this.tracks[prop];
      var path = prop.split('.');

      // The last element of the path is the property key.
      track.key = path.pop();

      // Create a function to find the owner of the property key.
      track.property = (function(obj) {
        for(var i = 0;i < this.length;i++)
          obj = obj[this[i]];
        return obj;
      }).bind(path.slice(0));

      // Sort all the keyframes by frame #.
      track.keys.sort(function(a, b) { return a.frame > b.frame; });

      // Allocate space for ever value at every frame.
      track.frames = new Array(this.duration);

      // If there is no frame 0, create one (constant interpolation).
      if (track.keys[0].frame > 0) {
        track.keys.unshift({
          frame: 0,
          value: track.keys[0].value
        });
      }

      // If there's no final frame, push one (constant interpolation).
      if (track.keys[track.keys.length - 1].frame < this.duration) {
        track.keys.push({
          frame: this.duration - 1,
          value: track.keys[track.keys.length - 1].value,
        });
      }

      // Loop over the keys and set tangents if none are provided.
      for(var i = 1;i < track.keys.length - 1;i++) {
        if (track.keys[i].tangent === undefined) {
          var dtp = (track.keys[i].value - track.keys[i - 1].value) / (track.keys[i].frame - track.keys[i - 1].frame);
          var dtn = (track.keys[i + 1].value - track.keys[i].value) / (track.keys[i + 1].frame - track.keys[i].frame);

          // Assume a linear tangent.
          track.keys[i].tangent = (dtp + dtn) / 2.0;
        }
      }

      // Copy the keys, so we can pop them as we crunch frames.
      var ks = track.keys.slice(0);
      var pk = ks.shift();

      // The initial frame value is known.
      track.frames[0] = pk.value;

      // Pre-calculate the value for every other frame.
      for(var x = 1;x < this.duration;x++) {
        var tk = ks[0];

        // If this frame is on a key, just set the value and pop.
        if (tk.frame === x) {
          track.frames[x] = (pk = ks.shift()).value;
        }

        // Otherwise we need to interpolate.
        else {
          var u = (tk.frame === x) ? 0.0 : (x - pk.frame) / (tk.frame - pk.frame);

          // Get the hermite blending values.
          var h0 = (u * u * u * 2) - (u * u * 3) + 1;
          var h1 = (u * u * u * -2) + (u * u * 3);
          var h2 = (u * u * u) - (u * u * 2) + u;
          var h3 = (u * u * u) - (u * u);

          // Get the value of this key and the next key.
          var p0 = pk.value;
          var p1 = tk.value;

          // Assume linear tangents between points.
          var t0 = spark.util.degToRad(pk.tangent || 0.0);
          var t1 = spark.util.degToRad(tk.tangent || 0.0);

          // Calculate the value.
          track.frames[x] = (h0 * p0) + (h1 * p1) + (h2 * t0) + (h3 * t1);
        }
      }
    }
  }).bind(this));
};

// Set constructors.
__MODULE__.Anim.prototype.constructor = __MODULE__.Anim;

// Clone this animation and create a behavior function bound to the object.
__MODULE__.Anim.prototype.play = function(obj, onevent) {
  var instance = {
    object: obj,
    time: 0.0,
    eventIndex: 0,
    onevent: onevent,
  };

  // Loop over all the tracks.
  for(var prop in this.tracks) {
    var track = this.tracks[prop];

    // Local tracks need to get the initial value of the object.
    if (track.local) {
      //track.property(obj)[track.key]

      // TODO: save initial value to delta from.
    }
  }

  // A function that can be called once per frame to update the object.
  return (function(step) { return this.update(instance, step); }).bind(this);
};

// The behavior code for a given sprite or generic object.
__MODULE__.Anim.prototype.update = function(instance, step) {
  var frame = Math.floor(instance.time * this.fps);

  // Clamp or wrap the frame.
  if (frame > this.duration) {
    if (this.looping) {
      instance.time %= this.duration / this.fps;
      instance.eventIndex = 0;

      // Wrap the frame.
      frame = Math.floor(instance.time);
    }

    // Not looping, just clamp at the last frame.
    else frame = this.duration - 1;
  }

  // Fire all the events that should fire.
  if (instance.onevent !== undefined) {
    while(instance.eventIndex < this.events.length && frame >= this.events[instance.eventIndex].frame) {
      instance.onevent(this.events[instance.eventIndex++].event);
    }
  }

  // Loop over all the tracks and update each property in the object.
  for(var prop in this.tracks) {
    var track = this.tracks[prop];

    // Get the owner of the property and its new value.
    var property = track.property(instance.object);
    var value = track.frames[frame];

    // Update the value of the object.
    property[track.key] = value;
  }

  // Was this the last frame?
  if (frame === this.duration -1 && !this.looping) {
    return false;
  }

  // Step the time.
  instance.time += step;

  // Continue playing.
  return true;
};
