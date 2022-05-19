import { MarsButton, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="框选数据">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.drawRectangle()
            }}
          >
            矩形
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.drawPolygon()
            }}
          >
            面
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.drawCircle()
            }}
          >
            圆
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()
            }}
          >
            清除
          </MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
