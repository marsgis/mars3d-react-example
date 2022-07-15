import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState enabledDraw={false} />

        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">方法演示:</span>
            <MarsButton onClick={() => mapWork.onClickSelPoint()}>追踪目标点</MarsButton>
          </Space>
        </div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
