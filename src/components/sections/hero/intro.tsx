import { clsx } from 'clsx'
import { useCallback, useEffect, useRef } from 'react'

import { useLoader } from '~/components/common/loader'
import { useGsapContext } from '~/hooks/use-gsap-context'
import { DURATION, EASE_LAYER, gsap } from '~/lib/gsap'

import s from './hero.module.scss'

type LayerType = {
  assetName?: string
  format?: 'jpg' | 'mp4'
  el?: Element
  image?: Element | null
}

const layers = [
  {
    assetName: '1',
    format: 'jpg'
  },
  {
    assetName: '2',
    format: 'jpg'
  },
  {
    assetName: '3',
    format: 'jpg'
  },
  {
    assetName: 'jumping',
    format: 'mp4'
  },
  {
    assetName: '4',
    format: 'jpg'
  },
  {
    assetName: '5',
    format: 'jpg'
  },
  {
    assetName: '6',
    format: 'jpg'
  },
  {
    assetName: 'malaria',
    format: 'mp4'
  },
  {
    assetName: '7',
    format: 'jpg'
  },
  {
    assetName: '8',
    format: 'jpg'
  },
  {
    assetName: '9',
    format: 'jpg'
  },
  {
    assetName: '10',
    format: 'jpg'
  },
  {
    assetName: 'hennessy-bruto',
    format: 'mp4'
  }
]

const IntroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<GSAPTimeline>()
  const setLoaded = useLoader((s) => s.setLoaded)
  const loading = useLoader((s) => s.loading)

  const getLayerItem = useCallback((item: LayerType) => {
    const baseProps = {
      id: 'layers-item-asset',
      className: s['layers__item-asset'],
      assetUrl: `../images/intro/${item.assetName}.${item.format}`
    }

    switch (item.format) {
      case 'jpg': {
        return (
          <div
            className={baseProps.className}
            id={baseProps.id}
            style={{
              backgroundImage: `url(${baseProps.assetUrl})`
            }}
          />
        )
      }
      case 'mp4': {
        return (
          <video
            autoPlay
            className={clsx(baseProps.className, s.video)}
            id={baseProps.id}
            loop
            muted
            playsInline
            src={baseProps.assetUrl}
          />
        )
      }
    }
  }, [])

  useGsapContext(() => {
    if (!containerRef.current) return

    const layers: LayerType[] = []

    containerRef.current.querySelectorAll('#layers-item').forEach((item) =>
      layers.push({
        el: item,
        image: item.querySelector('#layers-item-asset')
      })
    )

    timelineRef.current = gsap.timeline({
      paused: true
    })

    for (let i = 0, len = layers.length; i <= len - 1; ++i) {
      timelineRef.current.to(
        [layers[i]?.el, layers[i]?.image],
        {
          duration: DURATION * 1.2,
          ease: EASE_LAYER,
          opacity: 1,
          y: 0
        },
        0.16 * i
      )
    }

    timelineRef.current
      .addLabel('halfway', 0.16 * (layers.length - 1) + DURATION * 1.2)
      .call(
        () => {
          layers
            .filter((_, pos) => pos != layers.length - 1)
            .forEach((panel) => {
              const target = panel?.el as GSAPTweenTarget
              gsap.set(target, { opacity: 0, scale: 1 })
            })
        },
        [],
        'halfway'
      )
      .to(
        [layers[layers.length - 1]?.el, layers[layers.length - 1]?.image],
        {
          duration: DURATION,
          ease: EASE_LAYER,
          y: (index) => (index ? '105%' : '-105%')
        },
        'halfway'
      )
      .to(
        'html',
        {
          backgroundColor: '#5dfd63'
        },
        '<'
      )
      .to('.wrapper > *', {
        autoAlpha: 1,
        y: 0,
        duration: DURATION * 1.5,
        ease: EASE_LAYER,
        stagger: 0.12
      })
  }, [])

  useEffect(() => {
    const promiseArray = layers.map((layer) => {
      if (layer.format === 'jpg') {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.src = `../images/intro/${layer.assetName}.${layer.format}`
        })
      }
    })

    Promise.all(promiseArray).then(() => {
      setLoaded()
    })
  }, [setLoaded])

  useEffect(() => {
    if (!loading) {
      timelineRef.current?.timeScale(1)
      timelineRef.current?.play()
    }
  }, [loading])

  return (
    <div ref={containerRef} className={s.layers}>
      {layers.map((layer, idx) => (
        <div id="layers-item" key={idx} className={s['layers__item']}>
          {/* @ts-ignore */}
          {getLayerItem(layer)}
        </div>
      ))}
    </div>
  )
}

export default IntroAnimation
