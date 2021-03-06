import { MarsPannel, MarsButton, MarsColor } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.addTileLayer()
          }}
        >
          叠加图层
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.removeTileLayer()
          }}
        >
          移除图层
        </MarsButton>
        <MarsColor value={"#4e70a6"} onChange={(e) => mapWork.setFilterColor(e)}></MarsColor>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
