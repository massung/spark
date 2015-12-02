// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

@:expose
class Game {
  static private var project: Project;

  // create the project, load it, and issue callback
  static public function main(projectFile: String, onload: Project -> Void) {
    project = new Project(projectFile, onload);
  }

  // project accessor function
  static public function getProject(): Project return project;

  // quick lookups of various asset types in the project
  static public function getEmitter(src: String): spark.graphics.Emitter return cast project.get(src);
  static public function getFont(src: String): spark.graphics.Font return cast project.get(src);
  static public function getSound(src: String): spark.audio.Sound return cast project.get(src);
  static public function getTexture(src: String): spark.graphics.Texture return cast project.get(src);
  static public function getTimeline(src: String): spark.anim.Timeline return cast project.get(src);
}
