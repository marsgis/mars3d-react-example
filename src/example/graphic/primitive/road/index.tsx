import { MarsForm, MarsFormItem, MarsPannel, MarsGui, MarsButton } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState } from "react"
import { Space } from "antd"

function UIComponent() {
  const [widthValue, setWidthValue] = useState(20)
  const [heightValue, setHeightValue] = useState(1)
  const [alphaValue, setAlphaValue] = useState(1)

  const options: GuiItem[] = [
    {
      type: "number",
      field: "widthValue",
      label: "路宽度(米):",
      value: 20,
      change(value) {
        mapWork.widthChange(value)
        setWidthValue(value)
      }
    },
    {
      type: "number",
      field: "heightValue",
      label: "路高度(米):",
      value: 1,
      change(value) {
        mapWork.heightChange(value)
        setHeightValue(value)
      }
    },
    {
      type: "slider",
      field: "speedValue",
      label: "透明度(米/秒):",
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      change(value) {
        mapWork.alphaChange(value)
        setAlphaValue(value)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <LayerState />
        </MarsFormItem>
        <MarsFormItem label="建议："> 顺着道路方向选点，直线时多采集点 </MarsFormItem>
        <MarsGui options={options} formProps={{ labelCol: { span: 7 } }}></MarsGui>
        <MarsFormItem>
          <Space>
            <MarsButton
              onClick={() => {
                mapWork.drawLine(widthValue, heightValue, alphaValue)
              }}
            >
              绘制道路
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.clearLayer()
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
