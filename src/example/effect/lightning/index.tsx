import { useState } from "react"
import * as mapWork from "./map.js"
import { $message, MarsForm, MarsColor, MarsFormItem, MarsSlider, MarsSwitch, MarsPannel } from "@mars/components/MarsUI"

function UIComponent() {
  const [mixHeight, onChangeHeight] = useState(0.4)
  const [interval, onChangeInterval] = useState(0.8)

  return (
    <MarsPannel visible={true} width="200px" right="10" top="10">
      <MarsForm>
        <MarsFormItem label="启用状态">
          <MarsSwitch
            defaultChecked
            onChange={(data) => {
              mapWork.setEnabled(data)
            }}
          ></MarsSwitch>
        </MarsFormItem>
        <MarsFormItem label="混合系数">
          <MarsSlider
            {...{ defaultValue: mixHeight, min: 0.0, max: 1.0, step: 0.1 }}
            onChange={(data) => {
              mapWork.setOpacity(data)
            }}
          ></MarsSlider>
        </MarsFormItem>
        <MarsFormItem label="闪电间隔">
          <MarsSlider
            {...{ defaultValue: interval, min: 0.0, max: 1.0, step: 0.1 }}
            onChange={(data) => {
              mapWork.setInterval(data)
            }}
          ></MarsSlider>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
