import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsFormItem, MarsSwitch, MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [checkedValue, setValue] = useState(true)

  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="启用状态:">
        <MarsSwitch
          defaultChecked={checkedValue}
          onChange={(value) => {
            setValue(value)
            mapWork.chkOpen(value)
          }}
        ></MarsSwitch>
      </MarsFormItem>
      <MarsFormItem label="键盘漫游:">
        <span>单击地图激活后按 W前进、 S后退、A左移、D右移</span>
      </MarsFormItem>
      <MarsFormItem label="自动漫游:">
        <Space>
          <MarsButton
            onClick={() => {
              if (checkedValue) {
                mapWork.startAuto()
              }
            }}
          >
            开始自动漫游
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.stopAuto()
            }}
          >
            停止自动漫游
          </MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
