import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={() => mapWork.drawLine()}>绘制线</MarsButton>
        <MarsButton onClick={() => mapWork.crossPoint()}>计算相交点</MarsButton>
        <MarsButton onClick={() => mapWork.clearAll()}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
