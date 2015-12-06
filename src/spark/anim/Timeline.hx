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
  tracks: Array<{
    field: String,
    keys: Array<Tween.Key>,
    tween: Tween,
  }>,
}

class Timeline extends Asset {
  private var data: TimelineData;

  // load a new timeline asset
  public function new(src: String) {
    super(src);

    // default settings
    this.data = {
      fps: 30,
      duration: 30,
      loop: false,
      tracks: [],
      events: [],
    }

    // load the JSON document with all the settings and tracks
    Spark.loadXML(src, function(doc: Xml) {
      var timeline = doc.firstElement();

      if (timeline == null || timeline.nodeName != 'timeline') {
        throw 'Invalid timeline XML: ' + src;
      }

      // merge the timeline settings
      Util.mergeAtt(this.data, 'fps', timeline, TInt);
      Util.mergeAtt(this.data, 'duration', timeline, TInt);
      Util.mergeAtt(this.data, 'loop', timeline, TBool);

      // find all the events
      for(events in timeline.elementsNamed('events')) {
        for(event in events.elementsNamed('event')) {
          var frame = event.get('frame');
          var name = event.get('name');

          // drop the eventif there's no frame or name
          if (frame == null || name == null) {
            continue;
          }

          // add the event to the timeline
          this.data.events.push({ frame: Std.parseInt(frame), event: name });
        }
      }

      // sort all the events by their frame #
      this.data.events.sort(function(a, b) return a.frame - b.frame);

      // find all the tracks and keys
      for(tracks in timeline.elementsNamed('tracks')) {
        for(track in tracks.elementsNamed('track')) {
          var field = track.get('field');
          var method = track.get('method');
          var keys = [];

          // drop the track if there's no field
          if (field == null) continue;

          // if no method is specified, use cubic
          if (method == null) method = 'cubic';

          // collect all the keys for the track
          for(key in track.elementsNamed('key')) {
            var frame = key.get('frame');
            var value = key.get('value');

            // drop keys with no frame or value
            if (frame == null || value == null) continue;

            // add the key to the track
            keys.push({ frame: Std.parseInt(frame), value: Std.parseFloat(value) });
          }

          // crunch the tween and add it to the track list
          this.data.tracks.push({
            field: field,
            keys: keys,
            tween: new Tween(keys, this.data.fps, this.data.duration, method),
          });
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
    for(track in this.data.tracks) {
      track.tween.playOn(obj, track.field, this.data.loop);
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
