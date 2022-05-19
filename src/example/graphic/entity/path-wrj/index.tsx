import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

const viewAircraft = () => {
  mapWork.viewAircraft()
}

const viewTopDown = () => {
  mapWork.viewTopDown()
}

const viewSide = () => {
  mapWork.viewSide()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={viewAircraft}>跟踪视角</MarsButton>
        <MarsButton onClick={viewTopDown}>上方视角</MarsButton>
        <MarsButton onClick={viewSide}>侧方视角</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
