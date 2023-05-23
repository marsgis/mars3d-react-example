import { MarsButton, MarsFormItem, MarsInputNumber, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [PolygonNumber, setPolygonNumber] = useState(10)
  const [inputNumberPolygonDepth, setInputNumberPolygonDepth] = useState(100)
  const [inputNumberPolygon, setInputNumberPolygon] = useState(100)
  const [inputNumberPolyline, setInputNumberPolyline] = useState(100)
  const [inputNumberPolylineDepth, setInputNumberPolylineDepth] = useState(100)

  return (
    <MarsPannel visible={true} right="10" top="10">
      <p className="f-mb " style={{ color: "#cad1d1", fontSize: "12px" }}>
      <MarsButton
            onClick={() => {
              mapWork.removeAll()
            }}
          >
            清除
          </MarsButton>
        <span style={{ marginLeft: "5px" }}>提示：插值数大时分析略慢，请耐心等待。</span>
      </p>
      <MarsFormItem label="面插值数">
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
          
        </Space>
      </MarsFormItem>

      <MarsFormItem label="面插值数">
        <Space>
          <MarsInputNumber
            value={inputNumberPolygonDepth}
            onChange={(data: number) => {
              setInputNumberPolygonDepth(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interPolygonByDepth(inputNumberPolygonDepth)
            }}
          >
           面插值(离屏渲染方式)
          </MarsButton>
          {/* <MarsButton
            onClick={() => {
              mapWork.interLine(PolylineNumber)
            }}
          >
            线插值(高度等分)
          </MarsButton> */}
        </Space>
      </MarsFormItem>

      <MarsFormItem label="面内插点">
        <Space>
          <MarsInputNumber
            value={inputNumberPolygon}
            onChange={(data: number) => {
              setInputNumberPolygon(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interPolygonGrid(inputNumberPolygon)
            }}
          >
           面插点
          </MarsButton>
        </Space>
      </MarsFormItem>


      <MarsFormItem label="线插值数">
        <Space>
          <MarsInputNumber
            value={inputNumberPolyline}
            onChange={(data: number) => {
              setInputNumberPolyline(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interPolyline(inputNumberPolyline)
            }}
          >
           线插值
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.interLine(inputNumberPolyline)
            }}
          >
           线插值(高度等分)
          </MarsButton>
        </Space>
      </MarsFormItem>


      <MarsFormItem label="线插值数">
        <Space>
          <MarsInputNumber
            value={inputNumberPolylineDepth}
            onChange={(data: number) => {
              setInputNumberPolylineDepth(data)
            }}
          ></MarsInputNumber>
          <MarsButton
            onClick={() => {
              mapWork.interLineByDepth(inputNumberPolylineDepth)
            }}
          >
           线插值(离屏渲染方式)
          </MarsButton>
        </Space>
      </MarsFormItem>

    </MarsPannel>
  )
}

export default UIComponent
