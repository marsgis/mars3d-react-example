import { MarsPannel, MarsButton, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"
import "./index.css"

function UIComponent() {
  const [distance, setValue] = useState(5)

  const distanceChange = (value: number) => {
    setValue(value)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">原始数据:</span>
          <MarsButton onClick={() => mapWork.drawLine()}>绘制线</MarsButton>
          <MarsButton onClick={() => mapWork.clearLayer()}>清除</MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">计算平行线:</span>
          <MarsInputNumber value={distance} min={1} max={10} defaultValue={5} onChange={distanceChange}></MarsInputNumber>
          (公里)
          <MarsButton
            onClick={() => {
              mapWork.parallelLines(distance)
            }}
          >
            计算
          </MarsButton>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">计算曲线:</span>
          <MarsButton onClick={() => mapWork.calculationCurve()}>计算</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
