// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.StringMap;

typedef TimelineData = {
  fps: Int,
  duration: Int,
  loop: Bool,

  // timed event callbacks
  events: Array<{
    frame: Int,
    event: String,
  }>,

  // tweens to crunch
  tracks: Dynamic,
}

typedef Track = { method: String, keys: Array<Tween.Key> };

class Timeline extends Asset {
  private var data: TimelineData;

  // crunched tracks
  private var tweens: StringMap<Tween>;

  // load a new timeline asset
  public function new(src: String) {
    super(src);

    // no tweens by default (tracks must exist)
    this.tweens = null;

    // default settings
    this.data = {
      fps: 30,
      duration: 30,
      loop: false,
      tracks: null,
      events: [],
    }

    // load the JSON document with all the settings and tracks
    Spark.loadJSON(src, function(json: Dynamic) {
      Util.merge(this.data, json);

      // sort all the events by their frame #
      this.data.events.sort(function(a, b) return a.frame - b.frame);

      // crunch all the tracks
      if (this.data.tracks != null) {
        var i, fields = Reflect.fields(this.data.tracks);

        // map property to crunched track
        this.tweens = new StringMap<Tween>();

        for(i in 0...fields.length) {
          var field = fields[i];
          var track: Track = Reflect.field(this.data.tracks, field);
          var keys = track.keys;
          var method = track.method;

          // skip any track that doesn't have at least 2 keys in it
          if (keys == null || keys.length < 2) {
            continue;
          }

          // if the method isn't set, use cubic interpolation
          if (method == null) method = 'cubic';

          // crunch the track into a tween
          this.tweens.set(field, new Tween(keys, this.data.fps, this.data.duration, method));
        }
      }

      // the timeline is now loaded
      this.loaded = true;
    });
  }

  // create an instance of the timeline for a given object
  public function playOn(obj: Rig.Rigging, ?onevent: String -> Void) {
    var rig = new Rig();
    var prop;

    // spawn all the tracks on the same rigging
    if (this.tweens != null) {
      for (prop in this.tweens.keys()) {
        this.tweens.get(prop).playOn(obj, prop, this.data.loop);
      }
    }

    // lexical data for the animation
    var timeline = this;
    var eventIndex = 0;
    var time = 0.0;

    // create an animation
    var anim = function(step: Float): Bool {
      var frame = Math.floor((time += step) * timeline.data.fps % timeline.data.duration);

      // signal events that have been passed
      if (timeline.data.events.length > 0) {
        while (timeline.data.events[eventIndex].frame <= frame + 1) {
          onevent(timeline.data.events[eventIndex++].event);

          // wrap if at the last event
          if (eventIndex == timeline.data.events.length) {
            eventIndex = 0;
            break;
          }
        }
      }

      // stop when not looping and past the end time
      return (timeline.data.loop) ? false : time > timeline.data.fps * timeline.data.duration;
    }

    // play the animation
    obj.rig.play(anim);
  }
}
