/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.input', 'spark.util');

// Base GUI element.
__MODULE__.Widget = function(value, contextSettings) {
  this.contextSettings = contextSettings || {};

  // Every widget has a value to display.
  this.value = value;
  this.visible = true;

  // Widgets are added to the scene at screen coordinates.
  this.x = 0;
  this.y = 0;
};

// A text label.
__MODULE__.Label = function(value, contextSettings) {
  spark.gui.Widget.call(this, value, contextSettings);
};

// A progress/health meter.
__MODULE__.Meter = function(value, max, contextSettings) {
  spark.gui.Widget.call(this, value, contextSettings);

  // Maximum value to clamp at.
  this.max = max;
};

// All widget subclasses.
__MODULE__.Label.prototype = Object.create(__MODULE__.Widget.prototype);
__MODULE__.Meter.prototype = Object.create(__MODULE__.Widget.prototype);

// Set constructors.
__MODULE__.Widget.prototype.constructor = __MODULE__.Widget;
__MODULE__.Label.prototype.constructor = __MODULE__.Label;
__MODULE__.Meter.prototype.constructor = __MODULE__.Meter;

// Every widget has an update called at the end of the frame.
__MODULE__.Widget.prototype.update = function() {};

// Wrapper to assign context settings, draw, and restore.
__MODULE__.Widget.prototype.withContext = function(draw) {
  spark.view.save();

  // Set all the view context settings for this widget.
  spark.util.merge(spark.view, this.contextSettings);

  // Perform the draw.
  draw();

  // Done.
  spark.view.restore();
};

// Render a text label.
__MODULE__.Label.prototype.draw = function() {
  var x = this.x < 0 ? (spark.view.canvas.width + this.x) : this.x;
  var y = this.y < 0 ? (spark.view.canvas.height + this.y) : this.y;

  // Draw the text.
  spark.view.fillText(this.value, this.x, this.y);
};

// Every widget has an update called at the end of the frame.
__MODULE__.Meter.prototype.update = function() {
  this.value = spark.util.clamp(this.value, 0, this.max);
};

// Render a meter bar.
__MODULE__.Meter.prototype.draw = function() {
  var pct = this.value / this.max;

  // Default width to max value and height.
  var w = this.width || this.max;
  var h = this.height || 10;

  // Negative offsets are fixed to the bottom/right.
  var x = this.x < 0 ? (spark.view.canvas.width + this.x - w) : this.x;
  var y = this.y < 0 ? (spark.view.canvas.height + this.y - h) : this.y;

  // Draw the inner bar and then the outer shell.
  spark.view.fillRect(x, y, w * pct, h);
  spark.view.strokeRect(x, y, w, h);
};
