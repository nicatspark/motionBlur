# Motion Blur utility

A helper that adds speeeed to your pixels. It actually adds directional blur in the direction your element is moving. And more blur the longer the move.

## Why

Sure it is cool when things moves. But it looks even cooler when things move fast. Problem is that moving things around fast in a UI requires no effort. Turns out its when it looks like it moves fast that it is cool. Enter Motion Blur. Add it to whatever you need to give the impression of speed and enjoy. Actually, now you can slow down your moves to really enjoy the fresh speedy look.

## How

I uses javascript easing algorithms to animate and continuously calculate the position of the element, (using the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)) and at the same time add blur using a filter svg, adapting the amount of, and direction of, the amount of blur.
So the movement does not come from CSS transition/animation and it does not use the web animation api as my [microAnimation](https://www.npmjs.com/package/@foundit/micro-animations) package does.

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

- `element` - element to move.
- `durationMs` - defaults to 1000ms.
- `x` - move relative to current position.
- `y` - move relative to current position.
- `xAbsolute` - optional absolute positioning alternative.
- `yAbsolute` - optional absolute positioning alternative.
- `applyToggle`
- `easing` - many built in easing are available, see <https://easings.net/>
- `useMotionBlur` - defaults to true.
- `blurMultiplier` - defaults to 1. 1.5 makes the motion bluriness 50% more pronounced. A 10 pixel move with multiplier set to 30 will render the same amount of max blur as a 300px move with multiplier set to 1.
- `blockMovement` - defaults to false. Motions blurs but doesn't move.
- `docRoot` - This is were the SVG will be placed into. Defaults to document.body

### Typescript types

This little utility is built in Typescript. `MotionBlurOptions`, `easingFactoryProduct` are exported.

### Mathematical easings algorithm

Should feel adventurous, go take the easings algorithms for a spin. The `easingFactory` factory function is exported as well. Have fun.

---

Links: [NPM](https://www.npmjs.com/package/@foundit/motion-blur) | [Github Issues](https://github.com/nicatspark/motionBlur/issues) | [Codepen](https://codepen.io/nicolashervy/pen/qBaqgzM?editors=1010)

Author: [nicolas@hervy.se](mailto:nicolas@hervy.se)
