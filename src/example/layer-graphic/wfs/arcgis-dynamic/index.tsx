import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.addLayer()
          }}
        >
          叠加图层
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.removeLayer()
          }}
        >
          移除图层
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
