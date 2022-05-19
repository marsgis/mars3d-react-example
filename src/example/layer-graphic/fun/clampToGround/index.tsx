import { MarsButton, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useMemo, useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [percent, setPercent] = useState(0)
  const [percentAll, setPercentAll] = useState()

  useMemo(() => {
    mapWork.eventTarget.on("geoJsonLayerLoad", function (event: any) {
      setPercentAll(event.geojsonLength)
    })

    mapWork.eventTarget.on("computedResult", function (event: any) {
      setPercent(event.resultData.percent)
    })
  }, [])

  return (
    <MarsPannel visible={true} right="10" top="10">
      <Space>
        <MarsButton
          onClick={() => {
            mapWork.getDataSurfaceHeight()
          }}
        >
          异步计算贴地高度{percent}/{percentAll}
        </MarsButton>
        <MarsButton
          onClick={() => {
            mapWork.toGeojson()
          }}
        >
          保存GeoJSON
        </MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
