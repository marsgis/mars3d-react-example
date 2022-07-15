import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsFormItem, MarsButton, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useRef } from "react"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const options: GuiItem[] = [
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
    <MarsPannel visible={true} right="10" top="10">
      <GraphicLayerState drawLabel1="贴地矩形" defaultCount={10} drawLabel2="竖立墙" />
      <MarsGui options={options} ref={marsGuiRef}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
