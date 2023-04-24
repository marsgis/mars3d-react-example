import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"


function UIComponent() {

    const [isStart, setIsStart] = useState(false)
    const [isPause, setIsPause] = useState(false)

    const startPlay = () => {
        mapWork.circleFixedRoute.start() // 启动漫游
        mapWork.attackFixedRoute.start() // 启动漫游
        udpateState()
    }

    const pausePlay = () => {
        mapWork.circleFixedRoute.pause()
        mapWork.attackFixedRoute.pause()
        udpateState()
    }

    const proceedPlay = () => {
        mapWork.circleFixedRoute.proceed()
        mapWork.attackFixedRoute.proceed()
        udpateState()
    }

    const stopPlay = () => {
        mapWork.stopPlay(true)
    }

    mapWork.eventTarget.on("changeFixedRoute", udpateState)
    function udpateState() {
        setTimeout(() => {
            setIsStart(mapWork.circleFixedRoute.isStart)
            setIsPause(mapWork.circleFixedRoute.isPause)
        }, 100)
    }

    return (
        <MarsPannel visible={true} right={10} top={10}>
            <Space>
                {!isStart ? <MarsButton onClick={startPlay}>开始</MarsButton> : ""}
                {isStart && !isPause ? <MarsButton onClick={pausePlay}>暂停</MarsButton> : ""}
                {isStart && isPause ? <MarsButton onClick={proceedPlay}>继续</MarsButton> : ""}
                {isStart ? <MarsButton onClick={stopPlay}>停止</MarsButton> : ""}
            </Space>
        </MarsPannel>
    )
}

export default UIComponent
