import { MarsButton, MarsPannel, MarsIcon } from "@mars/components/MarsUI"
import { useMemo, useState } from "react"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {

    function resume() {
        mapWork.resume()
    }

    function pause() {
        mapWork.pause()
    }

    function stop() {
        mapWork.stop()
    }

    const start = () => {
        mapWork.start()
    }
    return (
        <MarsPannel visible={true} right={10} top={10} width={360}>
            <Space>
                <MarsButton onClick={start}>
                    <Space>
                        <MarsIcon icon="handle-triangle" className="icon-vertical-a"></MarsIcon>
                        <span>开始</span>
                    </Space>
                </MarsButton>


                <MarsButton onClick={pause}>
                    <Space>
                        <MarsIcon icon="pause-one" className="icon-vertical-a"></MarsIcon>
                        <span>暂停</span>
                    </Space>
                </MarsButton>


                <MarsButton onClick={resume}>
                    <Space>
                        <MarsIcon icon="handle-triangle" className="icon-vertical-a"></MarsIcon>
                        <span>继续</span>
                    </Space>
                </MarsButton>

                <MarsButton onClick={stop}>
                    <Space>
                        <MarsIcon icon="power" className="icon-vertical-a"></MarsIcon>
                        <span>停止</span>
                    </Space>
                </MarsButton>
            </Space>
        </MarsPannel>
    )
}

export default UIComponent
