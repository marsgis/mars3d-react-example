import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "show",
      label: "圆锥体:",
      value: true,
      change(enabledShowHide) {
        mapWork.sensorShowHide(enabledShowHide)
      }
    },
    {
      type: "number",
      field: "lengthValue",
      label: "长度:",
      step: 0.01,
      min: 1,
      max: 999999999,
      value: 700000,
      change(data) {
        mapWork.sensorLength(data)
      }
    },
    {
      type: "slider",
      field: "heading",
      label: "方向角:",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      extra: "{heading}°",
      extraWidth: 70,
      change(heading) {
        mapWork.headingChange(heading)
      }
    },
    {
      type: "slider",
      field: "pitch",
      label: "俯仰角:",
      step: 0.01,
      min: -180,
      max: 180,
      value: 40,
      extra: "{pitch}°",
      extraWidth: 70,
      change(pitch) {
        mapWork.pitchChange(pitch)
      }
    },

    {
      type: "slider",
      field: "roll",
      label: "左右角:",
      step: 0.01,
      min: -180,
      max: 180,
      value: 40,
      extra: "{roll}°",
      extraWidth: 70,
      change(roll) {
        mapWork.rollChange(roll)
      }
    },

    {
      type: "slider",
      field: "angle",
      label: "夹角:",
      step: 0.01,
      min: 0,
      max: 89,
      value: 5,
      extra: "{angle}°",
      extraWidth: 70,
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
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10} width={260}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
