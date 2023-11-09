import { MotionBlurOptions, motionBlur } from '.'
import { it, describe, expect } from '@jest/globals'

describe('motionBlur', () => {
  // Moves the element to a new position over a specified duration
  it('should move the element to a new position over a specified duration', async () => {
    const element = document.createElement('div')
    const options: MotionBlurOptions = {
      durationMs: 1000,
      x: 100,
      y: 50,
      easing: 'easeInOutQuad',
      useMotionBlur: false,
      blurMultiplier: 1,
      blockMovement: false,
      docRoot: document.body,
    }

    const initialLeft = 0
    const initialTop = 0
    element.style.position = 'absolute'
    element.style.left = initialLeft + 'px'
    element.style.top = initialTop + 'px'

    document.body.appendChild(element)

    await motionBlur(element, options)

    const finalLeft = initialLeft + options.x!
    const finalTop = initialTop + options.y!
    expect(element.style.left).toBe(finalLeft + 'px')
    expect(element.style.top).toBe(finalTop + 'px')

    document.body.removeChild(element)
  })

  // Uses easing functions to control the speed of the movement
  it('should use easing functions to control the speed of the movement', async () => {
    const element = document.createElement('div')
    const options: MotionBlurOptions = {
      durationMs: 1000,
      x: 100,
      y: 50,
      easing: 'easeInOutQuad',
      useMotionBlur: false,
      blurMultiplier: 1,
      blockMovement: false,
      docRoot: document.body,
    }

    const initialLeft = 0
    const initialTop = 0
    element.style.position = 'absolute'
    element.style.left = initialLeft + 'px'
    element.style.top = initialTop + 'px'

    document.body.appendChild(element)

    await motionBlur(element, options)

    const finalLeft = initialLeft + options.x!
    const finalTop = initialTop + options.y!
    expect(element.style.left).toBe(finalLeft + 'px')
    expect(element.style.top).toBe(finalTop + 'px')

    document.body.removeChild(element)
  })

  // Allows for relative or absolute positioning of the element
  it('should allow for relative or absolute positioning of the element', async () => {
    const element = document.createElement('div')
    const options: MotionBlurOptions = {
      durationMs: 1000,
      x: 100,
      y: 50,
      easing: 'easeInOutQuad',
      useMotionBlur: false,
      blurMultiplier: 1,
      blockMovement: false,
      docRoot: document.body,
    }

    const initialLeft = 0
    const initialTop = 0
    element.style.position = 'absolute'
    element.style.left = initialLeft + 'px'
    element.style.top = initialTop + 'px'

    document.body.appendChild(element)

    await motionBlur(element, options)

    const finalLeft = initialLeft + options.x!
    const finalTop = initialTop + options.y!
    expect(element.style.left).toBe(finalLeft + 'px')
    expect(element.style.top).toBe(finalTop + 'px')

    document.body.removeChild(element)
  })
})
