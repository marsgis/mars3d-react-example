import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "useDepthofField",
      label: "启用状态",
      value: true,
      change(value) {
        mapWork.setDepthOfField(value)
      }
    },
    {
      type: "slider",
      field: "focalDistance",
      label: "焦距",
      value: 87,
      min: 0.0,
      max: 500.0,
      step: 1,
      change(value) {
        mapWork.setFocalDistance(value)
      }
    },
    {
      type: "slider",
      field: "delta",
      label: "增量",
      value: 1,
      min: 0.1,
      max: 2.0,
      step: 0.01,
      change(value) {
        mapWork.setDelta(value)
      }
    },
    {
      type: "slider",
      field: "sigma",
      label: "Sigma",
      value: 3.78,
      min: 0.5,
      max: 5.0,
      step: 0.01,
      change(value) {
        mapWork.setSigma(value)
      }
    },
    {
      type: "slider",
      field: "stepSize",
      label: "步长",
      value: 2.46,
      min: 0.0,
      max: 7.0,
      step: 0.01,
      change(value) {
        mapWork.setStepSize(value)
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
