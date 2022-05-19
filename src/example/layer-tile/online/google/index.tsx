import { MarsPannel, MarsButton, $notify } from "@mars/components/MarsUI"
import { QueryPoi } from "@mars/components/MarsSample/QueryPoi/index"
import * as mapWork from "./map.js"
import { Space } from "antd"

$notify(
  "已知问题：",
  `(1)按国家测绘主管部门的通知,
目前国家相关部门对未经审核批准的谷歌等地图做了封锁及下架，
目前谷歌地图服务暂不可用`,
  { duration: null }
)

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
