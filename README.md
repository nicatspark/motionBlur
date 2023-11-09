# Motion Blur utility function

Do you want to make your web animations look like they are breaking the sound barrier? Do you want to impress your users with the illusion of speed and dynamism? Do you want to add some speeeed to your pixels? Then you need more Motion Blur, the helper that makes your elements go vroom vroom!

## Why

Moving things around on a web page is easy, but making them look fast is hard. You can't just crank up the animation speed and hope for the best. That would make your elements look choppy and unnatural. What you need is some blur, some directional blur that follows the movement of your elements and makes them look like they are zooming across the screen. That's what Motion Blur does for you. It adds a touch of realism and excitement to your web animations. And the best part is, you can actually slow down your animations and they will still look like they are shooting out of a gun barrel. Enjoy the awesome effect of Motion Blur.

## How

Motion Blur uses javascript easing algorithms to animate your elements and calculate their position on every frame (using the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method to avoid blocking the JS thread). Then, it applies a filter svg to your elements and adjusts the amount and direction of the blur according to their movement. This way, you get a smooth and realistic motion blur effect that works with any element you want. Motion Blur does not rely on CSS transition/animation or the web animation api like the [microAnimation](https://www.npmjs.com/package/@foundit/micro-animations) package does..

## Install

`npm install @foundit/motion-blur`

## Usage

### import

`import { motionBlur } from '@foundit/motion-blur'`

### Executing a motion blur and animation

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

### motionBlur option arguments object

- `element` - element to move.
- `durationMs` - defaults to 1000ms.
- `x` - move relative to current position.
- `y` - move relative to current position.
- `xAbsolute` - optional absolute positioning alternative.
- `yAbsolute` - optional absolute positioning alternative.
- `applyToggle`
- `easing` - many built in easings are available, see <https://easings.net/>
- `useMotionBlur` - defaults to true.
- `blurMultiplier` - defaults to 1. 1.5 makes the motion bluriness 50% more pronounced. A 10 pixel move with multiplier set to 30 will render the same amount of max blur as a 300px move with multiplier set to 1.
- `blockMovement` - defaults to false. Motions blurs but doesn't move.
- `docRoot` - This is were the SVG will be placed into. Defaults to document.body

### Typescript types

This little utility is built in Typescript. `MotionBlurOptions`, `easingFactoryProduct` types are exported.

### Mathematical easings algorithm

Should you feel adventurous, go take the easings algorithms for a spin on your own. The `easingFactory` function is exported as well. Have fun.

---

Links: [NPM](https://www.npmjs.com/package/@foundit/motion-blur) | [Github Issues](https://github.com/nicatspark/motionBlur/issues) | [Codepen](https://codepen.io/nicolashervy/pen/qBaqgzM?editors=1010)

Author: [nicolas@hervy.se](mailto:nicolas@hervy.se)
