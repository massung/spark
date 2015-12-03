// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

class SeparatingAxis {

  // project a list of points from two shapes onto an axis, true if they overlap
  static private function project(as: Array<Vec>, bs: Array<Vec>, axis: Vec): Bool {
    var i, n, amin, amax, bmin, bmax;

    // initialize using the first point of each shape
    amin = amax = as[0].dot(axis);
    bmin = bmax = bs[0].dot(axis);

    // project the rest of the points from shape a
    for(i in 1...as.length) {
      n = as[i].dot(axis);

      // keep the min/max projection
      if (n < amin) amin = n;
      if (n > amax) amax = n;
    }

    // project the rest of the points from shape b
    for(i in 1...bs.length) {
      n = bs[i].dot(axis);

      // keep the min/max projection
      if (n < bmin) bmin = n;
      if (n > bmax) bmax = n;
    }

    // do the projections overlap?
    return (amax < bmin || amin > bmax);
  }

  // run the separating axis theorem across two sets of points and normals
  static public function query(aPs: Array<Vec>, aNs: Array<Vec>, bPs: Array<Vec>, bNs: Array<Vec>): Bool {
    var i;

    // project all the points of a and b onto a's normals
    for(i in 0...aNs.length) {
      if (project(aPs, bPs, aNs[i]) == false) return false;
    }

    // project all the points of of a and b onto b's normals
    for(i in 0...bNs.length) {
      if (project(aPs, bPs, bNs[i]) == false) return false;
    }

    return true;
  }
}
