import { useRouter } from 'next/router'
import Script from 'next/script'
import * as React from 'react'

import { gaTrackingId } from './constants'

declare global {
  interface Window {
    gtag: undefined | ((...args: any[]) => void)
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!window.gtag) {
    console.warn('window.gtag is not defined')
    return
  }
  window.gtag('config', gaTrackingId, {
    page_path: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value
}: {
  action: string
  category: string
  label: string
  value: string
}) => {
  if (!window.gtag) {
    console.warn('window.gtag is not defined')
    return
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}

// Put this in _document.tsx
export const GAScripts = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingId}', {
              page_path: window.location.pathname,
            }); 
          `
        }}
      />
      <Script
        id="meta-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1991179394562719');
            fbq('track', 'PageView'); 
          `
        }}
      />
      <>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXXX&ev=PageView&noscript=1" />`
          }}
        />
      </>
    </>
  )
}

// Use this hook in _app.tsx
export const useAppGA = () => {
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
