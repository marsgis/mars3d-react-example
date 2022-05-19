import { MarsPannel, MarsButton, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [radius, setValue] = useState(1)

  useMemo(() => {
    mapWork.radiusChange(radius)
  }, [radius])

  const radiusChange = (radiusVal: number) => {
    setValue(radiusVal)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">缓冲半径:</span>
          <MarsInputNumber value={radius} defaultValue={1} min={1} max={999} onChange={radiusChange}></MarsInputNumber>公里
        </Space>
      </div>

      <div>
        <Space>
          <span className="mars-pannel-item-label">绘制:</span>
          <MarsButton onClick={() => mapWork.drawPoint()}>点</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolyline()}>线</MarsButton>
          <MarsButton onClick={() => mapWork.drawPolygon()}>面</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
