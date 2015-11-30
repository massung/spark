// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

import spark.math.*;

typedef CollisionCallback = Body -> Void;

class Body {
  private var object: Dynamic;
  private var filter: String;
  private var shapes: Array<Shape>;
  private var oncollision: CollisionCallback;

  // create a new collider
  public function new(object: Dynamic, filter: String, ?oncollision: CollisionCallback) {
    this.object = object;
    this.filter = filter;
    this.oncollision = oncollision;
    this.shapes = new Array<Shape>();
  }

  // get the object and filter type for this body
  public function getObject(): Dynamic return object;
  public function getFilter(): String return filter;

  // calculate all world space coordinates for each shape
  public function updateShapeCache(m: Mat) {
    var i;

    for(i in 0...this.shapes.length - 1) {
      this.shapes[i].updateShapeCache(m);
    }
  }

  // add all the shapes into a spacial hash
  public function addToQuadtree(space: Quadtree) {
    var i;

    for(i in 0...this.shapes.length - 1) {
      space.addShape(this.shapes[i]);
    }
  }

  // create a new segment shape and attach it
  public function addSegmentShape(x1: Float, y1: Float, x2: Float, y2: Float) {
    this.shapes.push(new spark.collision.shape.Segment(this, x1, y1, x2, y2));
  }

  // create a new circle shape and attach it
  public function addCircleShape(x: Float, y: Float, radius: Float) {
    this.shapes.push(new spark.collision.shape.Circle(this, x, y, radius));
  }

  // create a new box shape and attach it
  public function addBoxShape(x: Float, y: Float, width: Float, height: Float) {
    this.shapes.push(new spark.collision.shape.Box(this, x, y, width, height));
  }

  // process a collision
  public function collide(body: Body) {
    if (this.oncollision != null) {
      this.oncollision(body);
    }
  }
}
