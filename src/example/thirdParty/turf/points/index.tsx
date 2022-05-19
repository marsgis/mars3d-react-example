import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <span>原始数据:</span>
        <MarsButton onClick={() => mapWork.randomPoints()}>随机点</MarsButton>
        <MarsButton onClick={() => mapWork.clearlayer()}>清除</MarsButton>
      </Space>

      <div className="f-pt">
        <Space>
          <span>相关计算:</span>
          <MarsButton onClick={() => mapWork.convexPolygon()}>计算包围面</MarsButton>
          <MarsButton onClick={() => mapWork.voronoiPolygon()}>计算泰森多边形</MarsButton>
          <MarsButton onClick={() => mapWork.tinPolygon()}>计算TIN多边形</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
