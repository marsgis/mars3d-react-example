import { MarsPannel, MarsButton, MarsSlider, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useCallback, useMemo, useState } from "react"
import * as mapWork from "./map.js"
import "./index.less"
import _ from "lodash"

// 设置摄像头位置
const setPoint = () => {
  mapWork.sePoint()
}

// 计算与地面焦点
const getCenter = () => {
  mapWork.analysisIntersection()
}

function UIComponent() {
  const [params, setValue] = useState({
    heading: 220,
    pitch: 75,
    roll: 0
  })

  const [isChecked, setTerrain] = useState(false) // 是否开启地形检测

  useMemo(() => {  
    mapWork.updateModel(params)
  }, [params])

  const headingChange = useCallback(
    (value: number) => {
      setValue({ ...params, heading: value })
      mapWork.updateModel(params)
    },
    [params]
  )

  const pitchChange = useCallback(
    (value: number) => {
      setValue({ ...params, pitch: value })
      mapWork.updateModel(params)
    },
    [params]
  )

  const rollChange = useCallback(
    (value: number) => {
      setValue({ ...params, roll: value })
      mapWork.updateModel(params)
    },
    [params]
  )

  // 深度检测
  const testTerrain = useCallback((e: any) => {
    setTerrain(e.target.checked)
    mapWork.testTerrain(e.target.checked)
  }, [])

  return (
    <MarsPannel visible={true} top={10} right={10}>
      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">轨迹方向</span>
          <MarsSlider value={params.heading} min={0} max={360} step={0.01} onChange={headingChange}></MarsSlider>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">前后侧摆</span>
          <MarsSlider value={params.pitch} min={-180} max={180} step={0.01} onChange={pitchChange}></MarsSlider>
        </Space>
      </div>

      <div className="f-mb">
        <Space>
          <span className="mars-pannel-item-label">左右侧摆</span>
          <MarsSlider value={params.roll} min={-180} max={180} step={0.01} onChange={rollChange}></MarsSlider>
        </Space>
      </div>

      <div>
        <Space>
          <MarsButton onClick={setPoint}>设置摄像头位置</MarsButton>
          <MarsButton onClick={getCenter}>计算与地面交点</MarsButton>
          <MarsCheckbox checked={isChecked} onChange={testTerrain}>
            深度检测
          </MarsCheckbox>
        </Space>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
