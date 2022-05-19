import { MarsPannel, MarsButton, MarsCheckbox, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useCallback, useMemo, useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [height, setHeight] = useState(30) // 地形开挖深度

  useMemo(() => {
    mapWork.eventTarget.on("hasAddLayer", (e: any) => {
      e.terrainPlanClip.diffHeight = height
    })
  }, [])

  // 改变切割的深度
  const changeClipHeight = useCallback((height: number) => {
    setHeight(height)
    mapWork.changeClipHeight(height)
  }, [])

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <MarsCheckbox defaultChecked onChange={chkClippingPlanes}>
            是否挖地
          </MarsCheckbox>
          <MarsCheckbox onChange={chkUnionClippingRegions}>是否外切割</MarsCheckbox>
          <MarsCheckbox defaultChecked onChange={chkTestTerrain}>
            深度检测
          </MarsCheckbox>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span>开挖深度</span>
          <MarsInputNumber min={-500} max={999} value={height} onChange={changeClipHeight}></MarsInputNumber>（米）
        </Space>
      </div>
      <div>
        <Space>
          <MarsButton onClick={drawExtent}>添加矩形</MarsButton>
          <MarsButton onClick={drawPolygon}>添加多边行</MarsButton>
          <MarsButton onClick={removeAll}>清除</MarsButton>
        </Space>
      </div>
    </MarsPannel>
  )
}

// 是否挖地
const chkClippingPlanes = (val: any) => {
  mapWork.chkClippingPlanes(val.target.checked)
}

// 是否外切割
const chkUnionClippingRegions = (val: any) => {
  mapWork.chkUnionClippingRegions(val.target.checked)
}

// 深度检测
const chkTestTerrain = (val: any) => {
  mapWork.chkTestTerrain(val.target.checked)
}

// 添加矩形
const drawExtent = () => {
  mapWork.btnDrawExtent()
}

// 添加多边形
const drawPolygon = () => {
  mapWork.btnDraw()
}
// 清除
const removeAll = () => {
  mapWork.removeAll()
}

export default UIComponent
