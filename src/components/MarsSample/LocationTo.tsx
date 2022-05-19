import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { Space } from "antd"
const mapWork = window.mapWork
const mars3d = mapWork.mars3d

let modelTest

//  定位至山区
const onClickCenterAtTerrain = () => {
  mapWork.map.setCameraView({ lat: 30.859414, lng: 116.28709, alt: 8617, heading: 18, pitch: -28 })
}
const onClickCenterAtModel = () => {
  const map = mapWork.map
  if (!modelTest) {
    modelTest = new mars3d.layer.TilesetLayer({
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 80.6 },
      maximumScreenSpaceError: 1,
      maximumMemoryUsage: 1024,
      flyTo: true
    })
    map.addLayer(modelTest)
  }
  map.setCameraView({ lat: 33.587396, lng: 119.03181, alt: 588, heading: 0, pitch: -45 })
}

export const LocationTo = () => {
  return (
    <MarsPannel visible={true} right={10} bottom={40}>
      <Space>
        <MarsButton onClick={onClickCenterAtTerrain}>定位至山区</MarsButton>
        <MarsButton onClick={onClickCenterAtModel}>定位至模型</MarsButton>
      </Space>
    </MarsPannel>
  )
}
