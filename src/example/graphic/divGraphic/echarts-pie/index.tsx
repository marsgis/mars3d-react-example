import { MarsPannel, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <Space>
        <MarsCheckbox
          defaultChecked={true}
          onChange={(e) => {
            mapWork.graphicLayer.show = e.target.checked
          }}
        >
          是否显示
        </MarsCheckbox>
        <MarsCheckbox
          defaultChecked={false}
          onChange={(e) => {
            mapWork.graphicLayer.clusterEnabled = e.target.checked
          }}
        >
          是否聚合
        </MarsCheckbox>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
