import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { LocationTo } from "@mars/components/MarsSample/LocationTo.jsx"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  // 通视分析
  const drawLine = () => {
    mapWork.drawLine()
  }
  // 圆形通视分析
  const drawCircle = () => {
    mapWork.drawCircle()
  }

  // 清除
  const clearAll = () => {
    mapWork.clearAll()
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <Space>
          <MarsButton onClick={drawLine}>通视分析</MarsButton>
          <MarsButton onClick={drawCircle}>圆形通视分析</MarsButton>
          <MarsButton onClick={clearAll}>清除</MarsButton>
          <MarsButton href="editor.html?id=thing/analysis/sightline-terrain" target="_blank">
            地形精确分析示例
          </MarsButton>
        </Space>
      </MarsPannel>

      <LocationTo />
    </>
  )
}

export default UIComponent
