import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

const viewSeeTop = () => {
  mapWork.viewSeeTop()
}

const viewSeeCe = () => {
  mapWork.viewSeeCe()
}

const viewSeeHome = () => {
  mapWork.viewSeeHome()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsButton onClick={viewSeeTop}>顶视图</MarsButton>
        <MarsButton onClick={viewSeeCe}>侧视图</MarsButton>
        <MarsButton onClick={viewSeeHome}>主视图</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
