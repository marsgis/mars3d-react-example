import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.to2d()
          }}
        >
          切换为二维视图
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.to3d()
          }}
        >
          切换为三维视图
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.toGLB()
          }}
        >
          切换为2.5D维视图
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
