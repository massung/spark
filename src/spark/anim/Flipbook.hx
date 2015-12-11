// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.anim;

import haxe.ds.StringMap;
import haxe.ds.Vector;

import spark.graphics.*;
import spark.object.*;

typedef Anim = {
  frame: Int,
  length: Int,
}

class Flipbook extends Asset {
  private var texture: Texture;

  // size of each sprite
  private var spriteWidth: Int;
  private var spriteHeight: Int;

  // attributes for sheet and animations
  private var border: Int;
  private var fps: Int;

  // animation mapping
  private var anims: StringMap<Anim>;

  // a vector of all the frames in the book
  private var frames: Vector<Spriteframe>;

  // load a new texture atlas and all textures it references
  public function new(src: String) {
    super(src);

    // defaults
    this.border = 0;
    this.fps = 30;

    // load the XML source file, which will issue a load for a texture
    Spark.loadXML(src, function(doc: Xml) {
      var sheet: Xml = doc.firstElement();

      if (sheet == null || sheet.nodeName != 'flipbook') {
        throw 'Invalid Flipbook XML: ' + src;
      }

      // make sure there's an image to load, and size per sprite
      if (!sheet.exists('texture')) throw 'No texture for sprite sheet: ' + src;
      if (!sheet.exists('width')) throw 'No width in sprite sheet: ' + src;
      if (!sheet.exists('height')) throw 'No height in sprite sheet: ' + src;

      // lookup the texture filename
      var textureFile = sheet.get('texture');
      var texturePath = Util.relativePath(src, textureFile);

      // issue a load for the texture
      this.texture = cast Game.project.load(textureFile, texturePath, Texture);

      // set the size of each sprite frame
      this.spriteWidth = Std.parseInt(sheet.get('width'));
      this.spriteHeight = Std.parseInt(sheet.get('height'));

      // optional attributes
      Util.mergeAtt(this, 'border', sheet, TInt);
      Util.mergeAtt(this, 'fps', sheet, TInt);

      // loop over all the sprites and create them
      for(anim in sheet.elementsNamed('anim')) {
        var name = anim.get('name');
        var frame = anim.get('frame');
        var length = anim.get('length');

        // these fields are required for each animation
        if (name == null) continue;
        if (frame == null) continue;
        if (length == null) continue;

        // create the new animation
        this.anims.set(name, {
          frame: Std.parseInt(frame),
          length: Std.parseInt(length),
        });
      }

      this.loaded = true;
    });
  }

  // called once all assets are loaded
  public override function onload() {
    var iw = cast(this.texture.getRect().getWidth(), Int);
    var ih = cast(this.texture.getRect().getHeight(), Int);

    // calculate the number of sprites in either direction
    var spritesWide: Int = Math.floor((iw - this.border) / (this.spriteWidth + this.border * 2));
    var spritesHigh: Int = Math.floor((ih - this.border) / (this.spriteHeight + this.border * 2));

    // allocate all the sprite frames
    this.frames = new Vector<Spriteframe>(spritesWide * spritesHigh);

    // calculate the indentation for each sprite
    var w = this.spriteWidth + this.border;
    var h = this.spriteHeight + this.border;

    // create frames for all the sprites
    for(y in 0...spritesHigh) {
      for(x in 0...spritesWide) {
        var ox = this.spriteWidth * x + this.border * (x + 1);
        var oy = this.spriteHeight * y + this.border * (y + 1);

        // create the frame for this sprite in the animation
        this.frames[y * spritesWide + x] = new Spriteframe(this.texture, ox, oy, this.spriteWidth, this.spriteHeight, 0.5, 0.5);
      }
    }
  }

  // create an instance of the timeline for a given object
  public function newSequence(sprite: Sprite, n: String, ?loop: Bool = false): Sequence {
    var anim = this.anims.get(n);

    // make sure the animation exists
    if (anim == null) {
      return null;
    }

    // create the animation
    return new Sequence(this.fps, anim.length, Forward, loop, function(frame: Int, step: Float) {
      sprite.setQuad(this.frames[frame], false);
    });
  }
}
