import * as mapWork from "./map.js"
import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.show()
          }}
        >
          无
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.show1()
          }}
        >
          背景1
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.show2()
          }}
        >
          背景2
        </MarsButton>

        <MarsButton
          onClick={() => {
            mapWork.show3()
          }}
        >
          背景3
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
