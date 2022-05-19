import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

// 面求交
const intersect = () => {
  mapWork.intersect()
}
// 清除
const clearAll = () => {
  mapWork.clear()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={intersect}>求交</MarsButton>
        <MarsButton onClick={clearAll}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
