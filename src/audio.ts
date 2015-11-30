// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {
  var context: AudioContext;

  // initialize the global audio context
  export function initAudio() {
    context = new AudioContext();
  }

  // an individual sound
  export class Clip extends XHRAsset {

    // load the clip
    constructor(src: string) {
      super(src, 'arraybuffer', req => {
        context.decodeAudioData(req.response, buffer => {
          this.data = buffer;
        });
      });
    }

    // play a single iteration of this sound
    woof(): AudioBufferSourceNode {
      if (!this.data) {
        return null;
      }

      var source = context.createBufferSource();

      // link and play
      source.buffer = this.data;
      source.connect(context.destination);
      source.start();

      return source;
    }

    // play this clip looping
    play(): AudioBufferSourceNode {
      if (!this.data) {
        return null;
      }

      var source = context.createBufferSource();

      // link and play
      source.buffer = this.data;
      source.loop = true;
      source.connect(context.destination);
      source.start();

      return source;
    }
  }
}
