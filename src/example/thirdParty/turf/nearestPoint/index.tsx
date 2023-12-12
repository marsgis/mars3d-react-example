import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <span>绘制:</span>
        <MarsButton onClick={() => mapWork.drawPoint()}>选择点</MarsButton>
        <MarsButton onClick={() => mapWork.clearAll()}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
