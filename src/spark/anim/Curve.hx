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

class Curve {
  private var fps: Int;
  private var duration: Int;
  private var keys: Vector<Float>;

  // crunch soft keys from hard keys
  public function new(keys: Array<Key>, fps: Int, duration: Int, ?method: String = 'cubic') {
    var i = 0, k;

    // copy settings
    this.fps = fps;
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
    for(i in 1...duration + 1) {
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

  // create a new sequence on a given object
  public function newSequence(obj: Dynamic, property: String, mode: Sequence.PlayMode, loop: Bool): Sequence {
    var path = property.split('.');
    var field = path.pop();

    // traverse the rest of the path to get the final object
    while(path.length > 0) {
      if ((obj = Reflect.field(obj, path.shift())) == null) {
        return null;
      }
    }

    // create the sequence for this property
    return new Sequence(this.fps, this.keys.length, mode, loop, function(frame, step) {
      Reflect.setField(obj, field, this.keys[frame]);
    });
  }
}
