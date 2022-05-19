import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "show",
      label: "圆锥体",
      value: true,
      change(enabledShowHide) {
        mapWork.sensorShowHide(enabledShowHide)
      }
    },
    {
      type: "number",
      field: "radius",
      label: "半径",
      step: 1,
      min: 1,
      max: 999999,
      value: 300000,
      change(radius) {
        mapWork.sensorRadius(radius)
      }
    },
    {
      type: "slider",
      field: "angle",
      label: "夹角:",
      step: 0.01,
      min: 1,
      max: 89,
      value: 25,
      change(angle) {
        mapWork.angle(angle)
      }
    },
    {
      type: "switch",
      field: "showTop",
      label: "顶盖",
      value: true,
      change(enabledShowModelTop) {
        mapWork.sensorTop(enabledShowModelTop)
      }
    },
    {
      type: "switch",
      field: "showArea",
      label: "地面投影",
      value: false,
      change(enabledModelArea) {
        mapWork.sensorArea(enabledModelArea)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10} width={240}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
