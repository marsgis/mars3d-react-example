import { useEffect, useMemo, Component } from "react"

export function useLifecycle(mapWork: any) {
  useMemo(() => {
    if (mapWork.onMounted) {
      mapWork.onMounted(window._mapInstance)
    }
  }, [])

  useEffect(
    () => () => {
      if (mapWork.onUnmounted) {
        mapWork.onUnmounted()
      }
    },
    []
  )
}

export function withLifeCyle(WrappedComponent: any, mapWork) {
  class WithLifeCyle extends Component {
    constructor(props) {
      console.log("WithLifeCyle onMounted执行")
      super(props)
      if (mapWork.onMounted) {
        mapWork.onMounted(window._mapInstance)
      }
    }

    componentWillUnmount() {
      if (mapWork.onUnmounted) {
        mapWork.onUnmounted()
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return WithLifeCyle
}
