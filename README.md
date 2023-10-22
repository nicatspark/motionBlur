# Motion Blur function

A helper that adds speeeed to your pixels.

## Why

Sure it is cool when things move. But it looks even cooler when things move fast. Problem is that moving things fast in a UI requires no effort. Turns out its when it looks like it moves fast it is cool. Enter Motion Blur. Add it to whatever you need to give the impression of speed and enjoy. Actually, now you can slow down your moves to really enjoy the fresh speedy look.

## Install

`npm install @foundit/motion-blur`

## Usage

### import

`import { motionBlur } from '@foundit/motion-blur'`

### Executing motion blur

Minimum is to pass an element and in the options argument object, pass x, y in pixels to get the element movin'.

```js
async function openDrawer() {
  await motionBlur(myDrawerElement, {
    duration: 800,
    x: -300,
    y: 0,
  })
  console.log('My drawer is open')
}
```

### microAnimation option arguments object

`element` - element to move.
`durationMs` - defaults to 1000ms.
`x` - move relative to current position.
`y` - move relative to current position.
`xAbsolute` - optional absolute positioning alternative.
`yAbsolute` - optional absolute positioning alternative.
`applyToggle`
`easing` - many built in easing are available, see https://easings.net/
`useMotionBlur` - defaults to true.
`blurMultiplier` - defaults to 1. 1.5 makes the motion bluriness 50% more pronounced.
`docRoot` - defaults to document.

### Typescript types

This little helper is built in Typescript. `MotionBlurOptions`, `easingFactoryProduct` are exported.

### Mathematical easings algorithm

Should feel adventurous, go take the easings algorithms for a spin. The `easingFactory` factory function is exported as well.

---

Links: [NPM](https://www.npmjs.com/package/@foundit/motionBlur) | [Github Issues](https://github.com/nicatspark/motionBlur/issues) | [Codepen](https://codepen.io/nicolashervy/pen/qBaqgzM?editors=1010)

Author: [nicolas@hervy.se](mailto:nicolas@hervy.se)
