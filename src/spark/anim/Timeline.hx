// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.Vector;
import spark.math.*;

typedef Track = { property: String, tween: Tween };
typedef Event = { frame: Int, event: String };

@:expose
class Timeline extends Asset.JSONAsset {
  private var tracks: Array<Track>;
  private var events: Array<Event>;

  // global track data
  private var fps: Int;
  private var duration: Int;
  private var loop: Bool;

  // load a new timeline asset
  public function new(src: String) {
    super(src, function(json: Dynamic) {
      var i;

      // assign default values
      this.fps = json.fps == null ? 30 : json.fps;
      this.duration = json.duration == null ? 30 : json.duration;
      this.loop = json.loop == null ? false : true;

      // sort all the events by frame
      this.events = json.events == null ? new Array<Event>() : json.events;
      this.events.sort(function(a, b) return a.frame - b.frame);

      // add all the tracks, crunching them
      this.tracks = new Array<Track>();
      if (json.tracks != null) {
        for(i in Reflect.fields(json.tracks)) {
          var track = Reflect.field(json.tracks, i);

          if (track.keys != null) {
            var tween = new Tween(track.keys, this.fps, this.duration, track.method);

            // add the crunched tween as a new track
            this.tracks.push({ property: i, tween: tween });
          }
        }
      }

      // the timeline is now loaded
      this.loaded = true;
    });
  }

  // create an instance of the timeline for a given object
  public function playOn(obj: Rig.Rigging, ?onevent: String -> Void) {
    var rig = new Rig();
    var i;

    // spawn all the tracks on the same rigging
    for (i in 0...this.tracks.length - 1) {
      this.tracks[i].tween.playOn(obj, this.tracks[i].property, this.loop);
    }

    // lexical data for the animation
    var timeline = this;
    var eventIndex = 0;
    var time = 0.0;

    // create an animation
    var anim = function(step: Float): Bool {
      var frame = Math.floor((time += step) * timeline.fps % timeline.duration);

      // signal events that have been passed
      if (timeline.events.length > 0) {
        while (timeline.events[eventIndex].frame <= frame + 1) {
          onevent(timeline.events[eventIndex++].event);

          // wrap if at the last event
          if (eventIndex == timeline.events.length) {
            eventIndex = 0;
            break;
          }
        }
      }

      return true;
    }

    // play the animation
    obj.rig.play(anim);
  }
}
