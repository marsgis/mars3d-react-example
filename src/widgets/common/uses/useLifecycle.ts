import { useEffect, useMemo } from "react"

export function useLifecycle(mapWork: any) {
  const mapInstance = window._mapInstance
  useMemo(() => {
    if (mapWork.onMounted) {
      mapWork.onMounted(mapInstance)
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
