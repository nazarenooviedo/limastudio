import gsap from 'gsap'
import { CustomEase } from 'gsap/dist/CustomEase'

gsap.registerPlugin(CustomEase)

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
const RECIPROCAL_GR = 1 / GOLDEN_RATIO
const DURATION = RECIPROCAL_GR
const OUT_DURATION = DURATION
const DELAY_TRANSITION_DURATION = DURATION * 0.6
const CUSTOM_EASE = CustomEase.create('EaseIn', '0.165, 0.84, 0.44, 1')
const EASE_LAYER = CustomEase.create(
  'EASE_LAYER',
  'M0,0 C0.268,0.43 0.41,1 1,1'
)

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false
})

gsap.ticker.lagSmoothing(100, 300)

gsap.defaults({
  duration: DURATION,
  ease: EASE_LAYER
})

export {
  CUSTOM_EASE,
  DELAY_TRANSITION_DURATION,
  DURATION,
  EASE_LAYER,
  GOLDEN_RATIO,
  gsap,
  OUT_DURATION
}
