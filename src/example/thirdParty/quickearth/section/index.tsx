import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton onClick={mapWork.drawLine}>绘制线</MarsButton>
        <MarsButton onClick={mapWork.drawRectangle}>绘制矩形</MarsButton>
        <MarsButton onClick={mapWork.drawCircle}>绘制圆</MarsButton>
        <MarsButton onClick={mapWork.removeSectionPath}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
