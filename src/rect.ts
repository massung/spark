// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // axis-aligned bounding box
  export class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    // create a new axis-aligned bounding box
    constructor(x: number, y: number, w: number, h: number) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
    }

    // true if a point is within the bounding box
    contains(x: number, y: number): boolean {
      return (x >= this.x && x <= this.x + this.width) &&
             (y >= this.y && y <= this.y + this.height);
    }

    // returns the minimum of left | right
    get left(): number {
      return this.x;
    }

    // returns the minimum of top | bottom
    get top(): number {
      return this.y;
    }

    // returns the maximum of left | right
    get right(): number {
      return this.x + this.width;
    }

    // returns the maximum of top | bottom
    get bottom(): number {
      return this.y + this.height;
    }
  }
}
