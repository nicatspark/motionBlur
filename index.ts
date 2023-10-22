// =================================================================================================
// INTERFACE
// =================================================================================================

/**
 * @param element - element to move.
 * @param durationMs - defaults to 1000ms.
 * @param x - move relative to current position.
 * @param y - move relative to current position.
 * @param xAbsolute - optional absolute positioning alternative.
 * @param yAbsolute - optional absolute positioning alternative.
 * @param applyToggle
 * @param easing - many built in easing are available, see https://easings.net/
 * @param useMotionBlur - default to true.
 * @param blurMultiplier
 * @param blockMovement - defaults to false. Blurs but doesn't move anything.
 * @param docRoot - defaults to document.
 */
interface MotionBlurOptions {
  durationMs?: number
  x?: number
  y?: number
  xAbsolute?: number
  yAbsolute?: number
  applyToggle?: boolean
  easing?: keyof easingFactoryProduct
  useMotionBlur?: boolean
  blurMultiplier?: number
  blockMovement?: boolean
  docRoot?: Document
}

interface easingFactoryProduct {
  linear: (x: number) => number
  easeIn: (x: number) => number
  easeOut: (x: number) => number
  easeInOut: (x: number) => number
  easeInSine: (x: number) => number
  easeOutSine: (x: number) => number
  easeInOutSine: (x: number) => number
  easeInCubic: (x: number) => number
  easeOutCubic: (x: number) => number
  easeInOutCubic: (x: number) => number
  easeInQuint: (x: number) => number
  easeOutQuint: (x: number) => number
  easeInOutQuint: (x: number) => number
  easeInQuad: (x: number) => number
  easeOutQuad: (x: number) => number
  easeInOutQuad: (x: number) => number
  easeInQuart: (x: number) => number
  easeOutQuart: (x: number) => number
  easeInOutQuart: (x: number) => number
  easeInExpo: (x: number) => number
  easeOutExpo: (x: number) => number
  easeInOutExpo: (x: number) => number
  easeInCirc: (x: number) => number
  easeOutCirc: (x: number) => number
  easeInOutCirc: (x: number) => number
  easeInBack: (x: number) => number
  easeOutBack: (x: number) => number
  easeInOutBack: (x: number) => number
  easeInElastic: (x: number) => number
  easeOutElastic: (x: number) => number
  easeInOutElastic: (x: number) => number
  easeInBounce: (x: number) => number
  easeOutBounce: (x: number) => number
  easeInOutBounce: (x: number) => number
}

// =================================================================================================
// IMPLEMENTATION
// =================================================================================================

/**
 * Minimum arguments to pass in the argument object is ´element´ and a ´transformEnd´ keyframe object.
 * Transform start is then picked up from the element's computed style.
 *
 * async function close() {
 *   await microAnimation({
 *     element,
 *     duration: 300,
 *     transformEnd: { opacity: 0 },
 *   });
 *   removeElement()
 * }
 *
 * For a multiple keyframe animation, pass an array of transformEnd objects. Again, the first keyframe
 * will be picked up from the element's computed style. The offset property is optional, and is used
 * to split transitions between keyframes, defaults to splitting equally between frames.
 * In the example below, the background color will change to orangered at 70% of the animation.
 *
 * ...
 * await microAnimation({
 *   element,
 *   duration: 300,
 *   transformEnd: [{
 *      backgroundColor: 'orangered',
 *      opacity: 1, offset: 0.7
 *    }, {
 *      transform: "translateX(0)",
 *      backgroundColor: 'blue'
 *    }]
 *  ...
 */
async function motionBlur(
  element: HTMLElement,
  {
    durationMs = 1000,
    x: xRelative = 0,
    y: yRelative = 0,
    xAbsolute, // Optional absolute alternative.
    yAbsolute,
    applyToggle = false,
    easing = 'easeOutExpo',
    useMotionBlur = true,
    blurMultiplier = 1,
    blockMovement = false,
    docRoot = document,
  }: MotionBlurOptions = {}
) {
  return new Promise((resolve) => {
    let start: number | undefined = undefined
    const easings = easingFactory()
    const elStartPosition = window.getComputedStyle(element)
    const originPos = {
      x: parseInt(elStartPosition.left),
      y: parseInt(elStartPosition.top),
    }
    // Motion blur specific.
    let previousX: number | undefined, previousY: number | undefined
    if (useMotionBlur) initMotionBlur()
    //
    convertOptionalAbsoluteToRelative()
    handleToggleMode()

    function step(timestamp: number) {
      start ?? (start = timestamp)
      const elapsedMs = timestamp - start
      const linearProgress = elapsedMs / durationMs
      const easedProgress = {
        x: easings[easing](linearProgress) * xRelative,
        y: easings[easing](linearProgress) * yRelative,
      }
      //
      if (useMotionBlur) applyMotionBlur(easedProgress)
      //
      if (!blockMovement) {
        element.style.left = originPos.x + easedProgress.x + 'px'
        element.style.top = originPos.y + easedProgress.y + 'px'
      }

      if (elapsedMs < durationMs) {
        window.requestAnimationFrame(step) // Keep going.
      } else {
        // Movement done.
        if (useMotionBlur) resetMotionBlur()
        element.style.left = Math.round(parseInt(element.style.left)) + 'px'
        element.style.top = Math.round(parseInt(element.style.top)) + 'px'
        resolve({ element })
      }
    }
    window.requestAnimationFrame(step) // Kicking off.

    function convertOptionalAbsoluteToRelative() {
      const absolutePositionsNotPresent =
        yRelative + xRelative !== 0 || !xAbsolute || !yAbsolute
      if (absolutePositionsNotPresent) return
      xRelative = xAbsolute - originPos.x
      yRelative = yAbsolute - originPos.y
    }

    function handleToggleMode() {
      if (element.dataset.toggle && applyToggle) {
        const [xTargetDistancePxString, yTargetDistancePxString] =
          element.dataset.toggle.split(',')
        xRelative = Number(xTargetDistancePxString) * -1 || 0
        yRelative = Number(yTargetDistancePxString) * -1 || 0
        delete element.dataset.toggle
      } else if (applyToggle) {
        element.dataset.toggle = `${xRelative},${yRelative}`
      }
    }

    function initMotionBlur() {
      // check that svg is not already present
      if (!docRoot.querySelector('svg#motion-blur-svg')) {
        const svg = createFilterSVG()
        docRoot.body.appendChild(svg)
      }
      element.style.filter = 'url(#svg-motion-blur)'
    }

    function createFilterSVG() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', '1')
      svg.setAttribute('height', '1')
      svg.setAttribute('id', 'motion-blur-svg')
      const defs = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'defs'
      )
      const filter = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'filter'
      )
      filter.setAttribute('id', 'svg-motion-blur')
      const feGaussianBlur = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'feGaussianBlur'
      )
      feGaussianBlur.setAttribute('in', 'SourceGraphic')
      feGaussianBlur.setAttribute('stdDeviation', '0 0')
      filter.appendChild(feGaussianBlur)
      defs.appendChild(filter)
      svg.appendChild(defs)
      return svg
    }

    function applyMotionBlur(easedProgress: { x: number; y: number }) {
      previousX || (previousX = easedProgress.x)
      previousY || (previousY = easedProgress.y)
      const diff = [
        Math.abs(Math.round((easedProgress.x - previousX) * blurMultiplier)),
        Math.abs(Math.round((easedProgress.y - previousY) * blurMultiplier)),
      ]
      const svg = docRoot.querySelector('feGaussianBlur')
      if (!svg) throw new Error('svg not found')
      svg.setAttribute('stdDeviation', diff.join(' '))
      ;[previousX, previousY] = [easedProgress.x, easedProgress.y]
    }

    function resetMotionBlur() {
      element.style.filter = ''
      const svg = docRoot.querySelector('feGaussianBlur')
      if (!svg) throw new Error('svg not found')
      svg.setAttribute('stdDeviation', '0 0')
    }
  })
}

/**
 * Returns a factory of easing algorithms. See https://easings.net/
 *
 * @returns easing algorithms
 */
function easingFactory(): easingFactoryProduct {
  // Visualized at https://easings.net/
  const easeInSine = (x: number) => 1 - Math.cos((x * Math.PI) / 2)
  const easeOutSine = (x: number) => Math.sin((x * Math.PI) / 2)
  const easeInOutSine = (x: number) => (-1 * (Math.cos(Math.PI * x) - 1)) / 2
  const easeInCubic = (x: number) => x * x * x
  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
  const easeInOutCubic = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
  const easeInQuint = (x: number) => x * x * x * x * x
  const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5)
  const easeInOutQuint = (x: number) =>
    x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
  const easeInQuad = (x: number) => x * x
  const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x)
  const easeInOutQuad = (x: number) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  const easeInQuart = (x: number) => x * x * x * x
  const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4)
  const easeInOutQuart = (x: number) =>
    x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
  const easeInExpo = (x: number) =>
    x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
  const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x))
  const easeInOutExpo = (x: number) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2
  const easeInCirc = (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2))
  const easeOutCirc = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2))
  const easeInOutCirc = (x: number) =>
    x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
  const easeInBack = (x: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return c3 * x * x * x - c1 * x * x
  }
  const easeOutBack = (x: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
  }
  const easeInOutBack = (x: number) => {
    const c1 = 1.70158
    const c2 = c1 * 1.525
    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
  }
  const easeInElastic = (x: number) => {
    const c4 = (2 * Math.PI) / 3
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)
  }
  const easeOutElastic = (x: number) => {
    const c4 = (2 * Math.PI) / 3
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
  }
  const easeInOutElastic = (x: number) => {
    const c5 = (2 * Math.PI) / 4.5
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1
  }
  const easeInBounce = (x: number) => 1 - easeOutBounce(1 - x)
  const easeOutBounce = (x: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (x < 1 / d1) {
      return n1 * x * x
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375
    }
  }
  const easeInOutBounce = (x: number) =>
    x < 0.5
      ? (1 - easeOutBounce(1 - 2 * x)) / 2
      : (1 + easeOutBounce(2 * x - 1)) / 2
  const linear = (x: number) => x
  const easeIn = easeInQuad
  const easeOut = easeOutQuad
  const easeInOut = easeInOutQuad
  return {
    linear,
    easeIn,
    easeOut,
    easeInOut,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInCirc,
    easeOutCirc,
    easeInOutCirc,
    easeInBack,
    easeOutBack,
    easeInOutBack,
    easeInElastic,
    easeOutElastic,
    easeInOutElastic,
    easeInBounce,
    easeOutBounce,
    easeInOutBounce,
  }
}

export { motionBlur, easingFactory }

export type { MotionBlurOptions, easingFactoryProduct }

/*
 * Workflow:
 * pnpm changeset - create a new changeset
 *
 * Release sequence:
 * pnpm run build - builds the package
 * pnpm changeset version - bumps the version in the changeset/package json
 * pnpm changeset publish - publishes the package to npm
 * git push --follow-tags origin main
 */
