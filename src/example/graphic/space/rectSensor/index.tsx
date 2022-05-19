import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "show",
      label: "四棱锥体:",
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
      extraWidth: 65,
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
      extraWidth: 65,
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
      extraWidth: 65,
      change(roll) {
        mapWork.rollChange(roll)
      }
    },

    {
      type: "slider",
      field: "angle1",
      label: "夹角1:",
      step: 0.01,
      min: 0,
      max: 89,
      value: 5,
      extra: "{angle1}°",
      extraWidth: 65,
      change(angle) {
        mapWork.angle1(angle)
      }
    },
    {
      type: "slider",
      field: "angle2",
      label: "夹角2:",
      step: 0.01,
      min: 0,
      max: 89,
      value: 5,
      extra: "{angle2}°",
      extraWidth: 65,
      change(angle) {
        mapWork.angle2(angle)
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
    <MarsPannel visible={true} right={10} top={10} width={280}>
      <MarsGui
        options={options}
        formProps={{
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
