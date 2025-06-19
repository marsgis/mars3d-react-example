import { useState } from "react"
import * as mapWork from "./map.js"
import { $message, MarsForm, MarsColor, MarsFormItem, MarsSlider, MarsSwitch, MarsPannel } from "@mars/components/MarsUI"

function UIComponent() {
  const [color, onChangeColor] = useState("#ffffff")
  const [height, onChangeHeight] = useState(300)
  const [distance, onChangeDistance] = useState(0.6)

  return (
    <MarsPannel visible={true} width="200px" right="10" top="10">
      <MarsForm>
        <MarsFormItem label="启用状态">
          <MarsSwitch
            defaultChecked
            onChange={(data) => {
              mapWork.setFogEffect(data)
            }}
          ></MarsSwitch>
        </MarsFormItem>
        <MarsFormItem label="雾颜色">
          <MarsColor
            {...{ value: color }}
            onChange={(value) => {
              onChangeColor(value)
              mapWork.setColor(value)
            }}
          ></MarsColor>
        </MarsFormItem>
        <MarsFormItem label="高度">
          <MarsSlider
            {...{ defaultValue: height, min: 1, max: 2000, step: 1 }}
            onChange={(data) => {
              mapWork.setFogHeight(data)
            }}
          ></MarsSlider>
        </MarsFormItem>
        <MarsFormItem label="浓度">
          <MarsSlider
            {...{ defaultValue: distance, min: 0.1, max: 1.0, step: 0.1 }}
            onChange={(data) => {
              mapWork.setGlobalDensity(data)
            }}
          ></MarsSlider>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
