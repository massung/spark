/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// Merge properties of B into A.
spark.merge = function(a, b) {
  for(var k in b) {
    if (b.hasOwnProperty(k)) {
      var v = b[k];

      // Recursively merge objects together.
      if (typeof(v) === 'object' && typeof(a[k]) === 'object') {
        spark.merge(a[k], v);
      } else {
        a[k] = v;
      }
    }
  }
};

// Remove all the properties from an object.
spark.wipe = function(obj) {
  for(var k in obj) {
    if (obj.hasOwnProperty(k)) {
      delete obj[k];
    }
  }
};

// Get the next power of 2 from a number.
spark.nextPow2 = function(n) {
  return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
};

// Convert from degrees to radians.
spark.degToRad = function(angle) {
  return angle * Math.PI / 180.0;
};

// Convert from radians to degrees.
spark.radToDeg = function(rads) {
  return rads * 180.0 / Math.PI;
};

// Clamp a value to a min and max value.
spark.clamp = function(x, min, max) {
  return Math.max(min, Math.min(x, max));
};

// Returns a random number in the range of [min,max].
spark.rand = function(min, max) {
  return Math.random() * (max - min) + min;
};

// Returns a random integer in the range of [min,max).
spark.irand = function(min, max) {
  return Math.floor(spark.util.rand(min, max));
};

// Returns a random element from an array.
spark.arand = function(array) {
  return array[Math.floor(Math.rand() * array.length)];
};

// Linearly interpolate across values.
spark.lerp = function(start, end, k, max) {
  if (max !== undefined) {
    return start + (end - start) * (k / max);
  } else {
    return start + (end - start) * k;
  }
};
