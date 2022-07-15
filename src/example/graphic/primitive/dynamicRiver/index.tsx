import { MarsDialog, MarsPannel, MarsSlider, MarsButton, MarsInputNumber } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import * as mapWork from "./map.js"
import { useState } from "react"
import { Space } from "antd"
import "./index.less"

function UIComponent() {
  const [widthValue, setWidthValue] = useState(280)
  const [heightValue, setHeightValue] = useState(30)
  const [speedValue, setSpeedValue] = useState(10)

  const [selectedGraphic, setSelected] = useState(false)
  const [graphicName, setGraphicName] = useState("")
  return (
    <>
      <MarsPannel visible={true} right={10} top={10}>
        <GraphicLayerState
          customEditor={"dynamicRiver"}
          onStartEditor={(data: any) => {
            const graphic = mapWork.getGraphic(data.graphicId)

            setGraphicName(data.graphicName)
            setSelected(true)

            setWidthValue(graphic.width)
            setHeightValue(graphic.height)
            setSpeedValue(graphic.speed)
          }}
          onStopEditor={() => {
            setSelected(false)
          }}
        />
      </MarsPannel>

      <MarsDialog
        title={graphicName}
        visible={selectedGraphic}
        onClose={() => {
          setSelected(false)
        }}
        width={465}
        left={10}
        top={10}
      >
        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">河宽度:</span>
            <MarsInputNumber
              value={widthValue}
              min={0}
              onChange={(e) => {
                setWidthValue(Number(e))
                mapWork.widthChange(Number(e))
              }}
              style={{ width: "100px" }}
            ></MarsInputNumber>
            (米)
          </Space>
          <Space>
            <span className="mars-pannel-item-label">河高度:</span>
            <MarsInputNumber
              value={heightValue}
              onChange={(e) => {
                setHeightValue(Number(e))
                mapWork.heightChange(Number(e))
              }}
              style={{ width: "100px" }}
            ></MarsInputNumber>
            (米)
          </Space>
        </div>
        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">水流速:</span>
            <MarsSlider
              onChange={(e) => {
                mapWork.speedChange(e)
                setSpeedValue(e)
              }}
              value={speedValue}
              min={0}
              max={50}
              step={1}
              style={{ width: "100px" }}
            ></MarsSlider>
            当前速度{speedValue}米/秒
          </Space>
        </div>
        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">方法演示:</span>
            <MarsButton
              onClick={() => {
                mapWork.addHeight()
              }}
            >
              升高30米
            </MarsButton>
            <MarsButton
              onClick={() => {
                mapWork.lowerHeight()
              }}
            >
              降低30米
            </MarsButton>
          </Space>
        </div>
      </MarsDialog>
    </>
  )
}

export default UIComponent
