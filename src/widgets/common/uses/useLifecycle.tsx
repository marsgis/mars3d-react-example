import { useEffect, useMemo, Component } from "react"

export function useLifecycle(mapWork: any) {
  useMemo(() => {
    if (mapWork.onMounted && !mapWork.onMounted._load) {
      mapWork.onMounted(window._mapInstance)
      mapWork.onMounted._load = true
    }
    return false
  }, undefined)

  useEffect(
    () => () => {
      if (mapWork.onUnmounted) {
        mapWork.onUnmounted()
      }
      if (mapWork.onMounted) {
        mapWork.onMounted._load = false
      }
    },
    []
  )
}

export function withLifeCyle(WrappedComponent: any, mapWork) {
  class WithLifeCyle extends Component {
    constructor(props) {
      super(props)
      if (mapWork.onMounted && !mapWork.onMounted._load) {
        mapWork.onMounted(window._mapInstance)
        mapWork.onMounted._load = true
      }
      if (mapWork.onUnmounted) {
        mapWork.onUnmounted._load = false
      }
    }

    componentWillUnmount() {
      if (mapWork.onUnmounted && !mapWork.onUnmounted._load) {
        mapWork.onUnmounted()
        mapWork.onUnmounted._load = true
      }
      if (mapWork.onMounted) {
        mapWork.onMounted._load = false
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return WithLifeCyle
}
