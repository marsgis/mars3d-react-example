import * as mapWork from "./map.js"
import { MarsGui, MarsPannel, MarsCollapse } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const changeOpacity = (attribute: string, val: number) => {
    mapWork.setLayerOptions(attribute, val)
  }
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "brightness",
      label: "亮度",
      step: 0.01,
      min: 0,
      max: 3,
      value: 1.0,
      extra: "{brightness}",
      extraWidth: 40,
      change(data) {
        changeOpacity("brightness", data)
      }
    },
    {
      type: "slider",
      field: "contrast",
      label: "对比度",
      step: 0.01,
      min: 0,
      max: 3,
      value: 1.16,
      extra: "{contrast}",
      extraWidth: 40,
      change(data) {
        changeOpacity("contrast", data)
      }
    },
    {
      type: "slider",
      field: "hue",
      label: "色彩",
      step: 0.01,
      min: 0,
      max: 3,
      value: 0.1,
      extra: "{hue}",
      extraWidth: 40,
      change(data) {
        changeOpacity("hue", data)
      }
    },
    {
      type: "slider",
      field: "saturation",
      label: "饱和度",
      step: 0.01,
      min: 0,
      max: 3,
      value: 1.0,
      extraWidth: 40,
      extra: "{saturation}",
      change(data) {
        changeOpacity("saturation", data)
      }
    },
    {
      type: "slider",
      field: "gamma",
      label: "伽马值",
      step: 0.01,
      min: 0,
      max: 3,
      value: 0.53,
      extra: "{gamma}",
      extraWidth: 40,
      change(data) {
        changeOpacity("gamma", data)
      }
    },
    {
      type: "slider",
      field: "opacity",
      label: "透明度",
      step: 0.01,
      min: 0,
      max: 3,
      value: 1.0,
      extra: "{opacity}",
      extraWidth: 40,
      change(data) {
        changeOpacity("opacity", data)
      }
    }
  ]
  return (
    <MarsPannel visible={true} right="10" top="10" width="280">
      <MarsCollapse
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "瓦片底图通用参数",
            children: <MarsGui options={options} formProps={{ labelCol: { span: 5 } }}></MarsGui>
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
