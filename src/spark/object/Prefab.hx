// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.object;

import spark.collision.*;
import spark.graphics.*;

class Prefab extends Asset {
  private var x: Float;
  private var y: Float;
  private var angle: Float;

  // optional initialization function
  private var init: Sprite -> Dynamic -> Void;

  //
  private var quad: Quad;

  //
  private var behaviors: Array<Actor.BehaviorCallback>;

  // load a new prefab
  public function new(src: String) {
    super(src);

    // default transform
    this.x = 0;
    this.y = 0;
    this.angle = 0;

    // default render quad
    this.quad = null;

    // default behavior list
    this.behaviors = [];

    // load the definition
    Spark.loadXML(src, function(doc) {
      var prefab: Xml = doc.firstElement();

      if (prefab == null || prefab.nodeName != 'prefab') {
        throw  'Invalid prefab XML: ' + src;
      }

      // check for an init function
      Util.mergeAtt(this, 'init', prefab, TFunction);

      // lookup the quad to use
      if (prefab.exists('quad')) {
        var quad = Game.project.get(prefab.get('quad'));

        if (quad != null) {
          this.quad = cast(quad, Quad);
        }
      }

      // get all the behavior functions
      for(behaviors in prefab.elementsNamed('behaviors')) {
        for(behavior in behaviors.elementsNamed('behavior')) {
          if (behavior.exists('name')) {

            var name = behavior.get('name');
            var func = Util.lookupFunction(name);

            if (func != null) {
              this.behaviors.push(func);
            }
          }
        }
      }

      // ready
      this.loaded = true;
    });
  }

  // initialize prefab data onto a new sprite object
  public function instantiate(sprite: Sprite, ?data: Dynamic) {
    sprite.setQuad(this.quad);

    // add all the behaviors to the sprite
    for(behavior in this.behaviors) {
      sprite.newBehavior(behavior, data);
    }

    // call the init function if one exists
    if (this.init != null) {
      this.init(sprite, data);
    }
  }
}
