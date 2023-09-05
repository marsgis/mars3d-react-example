import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "switch",
      field: "enabled",
      label: "开启效果：",
      value: true,
      change(value) {
        mapWork.changeState(value)
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
        type: "switch",
        field: "onlySelected",
        label: "只显示选中",
        value: false,
        change(value) {
          mapWork.changeOnlySelected(value)
        }
    },
    {
        type: "switch",
        field: "showPlane",
        label: "边缘平面",
        value: false,
        change(value) {
          mapWork.changeShowPlane(value)
        }
    },
    {
        type: "number",
        field: "width",
        label: "线宽",
        value: "6",
        change(value) {
            mapWork.changeWidth(value)
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
    },
    {
        type: "slider",
        field: "planeAngle",
        label: "法线夹角",
        value: 10.0,
        min: 0,
        max: 360,
        step: 0.01,
        change(value) {
          mapWork.changePlaneAngle(value)
        }
    },
    {
        type: "color",
        field: "color",
        label: "轮廓线颜色",
        value: "#fff",
        change(value) {
          mapWork.changeColor(value)
        }
    },
    {
        type: "color",
        field: "colorHidden",
        label: "被遮挡轮廓线颜色",
        value: "#fff",
        change(value) {
          mapWork.changeColorHidden(value)
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
