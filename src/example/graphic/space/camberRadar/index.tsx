import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect } from "react"

const raderParsms = {
  outerRadius: 2000,
  innerRadius: 500,
  headingValue: 0,
  pitchValue: 0,
  rollValue: 0,
  startFovH: 180,
  endFovH: -180,
  startFovV: 0,
  endFovV: 90
}

function UIComponent() {
  useEffect(() => {
    mapWork.getViewConfig(raderParsms)
  }, [])

  const options: GuiItem[] = [
    {
      type: "slider",
      field: "heading",
      label: "方向角",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      change(headingValue) {
        mapWork.headingChange(headingValue)
      }
    },
    {
      type: "slider",
      field: "pitch",
      label: "俯仰角",
      step: 0.01,
      min: -180,
      max: 180,
      value: 0,
      change(pitchValue) {
        mapWork.pitchChange(pitchValue)
      }
    },
    {
      type: "slider",
      field: "roll",
      label: "翻滚角(roll)",
      step: 0.01,
      min: -180,
      max: 180,
      value: 0,
      change(rollValue) {
        mapWork.rollChange(rollValue)
      }
    },
    {
      type: "number",
      field: "outerRadius",
      label: "外曲面半径",
      step: 1,
      min: 1,
      max: 999999999,
      value: 2000,
      change(outerRadius) {
        mapWork.outerRadiusChange(outerRadius)
      }
    },
    {
      type: "number",
      field: "innerRadius",
      label: "内曲面半径",
      step: 1,
      min: 1,
      max: 999999999,
      value: 500,
      change(innerRadius) {
        mapWork.innerRadiusChange(innerRadius)
      }
    },

    {
      type: "slider",
      field: "startFovH",
      label: "左横截面角度",
      step: 0.01,
      min: -180,
      max: 180,
      value: 180,
      change(startFovH) {
        mapWork.startFovHChange(startFovH)
      }
    },
    {
      type: "slider",
      field: "endFovH",
      label: "右横截面角度",
      step: 0.01,
      min: -180,
      max: 180,
      value: -180,
      change(endFovH) {
        mapWork.endFovHChange(endFovH)
      }
    },
    {
      type: "slider",
      field: "startFovV",
      label: "垂直起始角度",
      step: 0.01,
      min: 0,
      max: 90,
      value: 0,
      change(startFovV) {
        mapWork.startFovVChange(startFovV)
      }
    },
    {
      type: "slider",
      field: "endFovV",
      label: "垂直结束角度",
      step: 0.01,
      min: 0,
      max: 90,
      value: 90,
      change(endFovV) {
        mapWork.endFovVChange(endFovV)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10} width={300}>
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
