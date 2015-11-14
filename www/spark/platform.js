/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// Return the name of the device.
__MODULE__.__defineGetter__('device', function() {
  return window['cordova'] ? cordova.platformId : 'browser';
});

// True if the device platform is mobile.
__MODULE__.__defineGetter__('mobile', function() {
  return spark.platform.device !== 'browser';
})

// Return the width of the window or device display.
__MODULE__.__defineGetter__('width', function() {
  return spark.platform.mobile ? screen.width : window.innerWidth;
});

// Return the height of the window or device display.
__MODULE__.__defineGetter__('width', function() {
  return spark.platform.mobile ? screen.height : window.innerHeight;
});
