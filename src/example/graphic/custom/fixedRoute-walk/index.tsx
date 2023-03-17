import { FixedRouteInfo } from "@mars/components/MarsSample/FixedRouteInfo/index"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [isStart, setIsStart] = useState(false)
  const [isPause, setIsPause] = useState(false)

  useMemo(() => {
    mapWork.eventTarget.on("endRoam", () => {
      udpateState()
    })
  }, [])

  // 按钮事件
  const btnStart = () => {
    mapWork.fixedRoute.start() // 启动漫游

    udpateState()
  }

  const btnPause = () => {
    mapWork.fixedRoute.pause()
    udpateState()
  }

  const btnProceed = () => {
    mapWork.fixedRoute.proceed()
    udpateState()
  }

  const btnStop = () => {
    mapWork.fixedRoute.stop()
    udpateState()
  }

  function udpateState() {
    setTimeout(() => {
      setIsStart(mapWork.fixedRoute.isStart)
      setIsPause(mapWork.fixedRoute.isPause)
    }, 100)
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <Space>
          {!isStart ? <MarsButton onClick={btnStart}>开始</MarsButton> : ""}
          {isStart && !isPause ? <MarsButton onClick={btnPause}>暂停</MarsButton> : ""}
          {isStart && isPause ? <MarsButton onClick={btnProceed}>继续</MarsButton> : ""}
          {isStart ? <MarsButton onClick={btnStop}>停止</MarsButton> : ""}
        </Space>
      </MarsPannel>
      <FixedRouteInfo />
    </>
  )
}

export default UIComponent
