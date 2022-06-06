import { MarsPannel, MarsButton, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"
import "./index.css"

function UIComponent() {
  const [angle, setAngleVaue] = useState(45)
  const [distance, setDistanceVaue] = useState(1)
  const [scale, setScaleVaue] = useState(2)

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <span>原始数据:</span>
          <MarsButton onClick={() => mapWork.drawPolygon()}>绘制面</MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>旋转角度:</span>
          <MarsInputNumber
            defaultValue={45}
            onChange={(value: number) => {
              setAngleVaue(value)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.spinPolygons(angle)
            }}
          >
            旋转面
          </MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>平移距离:</span>
          <MarsInputNumber
            value={distance}
            defaultValue={1}
            onChange={(value: number) => {
              setDistanceVaue(value)
            }}
          ></MarsInputNumber>

          <MarsButton
            onClick={() => {
              mapWork.translationPolygons(distance)
            }}
          >
            平移面
          </MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>缩放比例:</span>
          <MarsInputNumber
            value={scale}
            min={0}
            max={10}
            defaultValue={2}
            onChange={(value: number) => {
              setScaleVaue(value)
            }}
          ></MarsInputNumber>

          <MarsButton
            onClick={() => {
              mapWork.zoomPolygons(scale)
            }}
          >
            缩放面
          </MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
