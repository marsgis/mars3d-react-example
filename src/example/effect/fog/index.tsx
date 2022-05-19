import { useState } from "react"
import * as mapWork from "./map.js"
import { $message, MarsForm, MarsColor, MarsFormItem, MarsSlider, MarsSwitch, MarsPannel } from "@mars/components/MarsUI"

function UIComponent() {
  const [color, onChangeColor] = useState("#ffffff")
  const [fogByDistanceX, onChangeDistanceX] = useState(100)
  const [fogByDistanceZ, onChangeDistanceZ] = useState(9000)

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
            onChange={(data) => {
              onChangeColor(data.target.value)
              mapWork.setColor(data.target.value)
            }}
          ></MarsColor>
        </MarsFormItem>
        <MarsFormItem label="近距离">
          <MarsSlider
            {...{ defaultValue: fogByDistanceX, min: 1, max: 5000, step: 1 }}
            onChange={(data) => {
              onChangeDistanceX(data)
              if (fogByDistanceX > fogByDistanceZ) {
                $message("近距离 不能大于 远距离")
                return
              }
              mapWork.setDistanceX(fogByDistanceX)
            }}
          ></MarsSlider>
        </MarsFormItem>
        <MarsFormItem label="远距离">
          <MarsSlider
            {...{ defaultValue: fogByDistanceZ, min: 100, max: 50000, step: 1 }}
            onChange={(data) => {
              onChangeDistanceZ(data)
              if (fogByDistanceX > fogByDistanceZ) {
                $message("远距离 不能小于 近距离")
                return
              }
              mapWork.setDistanceZ(data)
            }}
          ></MarsSlider>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
