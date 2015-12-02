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
  static private var enabled: Bool = false;

  // performance time sampling
  static private var updateTime: Float = 0;
  static private var collisionTime: Float = 0;
  static private var drawTime: Float = 0;
  static private var guiTime: Float = 0;

  // performance trace is rendered to an offscreen canvas
  static private var traceCanvas: js.html.CanvasElement = null;
  static private var traceView: js.html.CanvasRenderingContext2D = null;

  // start debugging
  static public function enable(): Bool {
    traceCanvas = js.Browser.document.createCanvasElement();
    if (traceCanvas != null) {
      traceCanvas.width = Spark.canvas.width;
      traceCanvas.height = 200;

      // get the render context
      traceView = traceCanvas.getContext2d();
    }

    // true only if the canvas was created and the view valid
    return enabled = (traceView != null);
  }

  // stop debugging - keep the canvas and view created
  static public function disable() enabled = false;

  // true if debugging has been enabled
  static public function isEnabled(): Bool return enabled;

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
    if (enabled == false || traceView == null) {
      return;
    }

    // resize the offscreen canvas if necessary
    if (traceCanvas.width != Spark.canvas.width) {
      traceCanvas.width = Spark.canvas.width;
    }

    // get the size of the trace
    var w = traceCanvas.width;
    var h = traceCanvas.height;

    // scroll and wrap the performance trace
    var x = (frame % (w / 2)) * 2;
    var y = h / 2;

    // determine the vertical slice of time spent in update
    var updateY = Math.round(updateTime * 60 * y / 1000);
    var collisionY = Math.round(collisionTime * 60 * y / 1000);
    var drawY = Math.round(drawTime * 60 * y / 1000);
    var guiY = Math.round(guiTime * 60 * y / 1000);

    // clear an area around and ahead of this slice
    traceView.clearRect(x, 0, 10, h);

    // a nice blue for update time
    traceView.lineWidth = 2;
    traceView.fillStyle = '#000';
    traceView.strokeStyle = '#66b2ff';
    traceView.beginPath();
    traceView.moveTo(x, h);
    traceView.lineTo(x, h - updateY);
    traceView.stroke();

    // Purple for collision time.
    traceView.strokeStyle = '#c354ff';
    traceView.beginPath();
    traceView.moveTo(x, h - updateY);
    traceView.lineTo(x, h - updateY - collisionY);
    traceView.stroke();

    // Green for draw time.
    traceView.strokeStyle = '#2dffb2';
    traceView.beginPath();
    traceView.moveTo(x, h - updateY - collisionY);
    traceView.lineTo(x, h - updateY - collisionY - drawY);
    traceView.stroke();

    // Pink for gui time.
    traceView.strokeStyle = '#fa5882';
    traceView.beginPath();
    traceView.moveTo(x, h - updateY - collisionY - drawY);
    traceView.lineTo(x, h - updateY - collisionY - drawY - guiY);
    traceView.stroke();

    // Draw a gray line at the 60 FPS mark.
    traceView.strokeStyle = '#333';
    traceView.beginPath();
    traceView.moveTo(0, y);
    traceView.lineTo(w, y);
    traceView.stroke();

    // Blit the performance canvas onto the spark canvas.
    Spark.view.save();
    Spark.view.setTransform(1, 0, 0, 1, 0, 0);
    Spark.view.drawImage(traceCanvas, 0, Spark.canvas.height - h);

    // show the legend
    Spark.view.font = 'bold 10px "Courier New", sans-serif';

    // show timings in milliseconds for gui, draw, update, collision
    Spark.view.fillStyle = '#66b2ff';
    Spark.view.fillText('Update    : ' + Util.flToStr(updateTime, 1) + 'ms', 10, Spark.canvas.height - y - 24);
    Spark.view.fillStyle = '#c354ff';
    Spark.view.fillText('Collision : ' + Util.flToStr(collisionTime, 1) + 'ms', 10, Spark.canvas.height - y - 36);
    Spark.view.fillStyle = '#2dffb2';
    Spark.view.fillText('Draw      : ' + Util.flToStr(drawTime, 1) + 'ms', 10, Spark.canvas.height - y - 48);
    Spark.view.fillStyle = '#fa5882';
    Spark.view.fillText('GUI       : ' + Util.flToStr(guiTime, 1) + 'ms', 10, Spark.canvas.height - y - 60);

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
