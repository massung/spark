// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.Vector;

typedef Key = {
  frame: Int,
  value: Float,
  ?tangent: Float,
};

enum InterpMethod {
  Step;
  Linear;
  Cubic;
}

class Tween {
  private var fps: Int;
  private var duration: Int;
  private var keys: Vector<Float>;

  // crunch soft keys from hard keys
  public function new(keys: Array<Key>, fps: Int, duration: Int, ?method: String = 'cubic') {
    var i = 0, k;

    // copy settings
    this.fps = fps;
    this.duration = duration;
    this.keys = new Vector<Float>(duration);

    // sort the hard keys by frame
    keys.sort(function(a, b) return a.frame - b.frame);

    // find the first key that is usable
    while(i < keys.length - 1 && keys[i + 1].frame < 1) i++;

    // remove unnecessary hard keys and create a tangents array
    var hks = keys.slice(i);
    var tangent = new Vector(hks.length);

    // calculate tangents for hard keys that don't have any
    for(i in 1...hks.length - 1) {
      if (hks[i].tangent != null) {
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
    for(i in 1...this.duration + 1) {
      var n = hks[0];

      // if this frame has reached the next key, set the value
      if (i == n.frame) {
        this.keys[i - 1] = n.value;

        // remove the hard key, p and n shift
        p = hks.shift();
      }

      else {
        switch (method) {

          // step interpolation keeps the previous hard key's value
          case 'step':
            this.keys[i - 1] = p.value;

          // linear interpolation between previous and next hard keys
          case 'linear':
            this.keys[i - 1] = Util.lerp(p.value, n.value, i - p.frame, n.frame - p.frame);

          // cubic interpolation uses a hermite spline
          case 'cubic':
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
            var t0 = Util.degToRad(tangent[p.frame] == null ? 0 : tangent[p.frame]);
            var t1 = Util.degToRad(tangent[n.frame] == null ? 0 : tangent[n.frame]);

            // calculate the value
            this.keys[i - 1] = (h0 * p0) + (h1 * p1) + (h2 * t0) + (h3 * t1);
        }
      }
    }
  }

  // create an animation instance for a specific property
  public function playOn(obj: Rig, property: String, ?loop: Bool = false) {
    var path = property.split('.');
    var key = path.pop();
    var rig = obj;

    // traverse the rest of the path to get the final object
    while(path.length > 0) {
      obj = Reflect.field(obj, path.shift());

      if (obj == null) {
        throw 'Cannot find property "' + property + '" on object';
      }
    }

    // lexical data for the animation
    var tween = this;
    var time = 0.0;

    // create the animation function
    var anim = function(step: Float): Bool {
      var frame = Math.floor((time += step) * tween.fps);
      var shouldStop = false;

      // clamp or wrap the frame
      if (frame >= tween.duration) {
        shouldStop = !loop;

        if (!shouldStop) {
          time %= cast(tween.duration, Float) / tween.fps;

          // wrap the frame
          frame = Math.floor(time * tween.fps);
        }

        // clamp on the last frame
        else frame = tween.duration - 1;
      }

      // update the property to the current frame
      Reflect.setProperty(obj, key, tween.keys[frame]);

      return shouldStop;
    };

    // play it on the rigging
    rig.play(anim);
  }
}
