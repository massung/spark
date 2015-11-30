// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // update function callback
  export type Behavior = (sprite: Sprite, step: number) => void;

  // scene actor class
  export class Sprite extends Collider {
    scene: Scene;
    m: Mat;
    pivot: Vec;
    texture: Texture;
    quad: Quad;
    rig: Rig;
    behaviors: Behavior[];
    contextSettings: any;
    dead: boolean;

    // default constructor
    constructor() {
      super();

      // initialize sprite data
      this.m = new Mat(0, 0, 1, 0, 1, 1);
      this.pivot = new Vec(0.5, 0.5);
      this.rig = new Rig();
      this.texture = null;
      this.quad = null;
      this.behaviors = [];
      this.dead = false;
      this.contextSettings = {};
    }

    // visible width of sprite in game space
    get width(): number {
      if (this.quad) return this.quad.width;
      else if (this.texture) return this.texture.width;
      else return 0;
    }

    // visible height of sprite in game space
    get height(): number {
      if (this.quad) return this.quad.height;
      else if (this.texture) return this.texture.height;
      else return 0;
    }

    // convert point from world to local space
    worldToLocal(p: Vec): Vec {
      return this.m.inverse.transform(p);
    }

    // convert point from local to world space
    localToWorld(p: Vec): Vec {
      return this.m.transform(p);
    }

    // convert angle from world to local space
    worldToLocalAngle(angle: number): number {
      return this.m.angle - angle;
    }

    // convert angle from local to world space
    localToWorldAngle(angle: number): number {
      return this.m.angle + angle;
    }

    // add a new behavior callback to the sprite
    addBehavior(behavior: Behavior) {
      this.behaviors.push(behavior);
    }

    // called once per frame to process
    update(step: number) {
      var i;

      // update all animations
      this.rig.update(step);

      // execute all the behaviors
      for (i = 0;i < this.behaviors.length;i++) {
        this.behaviors[i](this, step);
      }

      // process collision shapes
      this.updateShapes(this.m);
    }

    // called once per frame to render
    draw() {
      if (!this.texture) {
        return;
      }

      view.save();

      // apply the model transform to the view
      this.m.apply();

      // apply view settings
      merge(view, this.contextSettings);

      // render the texture/quad
      if (this.quad) {
        this.texture.drawq(this.quad, this.pivot);
      } else {
        this.texture.draw(this.pivot);
      }

      // done
      view.restore();
    }
  }
}
