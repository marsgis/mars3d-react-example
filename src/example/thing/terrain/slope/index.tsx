import { MarsPannel, MarsButton, MarsInputNumber, MarsRadio, MarsRadioGroup } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

let splitNum: number
// 插值数
const numberChange = (value: number) => {
  splitNum = value
}

// 添加矩形
const drawExtent = () => {
  mapWork.btnDrawExtent(splitNum)
}

// 添加多边形
const drawPolygon = () => {
  mapWork.btnDraw(splitNum)
}

// 改变阴影
const changeShadingType = (e) => {
  mapWork.changeShadingType(e.target.value)
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10} height={90}>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">插值数</span>
          <MarsInputNumber defaultValue={10} min={1} max={999} onChange={numberChange} />
          <MarsButton onClick={drawExtent}>添加矩形</MarsButton>
          <MarsButton onClick={drawPolygon}>添加多边形</MarsButton>
          <MarsButton onClick={() => mapWork.btnDrawPoint()}>添加点</MarsButton>
          <MarsButton onClick={() => mapWork.clearAll()}>清除</MarsButton>
        </Space>
      </div>

      <div>
        <Space>
          <span className="mars-pannel-item-label">地表渲染</span>
          <MarsRadioGroup onChange={changeShadingType} defaultValue={"none"}>
            <MarsRadio value={"none"}>无阴影</MarsRadio>
            <MarsRadio value={"slope"}>坡度</MarsRadio>
            <MarsRadio value={"aspect"}>坡向</MarsRadio>
          </MarsRadioGroup>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
