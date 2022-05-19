import * as mapWork from "./map.js"
import { MarsButton, MarsFormItem, MarsInputNumber, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"

function UIComponent(props) {
  const [height, setHeight] = useState(2.0)
  const [time, setTime] = useState(3.0)

  return (
    <MarsPannel visible={true} right="10" top="10">
      <div className="f-tac f-mb">闸门控制</div>

      <MarsFormItem label="高度（米）">
        <MarsInputNumber
          defaultValue={height}
          {...{ min: 0, max: 10, step: 0.1 }}
          onChange={(data: number) => {
            setHeight(data)
          }}
        ></MarsInputNumber>
      </MarsFormItem>

      <MarsFormItem label="时长（秒）">
        <MarsInputNumber
          defaultValue={time}
          {...{ min: 0, max: 4, step: 0.1 }}
          onChange={(data: number) => {
            setTime(data)
          }}
        ></MarsInputNumber>
      </MarsFormItem>

      <div className="f-tac">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.openZm(height, time)
            }}
          >
            开启
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.closeZm(height, time)
            }}
          >
            关闭
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
