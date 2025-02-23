import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <GraphicLayerState drawLabel1={"绘制轨迹"} />
      <div className="f-mb">
        <Space>
          <MarsButton onClick={mapWork.startAll}>开始</MarsButton>
          <MarsButton onClick={mapWork.stopAll}>停止</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
