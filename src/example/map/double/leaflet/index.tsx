import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.viewTo23D()
          }}
        >
          分屏
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.viewTo2d()
          }}
        >
          仅2D
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.viewTo3d()
          }}
        >
          仅3D
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
