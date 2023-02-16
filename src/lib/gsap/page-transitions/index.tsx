import * as React from 'react'

import useIsomorphicLayoutEffect from '~/hooks/use-isomorphic-layout-effect'

import { clearSavedPageStyles, savePageStyles } from './save-page-styles'

type TransitionCallback = (newPathname: string) => Promise<void>
type TransitionOptions = { index?: number; kill?: boolean }

type GetTransitionSpace = (
  callback: TransitionCallback,
  options?: TransitionOptions
) => void
const TransitionContext = React.createContext<
  | {
      transitionsListRef: React.MutableRefObject<
        Array<{
          callback: TransitionCallback
          options?: TransitionOptions
        }>
      >
      getTransitionSpace: GetTransitionSpace
    }
  | undefined
>(undefined)

const TransitionContextProvider = ({
  children
}: {
  children?: React.ReactNode
}) => {
  const transitionsListRef = React.useRef<
    Array<{ callback: TransitionCallback; options?: TransitionOptions }>
  >([])

  const getTransitionSpace: GetTransitionSpace = React.useCallback(
    (callback: TransitionCallback, options) => {
      if (options?.index) {
        transitionsListRef.current.splice(options.index, 0, {
          callback,
          options
        })
      } else {
        transitionsListRef.current.push({ callback, options })
      }
    },
    []
  )

  return (
    <TransitionContext.Provider
      value={{ transitionsListRef, getTransitionSpace }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => {
  const ctx = React.useContext(TransitionContext)
  if (ctx === undefined) {
    throw new Error(
      'usePageTransition must be used within a PageTransitionsProvider'
    )
  }
  return ctx
}

// This is another component so that it doesn't trigger a re-render in the context provider
const TransitionLayout = React.memo(
  ({ children }: { children?: React.ReactNode }) => {
    const [displayChildren, setDisplayChildren] = React.useState(children)
    const { transitionsListRef } = usePageTransition()
    const oldPathnameRef = React.useRef<string>('')
    // const { scroll } = useAppContext()

    React.useEffect(() => {
      // init pathname
      oldPathnameRef.current = window.location.pathname
    }, [])

    useIsomorphicLayoutEffect(() => {
      const newPathname = window.location.pathname
      if (
        children !== displayChildren &&
        oldPathnameRef.current !== newPathname
      ) {
        savePageStyles()
        if (transitionsListRef.current.length === 0) {
          // there are no outro animations, so immediately transition
          setDisplayChildren(children)
          oldPathnameRef.current = newPathname
          clearSavedPageStyles()

          // setTransitioned(true)
        } else {
          // setTransitioned(false)
          // scroll?.stop()
          const transitionsPromise = transitionsListRef.current.map(
            async (transition) => {
              await transition.callback(newPathname)
              return transition
            }
          )
          Promise.all(transitionsPromise)
            .then((resolvedTransitions) => {
              setDisplayChildren(children)
              oldPathnameRef.current = newPathname
              transitionsListRef.current = resolvedTransitions.filter((t) =>
                t.options?.kill ? false : true
              )
              clearSavedPageStyles()
            })
            .then(() => {
              // setTransitioned(true)
              // scroll?.start()
            })
        }
      }
    }, [
      children,
      displayChildren,
      /* setTransitioned ,*/
      transitionsListRef /*, scroll */
    ])

    return <>{displayChildren}</>
  }
)

export const PageTransitionsProvider = ({
  children
}: {
  children?: React.ReactNode
}) => {
  return (
    <TransitionContextProvider>
      <TransitionLayout>{children}</TransitionLayout>
    </TransitionContextProvider>
  )
}
