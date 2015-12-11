// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.Vector;

typedef FrameCallback = Int -> Float -> Void;

enum PlayMode {
  Forward;
  Pingpong;
  Reverse;
}

class Sequence {
  private var time: Float;

  // set when this sequence should stop playing
  public var stop: Bool;

  // the rate at which the current frame advances
  private var fps: Int;
  private var duration: Int;
  private var loop: Bool;
  private var mode: PlayMode;
  private var onframe: FrameCallback;

  // create a new animation sequence
  public function new(fps: Int, duration: Int, mode: PlayMode, loop: Bool, onframe: FrameCallback) {
    this.fps = fps;
    this.duration = duration;
    this.loop = loop;
    this.mode = mode;
    this.onframe = onframe;
    this.time = 0;
    this.stop = false;
  }

  // returns the current time for this sequence
  public function getTime(): Float return this.time;

  // returns the current frame for this sequence
  public function getFrame(): Int {
    var frame = Math.floor(this.time * this.fps);

    // TODO: calculate frame based on play mode

    // wrap if looped past end of the sequence
    if (this.loop) {
      return frame % this.duration;
    }

    // clamp to the last frame
    return Math.floor(Math.min(frame, this.duration - 1));
  }

  // advance this sequence, let the callback perform an update
  public function update(step: Float) {
    this.time += step;

    // track when this sequence should stop
    if (!this.loop && this.time > this.duration / this.fps) {
      this.stop = true;
    }

    // execute the callback with the actor, frame, and time step
    if (!this.stop) {
      this.onframe(this.getFrame(), step);
    }
  }
}
