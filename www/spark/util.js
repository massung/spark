/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module();

// Merge properties of B into A.
__MODULE__.merge = function(a, b) {
  for(var k in b) {
    if (b.hasOwnProperty(k)) {
      var v = b[k];

      // Recursively merge objects together.
      if (typeof(v) === 'object' && typeof(a[k]) === 'object') {
        spark.util.merge(a[k], v);
      } else {
        a[k] = v;
      }
    }
  }
};

// Returns a random number in the range of [min,max].
__MODULE__.rand = function(min, max) {
  return Math.random() * (max - min) + min;
};

// Returns a random integer in the range of [min,max).
__MODULE__.irand = function(min, max) {
  return Math.floor(spark.util.rand(min, max));
};

// Returns a random element from an array.
__MODULE__.arand = function(array) {
  return array[Math.floor(Math.rand() * array.length)];
};

// Linearly interpolate across values.
__MODULE__.lerp = function(start, end, k, max) {
  if (max !== undefined) {
    return start + (end - start) * (k / max);
  } else {
    return start + (end - start) * k;
  }
};
