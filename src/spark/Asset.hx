// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

class Asset {
  private var source: String;
  private var loaded: Bool;

  // create a new asset request
  public function new(src: String) {
    this.source = src;
    this.loaded = false;
  }

  // true once the loaded flag has been set
  public function isLoaded(): Bool {
    return this.loaded;
  }
}
