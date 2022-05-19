import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "useRain",
      label: "启用状态",
      value: true,
      change(value) {
        mapWork.setEffect(value)
      }
    },
    {
      type: "slider",
      field: "speed",
      label: "粒子速度",
      value: 10,
      min: 1,
      max: 100,
      change(value) {
        mapWork.setSpeed(value)
      }
    },
    {
      type: "slider",
      field: "size",
      label: "粒子大小",
      value: 20,
      min: 1,
      max: 100,
      change(value) {
        mapWork.setSize(value)
      }
    },
    {
      type: "slider",
      field: "direction",
      label: "粒子方向",
      value: -30,
      min: -89,
      max: 89,
      change(value) {
        mapWork.setDirection(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="220px" right="10" top="10">
      <MarsGui options={options} formProps={{ labelCol: { span: 9 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
