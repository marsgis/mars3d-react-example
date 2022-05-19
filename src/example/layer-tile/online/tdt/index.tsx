import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { QueryPoi } from "@mars/components/MarsSample/QueryPoi/index"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <>
      <QueryPoi />
      <MarsPannel visible={true} right={10} top={10}>
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.addLayer()
            }}
          >
            叠加图层
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.removeLayer()
            }}
          >
            移除图层
          </MarsButton>
        </Space>
      </MarsPannel>
    </>
  )
}

export default UIComponent
