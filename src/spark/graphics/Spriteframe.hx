// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

class Spriteframe extends Asset implements Quad {
  private var r: Rect;
  private var p: Vec;

  // the source texture to blit from
  private var texture: Texture;

  // create a new sprite frame resource
  public function new(texture: Texture, x: Int, y: Int, w: Int, h: Int, px: Float, py: Float) {
    super(texture.source);

    // source texture to blit from
    this.texture = texture;

    // create the quad and pivot vector
    this.r = new Rect(x, y, w, h);
    this.p = new Vec(px, py);

    // there's nothing to load
    this.loaded = true;
  }

  // blit the quad of this sprite
  public function draw() this.texture.drawq(this.r, this.p);

  // get the quad for this sprite
  public function getRect(): Rect return this.r;

  // get the pivot point for this sprite
  public function getPivot(): Vec return this.p;
}
