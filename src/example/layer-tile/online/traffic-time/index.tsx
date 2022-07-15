import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { TileLayerState } from "@mars/components/MarsSample/TileLayerState"
import * as mapWork from "./map.js"
import { activate } from "@mars/widgets/common/store/widget"
import { useEffect } from "react"
import { Space } from "antd"

function Traffic() {
  useEffect(() => {
    activate("SearchPoi")
  }, [])
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.addGaodeLayer()
          }}
        >
          高德交通态势图
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.addBaiduLayer()
          }}
        >
          百度交通态势图
        </MarsButton>
      </Space>

      <TileLayerState />
    </MarsPannel>
  )
}

export default Traffic
