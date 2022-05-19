import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={() => mapWork.createMap()}>创建地图</MarsButton>
        <MarsButton onClick={() => mapWork.destroyMap()}>销毁地图</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
