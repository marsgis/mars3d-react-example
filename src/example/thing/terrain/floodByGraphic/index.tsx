import { MarsButton, MarsGui, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import { useCallback, useMemo, useRef, useState } from "react"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import "./index.less"

function UIComponent(props) {
  const [isShow, stateShow] = useState(true)
  const [isStart, stateStart] = useState(true)

  const changeHeightSelect = useCallback((min: number, max: number) => {
    marsGuiRef.current.updateField("minHeight", Math.ceil(min))
    marsGuiRef.current.updateField("maxHeight", Math.ceil(max))
    setParams({ minHeight: Math.ceil(min), maxHeight: Math.ceil(max) })
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("heightChange", (e: any) => {
      setSliderVlaue(Math.ceil(e.height))
    })
  }, [])

  const marsGuiRef = useRef<any>()
  const options: GuiItem[] = [
    {
      type: "custom",
      label: "分析区域",
      element: (
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.btnDrawExtent((min: number, max: number) => changeHeightSelect(min, max))
            }}
          >
            绘制矩形
          </MarsButton>
          <MarsButton
            onClick={() => {
              mapWork.btnDraw((min: number, max: number) => changeHeightSelect(min, max))
            }}
          >
            绘制多边形
          </MarsButton>
        </Space>
      )
    },
    {
      type: "number",
      field: "minHeight",
      label: "最低海拔",
      extra: "米",
      value: 0,
      step: 1,
      change(value) {
        setParams({ minHeight: Math.ceil(value), maxHeight: marsGuiRef.current.getValue("maxHeight") })
      }
    },
    {
      type: "number",
      field: "maxHeight",
      label: "最高海拔",
      extra: "米",
      value: 0,
      step: 1,
      change(value) {
        setParams({ minHeight: marsGuiRef.current.getValue("minHeight"), maxHeight: Math.ceil(value) })
      }
    },
    {
      type: "number",
      field: "speed",
      label: "淹没速度",
      extra: "(米/秒)",
      value: 10,
      step: 1
    },
    {
      type: "custom",
      label: "",
      element: (
        <div className="f-tac">
          <MarsButton
            onClick={() => {
              mapWork.begin(marsGuiRef.current.getValues(), () => {
                stateShow(false)
              })
            }}
          >
            开始分析
          </MarsButton>
        </div>
      )
    }
  ]

  const [sliderParams, setParams] = useState({ minHeight: 0, maxHeight: 0 })
  const [sliderValue, setSliderVlaue] = useState(0)

  // 高度发生改变
  const onChangeHeight = (val: number) => {
    setSliderVlaue(val)
  }

  return (
    <MarsPannel visible={true} right="10" top="10" width={280}>
      {isShow ? (
        <MarsGui
          ref={marsGuiRef}
          options={options}
          formProps={{
            labelCol: { span: 6 }
          }}
        ></MarsGui>
      ) : (
        <>
          <div>
            <Space>
              <span>高度选择</span>
              <MarsSlider
                {...{ min: sliderParams.minHeight, max: sliderParams.maxHeight, value: sliderValue }}
                onChange={onChangeHeight}
              ></MarsSlider>
            </Space>

            <div className="f-mb f-pt">
              <span>当前高度:{sliderValue}</span>
            </div>

            <div className="f-tac">
              <Space>
                <MarsButton
                  onClick={() => {
                    mapWork.startPlay()
                    stateStart(!isStart)
                  }}
                >
                  {isStart ? "暂停" : "播放"}
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    mapWork.clearDraw()

                    setSliderVlaue(0)
                    stateShow(true)
                    stateStart(true)
                  }}
                >
                  返回
                </MarsButton>
              </Space>
            </div>
          </div>
        </>
      )}
    </MarsPannel>
  )
}

export default UIComponent
