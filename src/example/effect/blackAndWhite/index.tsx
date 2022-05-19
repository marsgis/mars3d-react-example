import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "useBlackWhite",
      label: "启用状态",
      value: true,
      change(value) {
        mapWork.setEnabled(value)
      }
    },
    {
      type: "slider",
      field: "gradations",
      label: "渐变量",
      value: 4,
      min: 1,
      max: 10,
      step: 0.01,
      change(value) {
        mapWork.setGradations(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="200px" right="10" top="10">
      <MarsGui options={options} formProps></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
