import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <span>提示：请单击地图，分析拾取点最近的体育场所。</span>
        <MarsButton onClick={() => mapWork.clearAll()}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
