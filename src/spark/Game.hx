// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.anim.*;
import spark.audio.*;
import spark.graphics.*;
import spark.object.*;

@:expose
class Game {

  // assets can access the project o load and register dependencies
  static public var project: Project;

  // the scene object is allowed to modify this value
  static public var scene: Scene;

  // create the project, load it, and issue callback
  static public function main(projectFile: String, onload: Project -> Void) {
    project = new Project(projectFile, onload);
    scene = null;
  }

  // get the current scene object
  static public function getScene(): Scene return scene;
}
