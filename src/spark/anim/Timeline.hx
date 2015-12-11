// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.StringMap;

typedef Event = {
  frame: Int,
  event: String,
}

typedef Track = {
  field: String,
  curve: Curve,
}

class Timeline extends Asset {
  private var fps: Int;
  private var duration: Int;
  private var events: Array<Event>;
  private var tracks: Array<Track>;

  // load a new timeline asset
  public function new(src: String) {
    super(src);

    // default settings
    this.fps = 30;
    this.duration = 30;
    this.tracks = [];
    this.events = [];

    // load the JSON document with all the settings and tracks
    Spark.loadXML(src, function(doc: Xml) {
      var timeline = doc.firstElement();

      if (timeline == null || timeline.nodeName != 'timeline') {
        throw 'Invalid timeline XML: ' + src;
      }

      // merge the timeline settings
      Util.mergeAtt(this, 'fps', timeline, TInt);
      Util.mergeAtt(this, 'duration', timeline, TInt);

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
          this.events.push({ frame: Std.parseInt(frame), event: name });
        }
      }

      // sort all the events by their frame #
      this.events.sort(function(a, b) return a.frame - b.frame);

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
          this.tracks.push({ field: field, curve: new Curve(keys, this.fps, this.duration, method), });
        }
      }

      // the timeline is now loaded
      this.loaded = true;
    });
  }

  // create an instance of the timeline for a given object
  public function newSequence(obj: Dynamic, ?onevent: String -> Void, mode: Sequence.PlayMode, loop: Bool): Sequence {
    var seqs = [for(track in this.tracks) track.curve.newSequence(obj, track.field, mode, loop)];
    var eventIndex = 0;

    // create the sequence, which updates all the track sequences
    return new Sequence(this.fps, this.duration, Forward, loop, function(frame: Int, step: Float) {
      for(seq in seqs) {
        seq.update(step);
      }

      // signal events that have been passed
      while (this.events.length > 0 && this.events[eventIndex].frame <= frame + 1) {
        onevent(this.events[eventIndex++].event);

        // wrap if at the last event
        if (eventIndex == this.events.length) {
          eventIndex = 0;
          break;
        }
      }
    });
  }
}
