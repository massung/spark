// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.collision;

import spark.collision.shape.*;

typedef CollisionCallback = Body -> Body -> Void;

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

    for(i in 0...this.shapes.length) {
      this.shapes[i].updateShapeCache(m);
    }
  }

  // add all the shapes into a spacial hash
  public function addToQuadtree(space: Quadtree) {
    var i;

    for(i in 0...this.shapes.length) {
      space.addShape(this.shapes[i]);
    }
  }

  // create a new shape and track it
  public function newShape(classRef: Class<Shape>, initargs: Array<Dynamic>): Shape {
    var shape = Type.createInstance(classRef, initargs);

    // add the shape to the list
    this.shapes.push(shape);

    return shape;
  }

  // create a new segment shape and attach it
  public function newSegmentShape(x1: Float, y1: Float, x2: Float, y2: Float): Segment {
    return cast newShape(Segment, [this, x1, y1, x2, y2]);
  }

  // create a new circle shape and attach it
  public function newCircleShape(x: Float, y: Float, radius: Float) {
    return cast newShape(Circle, [this, x, y, radius]);
  }

  // create a new box shape and attach it
  public function newBoxShape(x: Float, y: Float, width: Float, height: Float) {
    return cast newShape(Box, [this, x, y, width, height]);
  }

  // process a collision
  public function collide(body: Body) {
    if (this.oncollision != null && body.filter != null) {
      this.oncollision(this, body);
    }
  }
}
