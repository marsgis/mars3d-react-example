import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState defaultCount={1000} enabledDraw={false} />
        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">样例数据:</span>
            <MarsButton onClick={() => mapWork.addDemoGraphic1()}>合肥建筑物</MarsButton>
          </Space>
        </div>
      </MarsPannel>
    </>
  )
}

export default UIComponent
