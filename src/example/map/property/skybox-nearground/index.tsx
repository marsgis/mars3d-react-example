import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.sunny()
          }}
        >
          晴天
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.sunsetGlow()
          }}
        >
          晚霞
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.blueSky()
          }}
        >
          蓝天
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.defaultSky()
          }}
        >
          默认
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
