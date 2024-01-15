import { MarsPannel, MarsButton, MarsCheckbox, MarsInputNumber, MarsSlider, MarsGui } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState, useMemo, useEffect } from "react"
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

  const [color, setColor] = useState("rgba(0, 123, 230, 0.5)")

  const [show, setShow] = useState(false)

  useMemo(() => {
    mapWork.eventTarget.on("heightChange", (e: any) => {
      setVlaue({ ...floodParams, minHeight: minH, maxHeight: maxH, height: Math.ceil(e.height) })
    })
  }, [])

  useEffect(() => {
    mapWork.onChangeHeight(floodParams.height)
  }, [floodParams.height])

  // 绘制矩形
  const drawExtent = () => {
    mapWork.btnDrawExtent((min: number, max: number) => {
      if (floodByMaterial) {
        min = Math.min(min, floodParams.minHeight)
        max = Math.max(max, floodParams.maxHeight)
      }
      minH = min
      maxH = max
      setVlaue({ ...floodParams, minHeight: min, maxHeight: max, height: Math.ceil(min) })
    })
  }

  // 绘制多边形
  const drawPolygon = () => {
    mapWork.btnDraw((min: number, max: number) => {
      maxH = Math.ceil(max)
      minH = Math.ceil(min)
      setVlaue({ ...floodParams, minHeight: Math.ceil(min), maxHeight: Math.ceil(max), height: Math.ceil(min) })
    })
  }

  // 速度发生改变
  const onChangeSpeed = (val: number) => {
    setSpeed(val)
  }

  const onChangeMinHeight = (val: number) => {
    setVlaue({ ...floodParams, minHeight: val })
  }

  const onChangeMaxHeight = (val: number) => {
    setVlaue({ ...floodParams, maxHeight: val })
  }

  // 高度发生改变
  const onChangeHeight = (val: number) => {
    setVlaue({ ...floodParams, minHeight: minH, maxHeight: maxH, height: val })
  }

  // 清除
  const removeAll = () => {
    mapWork.clearDraw()
    setVlaue({ ...floodParams, minHeight: 0, maxHeight: 0 })
  }

  // 开始分析
  const begin = () => {
    setShow(true)
    mapWork.begin({ ...floodParams, speed })
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
    setShow(false)
  }

  const options: GuiItem[] = [
    {
      type: "color",
      field: "color",
      value: color,
      change(color) {
        console.log("颜色", color)
        setColor(color)
        mapWork.onChangeColor(color)
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10}>
      {!show ? (
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
              <MarsInputNumber value={floodParams.minHeight} onChange={onChangeMinHeight} />米
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>最高海拔</span>
              <MarsInputNumber value={floodParams.maxHeight} onChange={onChangeMaxHeight} />米
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>淹没速度</span>
              <MarsInputNumber value={speed} onChange={onChangeSpeed} />
              米/秒
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>淹没颜色</span>
              <MarsGui options={options}></MarsGui>
            </Space>
          </div>
          <div className="f-tac">
            <MarsButton onClick={begin}>开始分析</MarsButton>
          </div>
        </>
      ) : (
        ""
      )}

      {show ? (
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
