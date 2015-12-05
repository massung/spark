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

    https://atom.io/packages/linter
    https://atom.io/packages/language-haxe
    https://atom.io/packages/haxe

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

This means that the bottom-left corner of the game world is at <-700,-700> and
the top-right corner is at <+700,+700>.

*Note: This is very important! Spark ensures that the bottom of a rectangle
is always smaller than the top, and that positive rotations are counter-
clockwise!*

All the parameters to the Scene constructor are optional. If the origin is
not provided, 'top-left' is assumed. If the width is not specified, then the
width of the Spark canvas is assumed. If the height is not specified, then
Spark will maintain the aspect ratio of the canvas, and use the width of the
game world to determine the height.

#### Setting Up the Camera

#### Creating Layers

#### Spawning Sprites

#### Adding Behaviors

#### Player Input

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
