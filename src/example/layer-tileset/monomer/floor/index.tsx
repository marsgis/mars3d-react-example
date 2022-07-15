import * as mapWork from "./map.js"
import { MarsSwitch, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        显示每层颜色:
        <MarsSwitch
          defaultChecked
          onChange={(data) => {
            mapWork.chkShowColor(data)
          }}
        ></MarsSwitch>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
