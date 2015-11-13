/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// The name of the device running on.
spark.__defineGetter__('device', function() {
  return window['cordova'] ? cordova.platformId : 'browser';
});

// True if this is a mobile device.
spark.__defineGetter__('mobile', function() {
  return spark.device !== 'browser';
});

// Return the screen width in pixels.
spark.__defineGetter__('screenWidth', function() {
  return spark.mobile ? screen.width : window.innerWidth;
});

// Return the screen height in pixels.
spark.__defineGetter__('screenHeight', function() {
  return spark.mobile ? screen.height : window.innerHeight;
});
