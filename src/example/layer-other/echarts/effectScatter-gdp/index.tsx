import { MarsCheckbox, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect } from "react"

function UIComponent() {
  useEffect(() => {
    // 创建Echarts图层
    mapWork.createEchartsLayer(true)
  }, [])

  return (
    <MarsPannel visible={true} left="10" top="10" height={45} width={160}>
      <MarsCheckbox
        onChange={(e) => {
          mapWork.chkPointerEvents(e.target.checked)
        }}
      >
        启用Echars交互
      </MarsCheckbox>
    </MarsPannel>
  )
}

export default UIComponent
