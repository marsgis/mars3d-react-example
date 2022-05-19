import { MarsForm, MarsFormItem, MarsPannel, MarsGui, MarsButton } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState } from "react"
import { Space } from "antd"

function UIComponent() {
  const [widthValue, setWidthValue] = useState(280)
  const [heightValue, setHeightValue] = useState(30)
  const [speedValue, setSpeedValue] = useState(10)

  const options: GuiItem[] = [
    {
      type: "number",
      field: "widthValue",
      label: "河宽度(米):",
      value: 280,
      change(value) {
        mapWork.widthChange(value)
        setWidthValue(value)
      }
    },
    {
      type: "number",
      field: "heightValue",
      label: "河高度(米):",
      value: 30,
      change(value) {
        mapWork.heightChange(value)
        setHeightValue(value)
      }
    },
    {
      type: "slider",
      field: "speedValue",
      label: "水流速(米/秒):",
      value: 10,
      min: 0,
      max: 50,
      change(value) {
        mapWork.speedChange(value)
        setSpeedValue(value)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <LayerState />
        </MarsFormItem>
        <MarsFormItem label="建议："> 顺着水流方向选点，直线时多采集点 </MarsFormItem>
        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
        <MarsFormItem>
          <Space>
            <MarsButton
              onClick={() => {
                mapWork.drawLine(widthValue, heightValue, speedValue)
              }}
            >
              绘制河流
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.addHeight()
              }}
            >
              升高30米
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.lowerHeight()
              }}
            >
              降低30米
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.clear()
              }}
            >
              清除
            </MarsButton>
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
