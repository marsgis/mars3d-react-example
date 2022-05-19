import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

// 绘制线
const drawLine = () => {
  mapWork.drawLine()
}

// 清除
const clearAll = () => {
  mapWork.clearGraphicLayer()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={drawLine}>绘制线</MarsButton>
        <MarsButton onClick={clearAll}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
