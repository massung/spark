// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // the name of the platform
  export function getDevice(): string {
    return window['cordova'] ? window['cordova'].platformId : 'browser';
  }

  // true if the platform is mobile
  export function isMobile(): boolean {
    return getDevice() !== 'browser';
  }

  // the width of the platform (screen or browser window)
  export function getWidth(): number {
    return isMobile() ? screen.width : window.innerWidth;
  }

  // the height of the platform (screen or browser window)
  export function getHeight(): number {
    return isMobile() ? screen.height : window.innerHeight;
  }
}
