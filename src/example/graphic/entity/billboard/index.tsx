import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState />

        <div className="f-mb f-pt">
          <Space>
            <span className="mars-pannel-item-label">方法演示:</span>
            <MarsButton onClick={() => mapWork.btnStartBounce()}>开始弹跳</MarsButton>
            <MarsButton onClick={() => mapWork.btnStartBounce2()}>开始弹跳（自动停止）</MarsButton>
            <MarsButton onClick={() => mapWork.btnStopBounce()}>停止弹跳</MarsButton>
          </Space>
        </div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
