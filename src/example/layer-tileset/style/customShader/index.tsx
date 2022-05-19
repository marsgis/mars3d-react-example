import * as mapWork from "./map.js"
import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.setStyleDef()
          }}
        >
          原始样式
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.setStyle1()
          }}
        >
          自定义效果1
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.setStyle2()
          }}
        >
          自定义效果2
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.setStyle3()
          }}
        >
          自定义效果3
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
