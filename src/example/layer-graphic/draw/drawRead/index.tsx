import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsButton, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <LayerState direction="horizontal"></LayerState>

      <div className="f-pt ">
        <Space>
          <span className="mars-pannel-item-label">视角:</span>
          <MarsButton
            onClick={() => {
              mapWork.startPoint()
            }}
          >
            起点
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.halfWayPoint()
            }}
          >
            半程点
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.endPoint()
            }}
          >
            终点
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.allLine()
            }}
          >
            全程路线
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
