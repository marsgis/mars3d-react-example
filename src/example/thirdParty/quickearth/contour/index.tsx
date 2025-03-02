import { MarsPannel, MarsFormItem, MarsSlider, MarsButton } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import { useState } from "react"

function UIComponent() {
  const [delta, setDelta] = useState(20)
  return (
    <MarsPannel visible={true} right="10" top="10" width="300">
      <MarsFormItem label="分析值">
        <MarsSlider
          value={delta}
          min={10.0}
          max={60.0}
          step={1.0}
          onChange={(val) => {
            setDelta(val)
          }}
        ></MarsSlider>
      </MarsFormItem>

      <MarsFormItem label="显示立体">
        <Space>
          <MarsButton onClick={() => mapWork.drawRectangle(delta)}>绘制区域</MarsButton>
          <MarsButton onClick={mapWork.clearDraw}>清除</MarsButton>
        </Space>
      </MarsFormItem>

      <MarsFormItem label="剖面分析">
        <Space>
          <MarsButton onClick={mapWork.drawLine}>绘制线</MarsButton>
          <MarsButton onClick={mapWork.removeSectionPath}>清除</MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
