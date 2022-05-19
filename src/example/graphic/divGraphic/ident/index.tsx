import { MarsButton, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.divGraphicYellow()
          }}
        >
          效果一
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.divGraphicBule()
          }}
        >
          效果二
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.divGraphicWhite()
          }}
        >
          效果三
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.divGraphicHotSpot()
          }}
        >
          效果四
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
