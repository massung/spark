# Welcome to Spark!

Spark is a 2D, HTML5, game engine. It has the following features:

* Multi-platform: desktop, mobile, anything with a browser
* Scene management: projection, camera, layers, actors
* Very fast 2D collision detection
* Sprites, behaviors, tweening, timelines
* GUI controls and skinning
* Audio clips

Once you've gone over the Quickstart and Tutorial, head on over to the
[documentation](https://github.com/massung/spark/doc/) section and learn how
to do even more!

## Quickstart

Just want to get a simple game up and running as fast as possible?

Spark is designed so that you will clone the repository for every game. Let's
make a simple Asteroids clone:

    $ git clone https://github.com/massung/spark.git asteroids

Now that we have a project folder, head on in and start up the Node.js server:

    $ cd asteroids/ && node app.js
    Spark running on port 8000...

You can now open your browser and navigate to `localhost:8000/index.html` to
see an empty shell of a game.

You're now ready to begin the rest of the tutorial.

### The Spark Folder Structure

    + src/
    |
    + www/
    |
    | ---+ game/
    |    |
    |    | ---+ assets/
    |    |
    |    | ---+ main.js
    |    | ---+ project.xml
    |    | ---+ spark.js
    |    |
    | ---+ index.html
    |
    + ...

#### The `src/` Folder

The `src/` folder is where the Spark framework is located. If you never care,
there is never any reason to go into that folder. But, Spark is open and
available for you to explore and modify to suit your needs.

Spark is written in [Haxe](http://haxe.org/) and compiles to JavaScript. If you
have Haxe installed and would like to build Spark yourself from source, simply
run Haxe from within the `src/` folder:

    $ haxe ./compile.hxml

This will generate `spark.js` within `www/game/`.

If you'd like to debug Spark from within the browser, you'll need a map file
along with it. Just compile with `-debug` as well:

    $ haxe ./compile.hxml -debug

This will output `spark.js.map` along-side `spark.js`.

For exploring and editing the Spark source, I personally recommend using the
[Atom](https://atom.io/) editor and installing the following packages:

* [linter](https://atom.io/packages/linter)
* [language-haxe](https://atom.io/packages/language-haxe)
* [haxe](https://atom.io/packages/haxe)

Once installed, open the the project folder in Atom and r-click `compile.hxml`
and choose `Set as active HXML file`. Once done, from anywhere within a Haxe
source file, simply press `ctrl-B` to compile.

#### The `www/` Folder

As far as your game is concerned, the `www/` folder is where all the magic
happens. *It's important to not rename this folder if you plan on using Cordova
to target Android or iOS with your game! More on this later...*

There should be two things in this folder: the `index.html` file, which is
the page that will be displayed to the end-user, and the `game/` sub-folder,
which will house the compile `spark.js` file, your source code, and assets.

#### The `index.html` File

For now, there's not much to do with this file except to note its existence for
when you'd like to modify it later. The only important things to note from it:

1. There *must* be a `<canvas>` element with the id "spark" in it.
2. The `spark.js` script *must* be included *after* the canvas.
3. Your game source script *must* be included *after* the Spark framework.

#### The `game/` Folder

This is where your game lives and where most of your time will be spent. It
contains the compiled `spark.js` file that you needn't concern yourself with,
a `project.xml` file, and JavaScript source you include for your game (by
default a `main.js` file), and a folder for all your assets.

#### The `project.xml` File

The project file is what you will provide Spark to tell it everything about your
project: its title, version, author, what assets to load, what the assets are
named, etc.

Take a look at the included file to get a sense of what it looks like and how
you might edit it for your future games.

#### The `main.js` File

This is where your game lives.

*Note: There's nothing preventing you from breaking your game up into multiple
JavaScript sources, but you'll be required to add each of them to the `index.html`
file individually.*

Let's take a look at the skeleton that's there now:

```javascript
spark.Game.main('game/project.xml', proj => {

  // TODO: ??

  proj.launch(() => {
    scene = new spark.Scene('middle', 1400, 1400);

    // setup the camera and projection transfrorms
    scene.setViewport(1400, 1400);

    // start the main game loop
    scene.run();
  });
});
```

Let's now dive into the tutorial and learn what's going on...

#### Loading a Project File

The first lines of your game are likely always going to be exactly the same:

```javascript
spark.Game.main('game/project.xml', proj => {
  // ...
});
```

You are telling Spark to load the `project.xml` file, create the global Project
object, and call your callback function once it is done loading.

Most of the time, there's not a whole lot to do in the callback except to
launch the project:

```javascript
proj.launch(() => {
  // ...
});
```

However, you may want to do something before launching the project, based on
information in the Project (for example, if the version string of the Project
indicated that it was an alpha version, you may want to modify the HTML on the
page to warn the player of that).

Once the `launch()` function is called, Spark will begin rendering its load
screen, loading all the assets specified in the project. Once all the assets
have been loaded, the callback is called, and you can begin your game.

#### Creating a Scene

Most likely, the first thing you'll do once starting the game is create a new
Scene object. A game is likely made up of many scenes, but only one scene is
running at a time.

```javascript
var scene = new spark.Scene('middle', 1400, 1400);
```

When creating a scene, you are telling Spark how big the game world is, and
where <0,0> should be within that world. In the above example, the game world
is 1400x1400 pixels in size and the origin is in the middle.

This means that the top-left corner of the game world is at <-700,-700> and
the bottom-right corner is at <+700,+700>.

*Note: This is very important! Spark ensures that the top of a rectangle
is always less than the bottom, and that positive rotations are clockwise!
This is in-line with how the HTML5 canvas control orients itself. Please see
[canvas.translate](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate)
and [canvas.rotate](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate).*

All the parameters to the Scene constructor are optional. If the origin is
not provided, 'top-left' is assumed. If the width is not specified, then the
width of the Spark canvas is assumed. If the height is not specified, then
Spark will maintain the aspect ratio of the canvas, and use the width of the
game world to determine the height.

#### Setting Up the Camera

Once the game world is defined, then it's possible to setup the camera. When
the scene was created, a default camera was created for you, but usually you'll
want to define the camera yourself.

```javascript
scene.setViewport(1400, 1400);
```

The camera is defined as having a width and height. This is how many pixels will
be visible to the player, and will be mapped to the canvas view. In the above
example, the entire game world will be visible at all times.

This is irrespective of the canvas size. If the canvas is 100x100 pixels,
then the entire game world will still be visible, but shrunk very small. If the
canvas were 2000x2000 pixels, then the camera would zoom in the game world to
fit.

*Note: If the aspect ratio of the canvas doesn't match the aspect ratio of the
camera, then you will get pinching and stretching.*

Both the width and the height parameters of the viewport are optional. If the
width is not provided, then the width of the canvas is used. If the height is
not provided, then - like the game world - the aspect ratio of the canvas is
maintained and the height is derived from the width of the viewport.

For our tutorial, we'll keep the camera viewport as being able to see the
entire game world at once.

#### Creating Layers

Next, we need to create a layer for sprites. We'll start with a single layer
for the player sprite.

```javascript
var playerLayer = scene.newSpriteLayer();
```

We can have as many layers as we like, but the order the layers are created
matters, as layers are rendered in the order they are created.

#### Spawning Sprites

Now that we have a sprite layer, we can spawn a sprite on it: the player.

```javascript
var player = playerLayer.newSprite();
```

We allocate the player sprite on the layer. By default, the position of this
sprite will be at the origin (the middle of the game world in our case).

However, we need to also select a texture for our sprite to render with. The
texture was already loaded by the `project.xml` file. Looking inside, the
image we want has the `id` of `spaceship`. So let's look it up and use it.

```javascript
player.setTexture(spark.Game.getTexture('spaceship'));
```

There. Now, if you load up our web page, you should see this:

![Tutorial 01](https://github.com/massung/spark/blob/master/doc/i/tutorial_screenshot_01.png)

If so, congratulations! Next, it's time to add some behaviors to our player ship.

#### Adding a Behavior

Behaviors are just functions - with optional data - that are executed every
frame. We want our player ship to be able to move around. So, let's create a
function that will get called by Spark.

```javascript
function playerControls(sprite, step) {
  // TODO:
}
```

The first parameter is the sprite this behavior is running on. Sprites can
share behaviors, so this parameter distinguishes them. Next is the delta time
(game step) - in seconds - since the last frame.

Let's let our sprite turn clockwise and counter-clockwise using the arrow keys.
This should be pretty easy...

```javascript
// rotate counter-clockwise
if (spark.Key.down(spark.Key.LEFT)) {
  sprite.m.rotate(-180 * step);
}

// rotate clockwise
if (spark.Key.down(spark.Key.RIGHT)) {
  sprite.m.rotate(180 * step);
}
```

There's a couple new things here...

1. The `spark.Key` module is used for keyboard input.
2. The sprite's transform is in its `m` property (m for matrix).

So, every frame, if the left arrow key is down, then the player sprite should
turn counter-clockwise, and clockwise if the right arrow key is down.

Still, we have to add this behavior to the sprite. Let's go back up to where
we created the sprite and add the behavior on to it.

```javascript
player.setTexture(spark.Game.getTexture('spaceship'));
player.addBehavior(playerControls);
```

Now, reloading the page, you should be able to turn your sprite.... Great!

However, we still want the player to move around. So, let's make it move when
we have the up arrow key pressed. Back to our behavior function...

```javascript
// move the sprite forward
if (spark.Key.down(spark.Key.UP)) {
  sprite.m.translate(0, -400 * step, true);
}
```

Reload and you should be able to move around the game world.

*Remember - up is negative! Since our spaceship texture points up,
forward will be in the negative Y. If our spaceship's forward was visually
down, we'd translate in the positive Y.*

Hmm... this doesn't really feel like outer space, though. Let's add thrust and
use that to propel the player.

The first thing we need is some data associated with the player's behavior:
thrust. We also need that data to get to the behavior so it can be kept across
frames. Let's modify the signature of our behavior function, adding a new
parameter, which will be data passed to the behavior:

```javascript
function playerControls(sprite, step, data) {
```

Next, let's create the data object when we add the behavior:

```javascript
player.addBehavior(playerControls, {thrust: new spark.Vec(0, 0)});
```

There. Now, every frame when `playerControls` is called, it will have data
associated with it that will contain a thrust vector.

Continuing along... instead of translating the sprite, we need to update the
thrust vector.

```javascript
if (spark.Key.down(spark.Key.UP)) {
  var d = new spark.Vec(0, -600 * step).rotate(sprite.m.r);

  // increase the thrust vector
  data.thrust.x += d.x;
  data.thrust.y += d.y;
}

// apply the thrust every frame
sprite.translate(data.thrust.x * step, data.thrust.y * step);

// dampen the thrust (slow down)
data.thrust.x *= 0.98;
data.thrust.y *= 0.98;
```

We need to calculate the direction of our impulse and add it to the thrust
vector. Then, regardless of whether or not the player is pressing the up key,
we still need to apply the thrust and move the player. Finally, we dampen the
thrust to slowly bring the player to a halt if the the up key is no longer
being pressed.

Let's reload and try.... Yep, that feels much better!

#### Particle Effects

#### Spawning Asteroids

#### Shooting Lasers

#### Adding Collision

#### Animations

#### More...

## Using Cordova

[Cordova](https://cordova.apache.org/) is a tool for packaging up a web page
as an application that can be run on the Android, iOS, webOS, and FireOS. You
can use it to test your game with a local browser or on your mobile device.

First, you need to install Cordova.

    $ npm install -g cordova

Once Cordova is installed, you can create the default platform (browser) to
target.

    $ cordova platform add browser

Now just start it up...

    $ cordova run browser

That's it!

*NOTE: For Cordova to work on your mobile device, you'll need to have the
proper SDK(s) installed. For example, to run the game on Android, you'll need
the Android SDK and Java SE >= 7 installed.*
