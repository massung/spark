/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.input', 'spark.util');

// Base GUI element.
__MODULE__.Widget = function(value, contextSettings) {
  this.contextSettings = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  // Overwrite draw settings.
  spark.util.merge(this.contextSettings, contextSettings);

  // Every widget has a value to display.
  this.value = value;
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

  // Default width to max value and height.
  this.contextSettings.width = this.contextSettings.width || this.max;
  this.contextSettings.height = this.contextSettings.height || 10;
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

  // Get the far-right/bottom coordinates.
  var r = spark.view.canvas.width - this.contextSettings.width;
  var b = spark.view.canvas.height - this.contextSettings.height;

  // Negative positions should render from the right/bottom.
  var x = this.contextSettings.x < 0 ? (r + this.contextSettings.x) : this.contextSettings.x;
  var y = this.contextSettings.y < 0 ? (b + this.contextSettings.y) : this.contextSettings.y;
  
  // Transform to the proper screen coordinates for drawing.
  spark.view.setTransform(1, 0, 0, 1, x, y);

  // Perform the draw.
  draw();

  // Done.
  spark.view.restore();
};

// Render a text label.
__MODULE__.Label.prototype.draw = function() {
  spark.view.fillText(this.value, 0, 0);
};

// Every widget has an update called at the end of the frame.
__MODULE__.Meter.prototype.update = function() {
  this.value = spark.util.clamp(this.value, 0, this.max);
};

// Render a meter bar.
__MODULE__.Meter.prototype.draw = function() {
  var pct = this.value / this.max;

  // Draw the inner bar.
  if (pct > 0.0) {
    spark.view.fillRect(0, 0, this.contextSettings.width * pct, this.contextSettings.height);
  }

  // Draw a border around the fill bar.
  spark.view.strokeRect(0, 0, this.contextSettings.width, this.contextSettings.height);
};
