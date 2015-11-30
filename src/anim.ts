// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // supported tween interpolation methods
  export enum Interpolation {
    LINEAR,
    STEP,
    CUBIC,
  }

  // an animation behavior function
  export type AnimInstance = (step: number) => boolean;

  // timelined events in an animation
  export type EventCallback = (event: string) => void;

  // anything that can be animated supports the rig interface
  export class Rig {
    anims: AnimInstance[];

    // create a new animation play rig
    constructor() {
      this.anims = [];
    }

    // add an animation instance to the rig
    play(instance: AnimInstance) {
      this.anims.push(instance);
    }

    // remove an animation instance from the rig
    stop(instance: AnimInstance) {
      var i = this.anims.indexOf(instance);

      if (i >= 0) {
        var last = this.anims.pop();

        // swap with last
        if (i < this.anims.length) {
          this.anims[i] = last;
        }
      }
    }

    // advance all the animation behaviors
    update(step: number) {
      var i;

      // advance all the animations
      for (i = 0;i < this.anims.length;) {
        if (this.anims[i](step)) {
          var last = this.anims.pop();

          // swap with last - remove from set
          if (i < this.anims.length) {
            this.anims[i] = last;
          }
        } else {
          i++;
        }
      }
    }
  }

  // keyframed animation of a single value
  export class Tween {
    private fps: number;
    private duration: number;
    private keys: number[];

    // crunch soft keys from hard keys
    constructor(keys: any[], fps: number, duration: number, interp: Interpolation) {
      var i, k, hks, tangent;

      // copy settings
      this.fps = fps;
      this.duration = duration;
      this.keys = new Array(duration);

      // sort the hard keys by frame
      keys.sort((a, b) => { return a.frame - b.frame; });

      // find the first key that is usable
      for (i = 0;i < keys.length - 1 && keys[i + 1].frame < 1;i++);

      // remove unnecessary hard keys and create a tangents array
      hks = keys.slice(i);
      tangent = new Array(hks.length);

      // calculate tangents for hard keys that don't have any
      for (i = 1;i < hks.length - 1;i++) {
        if (hks[i].tangent) {
          tangent[i] = hks[i].tangent;
        } else {
          var pk = hks[i - 1];
          var tk = hks[i];
          var nk = hks[i + 1];

          // calculate the slopes to the previous and next keys
          var dtp = (tk.value - pk.value) / (tk.frame - pk.frame);
          var dtn = (nk.value - tk.value) / (nk.frame - tk.frame);

          // calculate a linear tangent between them
          tangent[i] = (dtp + dtn) / 2;
        }
      }

      // if the first key is before the first frame, it is the previous key
      var p = (hks[0].frame < 1) ? hks.shift() : hks[0];

      // loop and calculate the soft keys for the entire tween
      for (i = 1;i <= duration;i++) {
        var n = hks[0];

        // if this frame has reached the next key, set the value
        if (i == n.frame) {
          this.keys[i - 1] = n.value;

          // remove the hard key, p and n shift
          p = hks.shift();
        }

        else {
          switch (interp) {

            // step interpolation keeps the previous hard key's value
            case Interpolation.STEP:
              this.keys[i - 1] = p.value;
              break;

            // linear interpolation between previous and next hard keys
            case Interpolation.LINEAR:
              this.keys[i - 1] = lerp(p.value, n.value, i - p.frame, n.frame - p.frame);
              break;

            // cubic interpolation uses a hermite spline
            case Interpolation.CUBIC:
              var u = (i - p.frame) / (n.frame - p.frame);

              // get the hermite blending values
              var h0 = (u * u * u * 2) - (u * u * 3) + 1;
              var h1 = (u * u * u * -2) + (u * u * 3);
              var h2 = (u * u * u) - (u * u * 2) + u;
              var h3 = (u * u * u) - (u * u);

              // get the value of this key and the next key
              var p0 = p.value;
              var p1 = n.value;

              // assume linear tangents between points
              var t0 = degToRad(tangent[p.frame] || 0.0);
              var t1 = degToRad(tangent[n.frame] || 0.0);

              // calculate the value
              this.keys[i - 1] = (h0 * p0) + (h1 * p1) + (h2 * t0) + (h3 * t1);
              break;
          }
        }
      }
    }

    // create an animation instance for a specific property
    instantiate(obj: Object, property: string, loop?: boolean): AnimInstance {
      var path = property.split('.');

      // the last element of the path is the actual property
      var key = path.pop();

      // traverse the rest of the path to get the final object
      while (path.length > 0) {
        if (!(obj = obj[path.shift()])) {
          throw 'Cannot find property "' + property + '" on object!';
        }
      }

      // get the initial value of the property
      //var initialValue = obj[key];

      // create a animation instance behavior
      return (function(step) {
        var frame = Math.floor((this.time += step) * this.tween.fps);
        var shouldStop = false;

        // clamp or wrap the frame
        if (frame >= this.tween.duration) {
          shouldStop = !loop;

          if (!shouldStop) {
            this.time %= this.tween.duration / this.tween.fps;

            // wrap the frame
            frame = Math.floor(this.time * this.tween.fps);
          }

          // not looping, clamp on the last frame
          else frame = this.tween.duration - 1;
        }

        // update the property to the current frame
        obj[key] = this.tween.keys[frame];

        return shouldStop;
      }).bind({ tween: this, time: 0 });
    }
  }

  // a timeline rigs many tweens and events on the same object
  export class Timeline extends JSONAsset {
    tracks: Object;
    events: any[];
    fps: number;
    duration: number;
    loop: boolean;

    // load a new timeline asset
    constructor(src: string) {
      super(src, json => {
        this.fps = json.fps || 30;
        this.duration = json.duration || 30;
        this.loop = json.loop || false;
        this.events = json.events || [];
        this.tracks = json.tracks || {};

        // sort all the events by frame
        this.events.sort((a,b) => { return (a.frame - b.frame); });

        // crunch each of the tracks as a tween
        for (var t in this.tracks) {
          var keys = this.tracks[t].keys;
          var interpolation = this.tracks[t].interpolation || Interpolation.CUBIC;

          // crunch the tween over the track description
          this.tracks[t] = new Tween(keys, this.fps, this.duration, interpolation);
        }
      });
    }

    // create an instance of the timeline for a given object
    instantiate(obj: Object, onevent?: EventCallback): AnimInstance {
      var rig = new Rig();

      // add all tween intances to the rig
      for (var track in this.tracks) {
        rig.play(this.tracks[track].instantiate(obj, track, this.loop));
      }

      // create an animation instance behavior
      return (function(step) {
        var frame = Math.floor((this.time += step) * this.timeline.fps % this.timeline.duration);

        // signal events that have been passed
        if (this.timeline.events.length > 0) {
          while (this.timeline.events[this.eventIndex].frame <= frame + 1) {
            onevent(this.timeline.events[this.eventIndex++].event);

            // wrap if at the last event
            if (this.eventIndex == this.timeline.events.length) {
              this.eventIndex = 0;
              break;
            }
          }
        }

        // advance all the tweens
        rig.update(step);

        // stop if there are no animations left in the rig
        return rig.anims.length === 0;
      }).bind({
        timeline: this,
        time: 0,
        eventIndex: 0,
      });
    }
  }
}
