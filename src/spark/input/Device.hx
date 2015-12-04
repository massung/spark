// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//

package spark.input;

typedef ButtonState = { down: Bool, hits: Int }
typedef StickState = { x: Float, y: Float, relX: Float, relY: Float }

class Device {
  private var buttons: Array<ButtonState>;
  private var sticks: Array<StickState>;

  // true if the device is connected and active
  private var connected: Bool;

  // create a new device with n button states
  public function new(nButtons: Int, nSticks: Int = 0) {
    var i;

    // not connected until installed
    this.connected = false;

    // create the input states
    this.buttons = new Array<ButtonState>();
    this.sticks = new Array<StickState>();

    // fill in the buttons with default values
    for(i in 0...nButtons) {
      this.buttons.push({ down: false, hits: 0 });
    }

    // fill in all the sticks
    for(i in 0...nSticks) {
      this.sticks.push({ x: 0, y: 0, relX: 0, relY: 0 });
    }
  }

  // attach the device
  public function attach() this.connected = true;

  // is this device connected?
  public function isConnected(): Bool return this.connected;

  // called at the end of a frame to clear per-frame state
  public function flush() {
    var i;

    for(i in 0...buttons.length) {
      this.buttons[i].hits = 0;
    }

    for(i in 0...sticks.length) {
      this.sticks[i].relX = 0;
      this.sticks[i].relY = 0;
    }
  }

  // simulate a button press
  public function press(button: Int) {
    if (button >= 0 && button < this.buttons.length) {
      this.buttons[button].down = true;
      this.buttons[button].hits++;
    }
  }

  // clear a button press
  public function release(button: Int) {
    if (button >= 0 && button < this.buttons.length) {
      this.buttons[button].down = false;
    }
  }

  // called when there is pointer motion to track it
  public function move(stick: Int, x: Float, y: Float) {
    if (stick >= 0 && stick < this.sticks.length) {
      this.sticks[stick].relX += (x - this.sticks[stick].x);
      this.sticks[stick].relY += (y - this.sticks[stick].y);

      // update the absolute position
      this.sticks[stick].x = x;
      this.sticks[stick].y = y;
    }
  }

  // true if a key has been hit since the last flush
  public function hit(button: Int): Bool {
    return this.hits(button) > 0;
  }

  // true if the key is currently pressed
  public function down(button: Int): Bool {
    return (button >= 0 && button < this.buttons.length) ? this.buttons[button].down : false;
  }

  // the number of times a key has been hit since the last flush
  public function hits(button: Int): Int {
    return (button >= 0 && button < this.buttons.length) ? this.buttons[button].hits : 0;
  }

  // the current x position of a stick
  public function getX(stick: Int): Float {
    return (stick >= 0 && stick < this.sticks.length) ? this.sticks[stick].x : 0;
  }

  // the current y position of a stick
  public function getY(stick: Int): Float {
    return (stick >= 0 && stick < this.sticks.length) ? this.sticks[stick].y : 0;
  }

  // the relative x position of a stick since last flush
  public function getRelX(stick: Int): Float {
    return (stick >= 0 && stick < this.sticks.length) ? this.sticks[stick].relX : 0;
  }

  // the relative y position of a stick since last flush
  public function getRelY(stick: Int): Float {
    return (stick >= 0 && stick < this.sticks.length) ? this.sticks[stick].relY : 0;
  }
}
