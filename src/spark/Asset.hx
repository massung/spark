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
  public function isLoaded() return this.loaded;

  // called once all assets are loaded
  public function onload() return;

  // return an asset class reference from a filename using its extension
  static public function classOfExt(ext: String): Class<Asset> {
    switch(ext.toLowerCase()) {

      // sounds
      case 'aiff': return spark.audio.Sound;
      case 'au':   return spark.audio.Sound;
      case 'mid':  return spark.audio.Sound;
      case 'midi': return spark.audio.Sound;
      case 'mp3':  return spark.audio.Sound;
      case 'ogg':  return spark.audio.Sound;
      case 'snd':  return spark.audio.Sound;
      case 'wav':  return spark.audio.Sound;
      case 'wave': return spark.audio.Sound;

      // textures
      case 'bmp':  return spark.graphics.Texture;
      case 'exif': return spark.graphics.Texture;
      case 'gif':  return spark.graphics.Texture;
      case 'ico':  return spark.graphics.Texture;
      case 'jpeg': return spark.graphics.Texture;
      case 'jpg':  return spark.graphics.Texture;
      case 'png':  return spark.graphics.Texture;
      case 'tga':  return spark.graphics.Texture;
      case 'tif':  return spark.graphics.Texture;
      case 'tiff': return spark.graphics.Texture;

      // fonts
      case 'fnt':  return spark.graphics.Font;
      case 'otf':  return spark.graphics.Font;
      case 'ttf':  return spark.graphics.Font;
    }

    return null;
  }
}
