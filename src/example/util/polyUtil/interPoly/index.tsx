import { MarsButton, MarsFormItem, MarsInputNumber, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [PolygonNumber, setPolygonNumber] = useState(10)
  const [PolylineNumber, setPolylineNumber] = useState(100)

  return (
    <MarsPannel visible={true} right="10" top="10">
      <p className="f-mb" style={{ color: "#cad1d1", fontSize: "12px" }}>
        提示：插值数大时分析略慢，请耐心等待。
      </p>
      <MarsFormItem label="插值数">
        <Space>
          <MarsInputNumber
            value={PolygonNumber}
            onChange={(data: number) => {
              setPolygonNumber(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interPolygon(PolygonNumber)
            }}
          >
            面插值
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeAll()
            }}
          >
            清除
          </MarsButton>
        </Space>
      </MarsFormItem>

      <MarsFormItem label="插值数">
        <Space>
          <MarsInputNumber
            value={PolylineNumber}
            onChange={(data: number) => {
              setPolylineNumber(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interPolyline(PolylineNumber)
            }}
          >
            线插值
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.interLine(PolylineNumber)
            }}
          >
            线插值(高度等分)
          </MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
