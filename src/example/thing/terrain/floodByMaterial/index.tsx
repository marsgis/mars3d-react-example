import { MarsPannel, MarsButton, MarsCheckbox, MarsInputNumber, MarsSlider, MarsGui } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo } from "react"
import * as mapWork from "./map.js"
import "./index.less"

let minH = 0
let maxH = 0
let floodByMaterial: any
function UIComponent() {
  const [floodParams, setVlaue] = useState({
    minHeight: 0,
    maxHeight: 0,
    height: 0
  })

  const [isStart, setIsStart] = useState(true)

  const [speed, setSpeed] = useState(80)

  useMemo(() => {
    mapWork.eventTarget.on("heightChange", (e: any) => {
      setVlaue({ ...floodParams, minHeight: minH, maxHeight: maxH, height: Math.ceil(e.height) })
    })
  }, [])

  // 绘制矩形
  const drawExtent = () => {
    mapWork.btnDrawExtent((min: number, max: number) => {
      if (floodByMaterial) {
        min = Math.min(min, floodParams.minHeight)
        max = Math.max(max, floodParams.maxHeight)
      }
      minH = min
      maxH = max
      setVlaue({ ...floodParams, minHeight: min, maxHeight: max })
    })
  }

  // 绘制多边形
  const drawPolygon = () => {
    mapWork.btnDraw((min: number, max: number) => {
      maxH = Math.ceil(max)
      minH = Math.ceil(min)
      setVlaue({ ...floodParams, minHeight: Math.ceil(min), maxHeight: Math.ceil(max) })
    })
  }

  // 速度发生改变
  const onChangeSpeed = (val: number) => {
    setSpeed(val)
  }

  // 高度发生改变
  const onChangeHeight = (val: number) => {
    setVlaue({ ...floodParams, minHeight: minH, maxHeight: maxH, height: val })
    mapWork.onChangeHeight(val)
  }

  // 清除
  const removeAll = () => {
    mapWork.clearDraw()
    setVlaue({ ...floodParams, minHeight: 0, maxHeight: 0 })
  }

  // 开始分析
  const begin = () => {
    mapWork.begin({ ...floodParams, speed: speed })
  }

  // 默认自动播放
  const startPlay = () => {
    if (isStart) {
      setIsStart(false)
    } else {
      setIsStart(true)
    }

    mapWork.startPlay()
  }

  // 返回
  const goBack = () => {
    mapWork.clearDraw()
    setVlaue({
      minHeight: 0,
      maxHeight: 0,
      height: 0
    })
    setSpeed(80)
    setIsStart(true)
  }

  return (
    <MarsPannel visible={true} top={10} right={10}>
      {floodParams.height === 0 ? (
        <>
          <div className="f-mb">
            <Space>
              <span>分析区域</span>
              <MarsButton onClick={drawExtent}>绘制矩形</MarsButton>
              <MarsButton onClick={drawPolygon}>绘制多边形</MarsButton>
              <MarsButton onClick={removeAll}>清除</MarsButton>
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>最低海拔</span>
              <MarsInputNumber value={floodParams.minHeight} />米
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>最高海拔</span>
              <MarsInputNumber value={floodParams.maxHeight} />米
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>淹没速度</span>
              <MarsInputNumber value={speed} onChange={onChangeSpeed} />
              米/秒
            </Space>
          </div>
          <div className="f-tac">
            <MarsButton onClick={begin}>开始分析</MarsButton>
          </div>
        </>
      ) : (
        ""
      )}

      {floodParams.height !== 0 ? (
        <>
          <div>
            <Space>
              <span>高度选择</span>
              <MarsSlider min={floodParams.minHeight} max={floodParams.maxHeight} value={floodParams.height} onChange={onChangeHeight}></MarsSlider>
            </Space>

            <div className="f-mb f-pt">
              <span>当前高度:{floodParams.height}</span>
            </div>

            <div>
              <Space>
                <MarsButton onClick={startPlay}>{isStart ? "暂停" : "播放"}</MarsButton>
                <MarsButton onClick={goBack}>返回</MarsButton>
                <MarsCheckbox defaultChecked={true} onChange={(e) => mapWork.onChangeElse(e.target.checked)}>
                  显示非淹没区域
                </MarsCheckbox>
              </Space>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </MarsPannel>
  )
}

export default UIComponent
