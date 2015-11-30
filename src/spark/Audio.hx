// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Audio extends Asset.XHRAsset {
  static private var context: js.html.audio.AudioContext;

  // the loaded buffer for sources to use
  private var buffer: js.html.audio.AudioBuffer;

  // load an audio asset
  public function new(src: String) {
    super(src, js.html.XMLHttpRequestResponseType.ARRAYBUFFER, function(req) {
      context.decodeAudioData(req.response, function(buffer) {
        this.buffer = buffer;
        this.loaded = true;
      });
    });
  }

  // initialize the global audio context
  static public function init() context = new js.html.audio.AudioContext();

  // create a source buffer for this sound
  public function createSource(): js.html.audio.AudioBufferSourceNode {
    if (this.loaded == false) {
      return null;
    }

    var source = context.createBufferSource();

    // link to the buffer and global context
    source.buffer = this.buffer;
    source.connect(context.destination);

    return source;
  }

  // play a single instance of the sound
  public function woof(): js.html.audio.AudioBufferSourceNode {
    var source = this.createSource();

    if (source != null) {
      source.start();
    }

    return source;
  }

  // play a looping version of the source
  public function loop(): js.html.audio.AudioBufferSourceNode {
    var source = this.createSource();

    if (source != null) {
      source.loop = true;
      source.start();
    }

    return source;
  }
}
