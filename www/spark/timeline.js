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
      track.owner = function(obj) {
        for(var i = 0;i < path.length;i++)
          obj = obj[path[i]];
        return obj;
      };

      // Sort all the keyframes by frame #.
      track.keys.sort(function(a, b) { return a.frame > b.frame; });

      // Allocate space for ever value at every frame.
      track.frames = new Array(this.duration + 1);

      // If there is no frame 0, create one (constant interpolation).
      if (track.keys[0].frame > 0) {
        track.keys.unshift({ frame: 0, value: track.keys[0].value });
      }

      // If there's no final frame, push one (constant interpolation).
      if (track.keys[track.keys.length - 1].frame < this.duration) {
        track.keys.push({ frame: this.duration, value: track.keys[track.keys.length - 1].value });
      }

      // The first and last frames have known values.
      track.frames[0] = track.keys[0].value;
      track.frames[this.duration] = track.keys[track.keys.length - 1].value;

      // Pre-calculate the value for every frame.
      for(var x = 1;x < this.duration;x++) {
        var i;

        // Calculate 'u' in the range of [0, keys.length-1], taking frames into account.
        for(i = 1;i < track.keys.length - 1;i++) {
          var tk = track.keys[i];
          var pk = track.keys[i - 1];

          // Skip.
          if (tk.frame < x) continue;

          // Exact frame, set the value and move to next frame.
          if (tk.frame === x) {
            track.frames[x] = tk.value;
          }

          // Interpolate between the previous key and this key.
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
          break;
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
    lastFrame: 0,
    eventIndex: 0,
    onevent: onevent,
  };

  // Loop over all the tracks.
  for(var prop in this.tracks) {
    var track = this.tracks[prop];

    // Local tracks need to get the initial value of the object.
    if (track.local) {
      //track.owner(obj)[track.key]

      // TODO: save initial value to delta from.
    }
  }

  // A function that can be called once per frame to update the object.
  return (function(step) { return this.update(instance, step); }).bind(this);
};

// The behavior code for a given sprite or generic object.
__MODULE__.Anim.prototype.update = function(instance, step) {
  var x = (instance.time * this.fps) % (this.duration + 1);

  // Fire off all the events for this (and possibly previous frames).
  if (instance.onevent !== undefined) {
    while(instance.eventIndex < this.events.length && x <= this.events[instance.eventIndex].frame) {
      instance.onevent(this.events[instance.eventIndex++].event);

      // Wrap for looping.
      if (instance.eventIndex === this.events.length) {
        instance.eventIndex = 0;
      }
    }
  }

  // Loop over all the tracks and update each property in the object.
  for(var prop in this.tracks) {
    var track = this.tracks[prop];

    // Get the owner of the property and its new value.
    var owner = track.owner(instance.object);
    var value = track.frames[Math.floor(x)];

    // Update the value of the object.
    owner[track.key] = value /* TODO: track.local? */;
  }

  // Advance the current time. Update what the last frame animated was.
  instance.time += step;
  instance.lastFrame = x;
};

// True if the animation is finished playing.
__MODULE__.Anim.prototype.complete = function() {
  return this.time > this.duration;
};
