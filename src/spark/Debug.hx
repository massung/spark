// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark;

typedef Stats = {
  layers: Int,
  sprites: Int,
  fps: Float,
}

@:expose
class Debug {
  static private var flags: Int = 0;

  // various flags that can be enabled/disabled
  static public var PERF: Int = 1 << 0;
  static public var COLLISION: Int = 1 << 1;
  static public var ALL: Int = 0xFFFF;

  // performance time sampling
  static private var updateTime: Float = 0;
  static private var collisionTime: Float = 0;
  static private var drawTime: Float = 0;
  static private var guiTime: Float = 0;

  // performance trace is rendered to an offscreen canvas
  static private var perfCanvas: js.html.CanvasElement = null;
  static private var perfView: js.html.CanvasRenderingContext2D = null;

  // initialize the debug module
  static public function init() {
    perfCanvas = js.Browser.document.createCanvasElement();

    if (perfCanvas != null) {
      perfCanvas.width = Spark.canvas.width;
      perfCanvas.height = 200;

      // get the render context
      perfView = perfCanvas.getContext2d();
    }
  }

  // start/stop debugging of various systems
  static public function enable(?flag: Int = 1) flags |= flag;
  static public function disable(?flag: Int = 0xFFFF) flags &= ~flag;

  // true if debugging has been enabled
  static public function isEnabled(flag: Int): Bool return (flags & flag) != 0;

  // track how much time the update phase takes
  static public function beginUpdate() updateTime = js.Browser.window.performance.now();
  static public function endUpdate() updateTime = js.Browser.window.performance.now() - updateTime;

  // track how much time the collision phase takes
  static public function beginCollision() collisionTime = js.Browser.window.performance.now();
  static public function endCollision() collisionTime = js.Browser.window.performance.now() - collisionTime;

  // track how much time the draw phase takes
  static public function beginDraw() drawTime = js.Browser.window.performance.now();
  static public function endDraw() drawTime = js.Browser.window.performance.now() - drawTime;

  // track how much time the gui phase takes
  static public function beginGui() guiTime = js.Browser.window.performance.now();
  static public function endGui() guiTime = js.Browser.window.performance.now() - guiTime;

  // render the performance trace
  static public function drawPerf(frame: Int, ?stats: Stats) {
    if (perfView == null || !isEnabled(PERF)) {
      return;
    }

    // resize the offscreen canvas if necessary
    if (perfCanvas.width != Spark.canvas.width) {
      perfCanvas.width = Spark.canvas.width;
    }

    // get the size of the trace
    var w = perfCanvas.width;
    var h = perfCanvas.height;

    // scroll and wrap the performance trace
    var x = (frame % (w / 2)) * 2;
    var y = h / 2;

    // determine the vertical slice of time spent in update
    var updateY = Math.round(updateTime * 60 * y / 1000);
    var collisionY = Math.round(collisionTime * 60 * y / 1000);
    var drawY = Math.round(drawTime * 60 * y / 1000);
    var guiY = Math.round(guiTime * 60 * y / 1000);

    // clear an area around and ahead of this slice
    perfView.clearRect(x, 0, 10, h);

    // a nice blue for update time
    perfView.lineWidth = 2;
    perfView.fillStyle = '#000';
    perfView.strokeStyle = '#66b2ff';
    perfView.beginPath();
    perfView.moveTo(x, h);
    perfView.lineTo(x, h - updateY);
    perfView.stroke();

    // Purple for collision time.
    perfView.strokeStyle = '#c354ff';
    perfView.beginPath();
    perfView.moveTo(x, h - updateY);
    perfView.lineTo(x, h - updateY - collisionY);
    perfView.stroke();

    // Green for draw time.
    perfView.strokeStyle = '#2dffb2';
    perfView.beginPath();
    perfView.moveTo(x, h - updateY - collisionY);
    perfView.lineTo(x, h - updateY - collisionY - drawY);
    perfView.stroke();

    // Pink for gui time.
    perfView.strokeStyle = '#fa5882';
    perfView.beginPath();
    perfView.moveTo(x, h - updateY - collisionY - drawY);
    perfView.lineTo(x, h - updateY - collisionY - drawY - guiY);
    perfView.stroke();

    // Draw a gray line at the 60 FPS mark.
    perfView.strokeStyle = '#333';
    perfView.beginPath();
    perfView.moveTo(0, y);
    perfView.lineTo(w, y);
    perfView.stroke();

    // Blit the performance canvas onto the spark canvas.
    Spark.view.save();
    Spark.view.setTransform(1, 0, 0, 1, 0, 0);
    Spark.view.drawImage(perfCanvas, 0, Spark.canvas.height - h);

    // show the legend
    Spark.view.font = 'bold 10px "Courier New", sans-serif';

    // show timings in milliseconds for gui, draw, update, collision
    Spark.view.fillStyle = '#66b2ff';
    Spark.view.fillText('Update    : ' + Util.flToStr(updateTime, 3) + 'ms', 10, Spark.canvas.height - y - 24);
    Spark.view.fillStyle = '#c354ff';
    Spark.view.fillText('Collision : ' + Util.flToStr(collisionTime, 3) + 'ms', 10, Spark.canvas.height - y - 36);
    Spark.view.fillStyle = '#2dffb2';
    Spark.view.fillText('Draw      : ' + Util.flToStr(drawTime, 3) + 'ms', 10, Spark.canvas.height - y - 48);
    Spark.view.fillStyle = '#fa5882';
    Spark.view.fillText('GUI       : ' + Util.flToStr(guiTime, 3) + 'ms', 10, Spark.canvas.height - y - 60);

    // show stats if provided
    if (stats != null) {
      Spark.view.fillStyle = '#ccc';
      Spark.view.fillText('FPS       : ' + Util.flToStr(stats.fps, 1), 10, Spark.canvas.height - y - 2);

      // all the other stats are above the legend
      Spark.view.fillStyle = '#ff8000';
      Spark.view.fillText('Layers    : ' + stats.layers, 10, Spark.canvas.height - y - 96);
      Spark.view.fillText('Sprites   : ' + stats.sprites, 10, Spark.canvas.height - y - 84);
    }
  }
}
