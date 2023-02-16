import gsap from 'gsap'
import { CustomEase } from 'gsap/dist/CustomEase'

gsap.registerPlugin(CustomEase)

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
const RECIPROCAL_GR = 1 / GOLDEN_RATIO
const DURATION = RECIPROCAL_GR
const EASE_LAYER = CustomEase.create(
  'EASE_LAYER',
  'M0,0 C0.268,0.43 0.41,1 1,1'
)

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false
})

gsap.defaults({
  duration: DURATION,
  ease: EASE_LAYER
})

export { DURATION, EASE_LAYER, GOLDEN_RATIO, gsap }
