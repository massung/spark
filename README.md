# Welcome to Spark!

Spark is a 2D, HTML5, game engine. It has the following features:

* It's simple! 100% pure JavaScript.
* Multi-platform: desktop, Android, iOS, webOS, FireOS.
* Scene management: projection, camera, layers, scene graph, ...
* Collision detection and 2D physics.
* Sprites, behaviors, animation, and tweening.
* GUI controls and GUI skinning.
* Audio: clips and looping.
* Networking: WebSocket connections for multiplayer games.

Once you've gone over the Quickstart and Tutorial, head on over to the
[documentation](https://github.com/massung/spark/doc/) section and learn how
to do even more!

## Quickstart

Just want to get a simple game up and running as fast as possible? Here are
two methods for starting a web server quickly with a default game that you
can start playing with.

### Using Express (Node.js)

Spark already has a Node.js [Express](https://www.npmjs.com/package/express)
app ready to go. You'll need to install Express yourself, but once installed
it's ready to go.

    $ npm install express --save

Now, just start up the application...

    $ node ./app.js
    Spark running on port 8000...

You can now just open up your browser of choice and go to:

    http://localhost:8000/index.html

That's it!

### Using Cordova

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

## Tutorial (Your First Game)

This tutorial will run you through the basic setup of Spark, how modules are
initialized, loading a project, and creating a basic Asteroids game from
scratch. It won't cover everything, but enough to get your feet wet and to
start exploring further.

*NOTE: This tutorial will be intended to run in a desktop browser and use the
keyboard and mouse for controls.*

### Folder Structure

Inside the `www` folder are two subfolders: `spark` and `game`. The `spark`
folder contains the entire Spark framework, while `game` is yours to do with
as you please.

### The INDEX.HTML File

### Spark Modules

### Setting Up the canvas

### Load a Project

### Running a Scene

### Picking a projection

### Spawning Entities

### Adding Behaviors

### Input and Player Controls

### Collision Detection

### Playing Audio

### Rendering UI

### Performance Monitoring and Debugging
