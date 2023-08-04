import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { Space } from "antd"
import * as mapWork from "./map.js"

let thisData

function getChildThis(data) {
  thisData = data
}

let graphicLayer: any
mapWork.eventTarget.on("addTableData", function (event: any) {
  graphicLayer = event.graphicLayer
  thisData.initGraphicableData(graphicLayer)
})

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState drawLabel1={"绘制墙"} drawLabel2={"绘制贴地矩形"} getChildThis= { getChildThis }/>
        <div className="f-pdg-10-t">
          <Space>
            <span className="mars-pannel-item-label">其他绘制:</span>
            <MarsButton onClick={() => mapWork.onClickDrawPoint()}>绘制点计算矩形</MarsButton>
          </Space>
        </div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
