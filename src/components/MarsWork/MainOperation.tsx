import { lazy, Suspense, useEffect, Component } from "react"
import { getQueryString } from "@mars/utils/mars-util"
const modules = import.meta.glob("../../example/**/index.tsx")

const componentName = getQueryString("id")

function Fallback({ lazyLoaded }) {
  useEffect(
    () => () => {
      lazyLoaded()
    },
    [lazyLoaded]
  )
  return <></>
}

class ErrorBoundary extends Component<any> {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <></>
    }

    return this.props.children
  }
}

function MainOperation({ beforeMounted }) {
  if (componentName) {
    // @ts-ignore
    const PannelComponent = lazy(modules[`../../example/${componentName}/index.tsx`])
    return (
      <ErrorBoundary>
        <Suspense fallback={<Fallback lazyLoaded={beforeMounted}></Fallback>}>
          <PannelComponent></PannelComponent>
        </Suspense>
      </ErrorBoundary>
    )
  } else {
    return <></>
  }
}

export default MainOperation
