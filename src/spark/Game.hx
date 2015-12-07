// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

import spark.anim.*;
import spark.audio.*;
import spark.graphics.*;

@:expose
class Game {
  static public var project: Project;
  static public var scene: Scene;

  // create the project, load it, and issue callback
  static public function main(projectFile: String, onload: Project -> Void) {
    project = new Project(projectFile, onload);
    scene = null;
  }
}
