// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.graphics;

import haxe.ds.StringMap;

class Atlas extends Asset {
  private var texture: Texture;

  // load a new texture atlas and all textures it references
  public function new(src: String) {
    super(src);

    // load the XML source file, which will issue a load for a texture
    Spark.loadXML(src, function(doc: Xml) {
      var atlas: Xml = doc.firstElement();

      if (atlas == null || atlas.nodeName != 'TextureAtlas') {
        throw 'Invalid Atlas XML: ' + src;
      }

      // make sure there's an image to load
      if (!atlas.exists('imagePath')) {
        throw 'No imagePath for atlas: ' + src;
      }

      var textureFile = atlas.get('imagePath');
      var texturePath = Util.relativePath(src, textureFile);

      // issue a load for the texture
      this.texture = cast Game.project.load(textureFile, texturePath, Texture);

      // loop over all the sprites and create them
      for(sprite in atlas.elementsNamed('sprite')) {
        var x = Std.parseInt(sprite.get('x'));
        var y = Std.parseInt(sprite.get('y'));
        var w = Std.parseInt(sprite.get('w'));
        var h = Std.parseInt(sprite.get('h'));

        // drop the sprite if no name or bounding area
        if (!sprite.exists('n') || x == null || y == null || w == null || h == null) {
          continue;
        }

        // read the pivot
        var px = Std.parseFloat(sprite.get('pX'));
        var py = Std.parseFloat(sprite.get('pY'));

        // default to the center if no pivot set
        if (px == null) px = 0.5;
        if (py == null) py = px;

        // create the frame
        var frame = new Spriteframe(this.texture, x, y, w, h, px, py);

        // register the sprite as an asset
        Game.project.register(sprite.get('n'), frame);
      }

      this.loaded = true;
    });
  }
}
