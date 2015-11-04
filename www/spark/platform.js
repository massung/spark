/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// The name of the device running on.
__MODULE__.__defineGetter__('device', function() {
  return window['cordova'] ? cordova.platformId : 'browser';
});

// True if this is a mobile device.
__MODULE__.__defineGetter__('mobile', function() {
  return this.device !== 'browser';
});

// Return the screen width in pixels.
__MODULE__.__defineGetter__('width', function() {
  return this.mobile ? screen.width : window.innerWidth;
});

// Return the screen height in pixels.
__MODULE__.__defineGetter__('height', function() {
  return this.mobile ? screen.height : window.innerHeight;
});
