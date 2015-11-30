// Spark 2D Game Engine
//
// Copyright (c) Jeffrey Massung
// All rights reserved.
//
namespace spark {

  // merge all the properties of b into a
  export function merge(a, b) {
    for (var k in b) {
      if (b.hasOwnProperty(k)) {
        var v = b[k];

        // recursively merge objects together
        if (typeof(v) === 'object' && typeof(a[k]) === 'object') {
          merge(a[k], v);
        } else {
          a[k] = v;
        }
      }
    }
  }

  // remove all the custom properties of an object
  export function wipe(obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        delete obj[k];
      }
    }
  }

  // convert degrees to radians
  export function degToRad(r: number): number {
    return r * Math.PI / 180.0;
  }

  // convert radians to degrees
  export function radToDeg(r: number): number {
    return r * 180.0 / Math.PI;
  }

  // the signum function
  export function signum(n: number): number {
    if (Math.abs(n) < 0.00001) {
      return 0;
    }

    return (n > 0) ? 1 : -1;
  }

  // returns the next power of two from a give number
  export function nextPow2(n: number): number {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
  }

  // returns a value, clamped to the range [min,max]
  export function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(n, max));
  }

  // a random number in the range [min,max]
  export function rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // a random integer in the range [min,max)
  export function irand(min: number, max: number): number {
    return Math.floor(rand(min, max));
  }

  // a random element from an array
  export function arand(array: any[]): any {
    return array[irand(0, array.length)];
  }

  // linearly interpolate from p to q by k in the range [0,max | 1]
  export function lerp(p: number, q: number, k: number, max?: number): number {
    return p + (q - p) * k / (max || 1);
  }
}
