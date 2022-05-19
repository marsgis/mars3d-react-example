import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "useBrightness",
      label: "启用状态",
      value: true,
      change(value) {
        mapWork.setBrightnessEffect(value)
      }
    },
    {
      type: "slider",
      field: "brightness",
      label: "亮度",
      value: 2,
      min: 0,
      max: 5,
      step: 0.01,
      change(value) {
        mapWork.setBrightness(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="200px" right="10" top="10">
      <MarsGui options={options} formProps={{ labelCol: { span: 9 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
