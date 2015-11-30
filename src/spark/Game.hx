// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

typedef GameCallback = Game -> Void;

@:expose
class Game {
  private var path: String;
  private var assetPath: String;
  private var title: String;
  private var version: Float;

  // game objects can only be constructed with the launch() function
  private function new(projectFile: String) {
    this.path = projectFile.split('/').slice(0, -1).join('/') + '/';
  }

  // load a project and run with a new game instance
  static public function launch(projectFile: String, callback: GameCallback) {
    var game = new Game(projectFile);

    // issue a load request for the JSON file
    new Asset.JSONAsset(projectFile, function(json: Dynamic) {
      game.title = cast json.title;
      game.version = cast json.version;
      game.assetPath = cast json.assetPath;

      // TODO: fill out more game settings

      // start the game
      callback(game);
    });
  }

  // load a new texture
  public function newTexture(src: String): Texture {
    return new Texture(this.path + this.assetPath + src);
  }
}
