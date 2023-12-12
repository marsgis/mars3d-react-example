import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "enabled",
      label: "开启：",
      value: true,
      change(value) {
        mapWork.changeState(value)
      }
    },
    {
      type: "color",
      field: "color",
      label: "轮廓线颜色",
      value: "#ffff00",
      change(value) {
        mapWork.changeColor(value)
      }
    },
    {
      type: "color",
      field: "colorHidden",
      label: "被遮挡线颜色",
      value: "#ffff00",
      change(value) {
        mapWork.changeColorHidden(value)
      }
    },
    {
      type: "slider",
      field: "width",
      label: "线宽",
      min: 0.1,
      max: 10,
      step: 0.1,
      value: 6,
      change(value) {
        mapWork.changeWidth(value)
      }
    },
    {
      type: "switch",
      field: "showPlane",
      label: "是否显示边缘",
      value: false,
      change(value) {
        mapWork.changeShowPlane(value)
      }
    },
    {
      type: "slider",
      field: "planeAngle",
      label: "边缘法线夹角",
      value: 10.0,
      min: 0,
      max: 10.0,
      step: 0.1,
      change(value) {
        mapWork.changePlaneAngle(value)
      }
    },
    {
      type: "switch",
      field: "glow",
      label: "发光",
      value: false,
      change(value) {
        mapWork.changeGlow(value)
      }
    },
    {
      type: "slider",
      field: "glowPower",
      label: "发光强度",
      value: 1.0,
      min: 0.0,
      max: 10.0,
      step: 0.01,
      change(value) {
        mapWork.changeGlowPower(value)
      }
    },
    {
      type: "slider",
      field: "glowStrength",
      label: "发光增量",
      value: 3.0,
      min: 0.0,
      max: 10.0,
      step: 0.01,
      change(value) {
        mapWork.changeGlowStrength(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="350px" right="10" top="10">
      <MarsGui options={options} formProps={{ labelCol: { span: 9 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
