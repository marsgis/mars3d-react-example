import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsButton, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useRef } from "react"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const options: GuiItem[] = [
    {
      type: "custom",
      label: "标绘:",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.drawRectangle()
            }}
          >
            贴地矩形
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.drawPolygon(true)
            }}
          >
            贴地面
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.drawPolygon(false)
            }}
          >
            立体面
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()
            }}
          >
            清除
          </MarsButton>
        </Space>
      )
    },
    {
      type: "slider",
      field: "angleValue",
      label: "方向",
      step: 1,
      min: 0,
      max: 360,
      value: 10,
      extra: "{angleValue}°",
      change(data) {
        marsGuiRef.current.updateField("angleValue", data)
        mapWork.angleChange(data)
      }
    },
    {
      type: "custom",
      label: "状态:",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.videoPlay()
            }}
          >
            播放
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.videoStop()
            }}
          >
            暂停
          </MarsButton>
        </Space>
      )
    }
  ]
  return (
    <MarsPannel visible={true} right="10" top="10" width="420">
      <LayerState />

      <MarsGui options={options} ref={marsGuiRef} formProps={{ labelCol: { span: 4 } }}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
