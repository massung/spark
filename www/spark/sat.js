/* Spark 2D Game Engine
 *
 * Copyright (c) Jeffrey Massung
 * All rights reserved.
 */

spark.module().requires('spark.vec');

// Project a list of points onto an axis, find the min and max.
spark.SATproject = function(as, bs, axis) {
  var i, n, amin, amax, bmin, bmax;

  // Project the first point.
  amin = amax = spark.vec.vdot(as[0], axis);
  bmin = bmax = spark.vec.vdot(bs[0], axis);

  // Project the rest of the points in A.
  for(i = 1;i < as.length;i++) {
    n = spark.vec.vdot(as[i], axis);

    // Keep the min/max projection.
    if (n < amin) amin = n;
    if (n > amax) amax = n;
  }

  // Project the rest of the points in B.
  for(i = 1;i < bs.length;i++) {
    n = spark.vec.vdot(bs[i], axis);

    // Keep the min/max projection.
    if (n < bmin) bmin = n;
    if (n > bmax) bmax = n;
  }

  // Do the projections overlap?
  if (amax < bmin || amin > bmax) {
    return false;
  }

  return true;
};

// Perform SAT on two convex shapes (points and normals).
spark.SATquery = function(aPs, aNs, bPs, aNs) {
  var i, pa, pb;

  // Project all the points onto the normals of shape A.
  for(i = 0;i < aNs.length;i++) {
    if (spark.SATproject(aPs, bPs, aNs[i]) === false) {
      return false;
    }
  }

  // Project all the points onto the normals of shape B.
  for(i = 0;i < bNs.length;i++) {
    if (spark.SATproject(aPs, bPs, bNs[i]) === false) {
      return false;
    }
  }

  return true;
};
