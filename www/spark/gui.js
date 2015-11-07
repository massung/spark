/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.input', 'spark.util').defines({
  Widget: function(contextSettings) {
    this.contextSettings = {};

    // Override the default context settings.
    spark.util.merge(this.contextSettings, contextSettings || {});
  },

  // A text label.
  Label: function(value, contextSettings) {
    this.value = value;

    // Initialize context settings.
    spark.gui.Widget.call(this, contextSettings);
  },

  // A progress/health meter.
  Meter: function(value, max, contextSettings) {
    this.value = value;
    this.max = max;

    // Initialize context settings.
    spark.gui.Widget.call(this, contextSettings);
  }
});

// All widget subclasses.
__MODULE__.Label.prototype = Object.create(__MODULE__.Widget.prototype);
__MODULE__.Meter.prototype = Object.create(__MODULE__.Widget.prototype);

// Set constructors.
__MODULE__.Widget.prototype.constructor = __MODULE__.Widget;
__MODULE__.Label.prototype.constructor = __MODULE__.Label;
__MODULE__.Meter.prototype.constructor = __MODULE__.Meter;

// Wrapper to assign context settings, draw, and restore.
__MODULE__.Widget.prototype.withContext = function(draw) {
  spark.view.save();

  // Set all the view context settings for this widget.
  for(var setting in this.contextSettings) {
    spark.view[setting] = this.contextSettings[setting];
  }

  // Perform the draw.
  draw();

  // Done.
  spark.view.restore();
};

// Render a text label.
__MODULE__.Label.prototype.draw = function(x, y) {
  this.withContext((function() {
    x = x < 0 ? (spark.view.canvas.width + x - w) : x;
    y = y < 0 ? (spark.view.canvas.height + y - h) : y;

    // If the value is a function, call it to get the text to draw.
    var text = typeof(this.value) === 'function' ? this.value() : this.value;

    // Draw the text.
    spark.view.fillText(text, x, y);
  }).bind(this));
};

//

// Render a meter bar.
__MODULE__.Meter.prototype.draw = function(x, y, w, h) {
  this.withContext((function() {
    var pct = spark.util.clamp(this.value, 0, this.max) / this.max;

    // Default width to max value and height.
    w = w || this.max;
    h = h || 10;

    // Negative offsets are fixed to the bottom/right.
    x = x < 0 ? (spark.view.canvas.width + x - w) : x;
    y = y < 0 ? (spark.view.canvas.height + y - h) : y;

    // Draw the inner bar and then the outer shell.
    spark.view.fillRect(x, y, w * pct, h);
    spark.view.strokeRect(x, y, w, h);
  }).bind(this));
};
