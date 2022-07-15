import { MarsPannel, MarsButton, MarsCheckbox, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

// 线宽
const lineWidth = (value: number) => {
  mapWork.lineWidth(value)
}

const isVChecked = (e: any) => {
  mapWork.isVChecked(e.target.checked)
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <MarsCheckbox defaultChecked={true} onChange={isVChecked}>
            开启天际线
          </MarsCheckbox>
        </Space>
      </div>

      <div>
        <Space>
          <span>线宽(像素)</span>
          <MarsInputNumber style={{ width: "60px" }} defaultValue={3} min={1} max={10} onChange={lineWidth}></MarsInputNumber>
          <MarsButton onClick={() => mapWork.changeColor()}>换色</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
