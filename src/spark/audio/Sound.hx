// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.audio;

class Sound extends Asset {
  private var buffer: js.html.audio.AudioBuffer;

  // load an audio asset
  public function new(src: String) {
    super(src);

    Spark.loadXHR(src, js.html.XMLHttpRequestResponseType.ARRAYBUFFER, function(req) {
      Spark.audio.decodeAudioData(req.response, function(buffer) {
        this.buffer = buffer;
        this.loaded = true;
      });
    });
  }

  // create a source buffer for this sound
  public function createSource(): js.html.audio.AudioBufferSourceNode {
    if (this.loaded == false) {
      return null;
    }

    var source = Spark.audio.createBufferSource();

    // link to the buffer and global context
    source.buffer = this.buffer;
    source.connect(Spark.audio.destination);

    return source;
  }

  // play a single instance of the sound
  public function woof(id: String): js.html.audio.AudioBufferSourceNode {
    var source = this.createSource();

    if (source != null) {
      source.start();
    }

    return source;
  }

  // play a looping version of the source
  public function loop(id: String): js.html.audio.AudioBufferSourceNode {
    var source = this.createSource();

    if (source != null) {
      source.loop = true;
      source.start();
    }

    return source;
  }
}
