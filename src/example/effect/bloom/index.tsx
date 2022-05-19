import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "useBloom",
      label: "启用状态",
      value: true,
      change(value) {
        mapWork.setBloomEffect(value)
      }
    },
    {
      type: "slider",
      field: "contrast",
      label: "对比度",
      value: 128,
      min: -255.0,
      max: 255.0,
      step: 0.01,
      change(value) {
        mapWork.setContrast(value)
      }
    },
    {
      type: "slider",
      field: "brightness",
      label: "亮度",
      value: -0.3,
      min: -0.1,
      max: 3.0,
      step: 0.01,
      change(value) {
        mapWork.setBrightness(value)
      }
    },
    {
      type: "slider",
      field: "delta",
      label: "增量",
      value: 1.0,
      min: 1,
      max: 5,
      step: 0.01,
      change(value) {
        mapWork.setDelta(value)
      }
    },
    {
      type: "slider",
      field: "stepSize",
      label: "步长",
      value: 5.0,
      min: 0,
      max: 7,
      step: 0.01,
      change(value) {
        mapWork.setStep(value)
      }
    },
    {
      type: "slider",
      field: "sigma",
      label: "Sigma",
      value: 3.78,
      min: 1,
      max: 10,
      step: 0.01,
      change(value) {
        mapWork.setSigma(value)
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
