import { MarsButton, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="视角">
        <Space>
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
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
