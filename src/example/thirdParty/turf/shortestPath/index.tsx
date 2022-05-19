import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

// 绘制障碍面
const drawPolygon = () => {
  mapWork.drawPolygon()
}
// 绘制起点
const startPoint = () => {
  mapWork.startPoint()
}
// 绘制终点
const endPoint = () => {
  mapWork.endPoint()
}
// 计算最短路径
const shortestPath = () => {
  mapWork.shortestPath()
}
// 清除
const clearAll = () => {
  mapWork.clearLayer()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <span>数据:</span>
        <MarsButton onClick={drawPolygon}>绘制障碍面</MarsButton>
        <MarsButton onClick={startPoint}>绘制起点</MarsButton>
        <MarsButton onClick={endPoint}>绘制终点</MarsButton>
      </Space>

      <div className="f-pt">
        <Space>
          <span>计算:</span>
          <MarsButton onClick={shortestPath}>最短路径</MarsButton>
          <MarsButton onClick={clearAll}>清除</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
