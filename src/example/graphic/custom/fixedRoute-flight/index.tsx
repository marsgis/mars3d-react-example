import { FixedRouteInfo } from "@mars/components/MarsSample/FixedRouteInfo/index"
import { MarsButton, MarsGui, MarsPannel, MarsSlider, MarsForm, MarsSwitch, MarsFormItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const [angle, setAngle] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isPause, setPause] = useState(false)

  const options: GuiItem[] = [
    {
      type: "select",
      field: "select",
      label: "漫游视角",
      value: "gs",
      options: [
        {
          value: "",
          label: "自由视角"
        },
        {
          value: "gs",
          label: "跟随视角"
        },
        {
          value: "dy",
          label: "锁定第一视角"
        },
        {
          value: "sd",
          label: "锁定上帝视角"
        }
      ],
      change(value, data) {
        changeSelect(data)
      }
    },
    {
      type: "number",
      field: "followedX",
      label: "视角距离:",
      step: 1,
      value: 50,
      show(data) {
        return data.select === "gs" || data.select === "dy"
      },
      change(followedX, data) {
        mapWork.updateCameraSetting(data)
      }
    },
    {
      type: "number",
      field: "followedZ",
      label: "视角高度:",
      step: 1,
      value: 0,
      show(data) {
        return data.select === "sd" || data.select === "dy"
      },
      change(followedZ, data) {
        mapWork.updateCameraSetting(data)
      }
    },
    {
      type: "number",
      field: "offsetZ",
      label: "高度偏移值:",
      step: 1,
      value: 0,
      show(data) {
        return data.select === "dy"
      },
      change(offsetZ, data) {
        mapWork.updateCameraSetting(data)
      }
    },
    {
      type: "number",
      field: "offsetY",
      label: "横向偏移值:",
      step: 1,
      value: 0,
      show(data) {
        return data.select === "dy"
      },
      change(offsetY, data) {
        mapWork.updateCameraSetting(data)
      }
    },
    {
      type: "number",
      field: "offsetX",
      label: "前后偏移值:",
      step: 1,
      value: 0,
      show(data) {
        return data.select === "dy"
      },
      change(offsetX, data) {
        mapWork.updateCameraSetting(data)
      }
    }
  ]

  // 启动漫游
  const btnStart = () => {
    mapWork.fixedRoute.start() // 启动漫游
    udpateState()
  }

  // 暂停漫游
  const btnPause = () => {
    mapWork.fixedRoute.pause()
    udpateState()
  }

  // 继续漫游
  const btnProceed = () => {
    mapWork.fixedRoute.proceed()
    udpateState()
  }

  // 停止漫游
  const btnStop = () => {
    mapWork.fixedRoute.stop()
    udpateState()
  }

  const udpateState = () => {
    setTimeout(() => {
      setIsStart(mapWork.fixedRoute.isStart)
      setPause(mapWork.fixedRoute.isPause)
    }, 100)
  }

  const changeSelect = (data: any) => {
    let params: any = {}
    switch (data.select) {
      case "gs": //
        params = data
        break
      case "dy": // 锁定第一视角
        params = {
          followedX: 200,
          followedZ: 50,
          offsetZ: 0,
          offsetY: 0,
          offsetX: 0,
          select: data.select
        }
        break
      case "sd": {
        // 锁定上帝视角
        if (data.followedZ < 500) {
          params = {
            followedX: data.followedX,
            followedZ: 500,
            offsetZ: data.offsetZ,
            offsetY: data.offsetY,
            offsetX: data.offsetX,
            select: data.select
          }
        } else {
          params = data
        }
        break
      }
      default:
        break
    }
    mapWork.updateCameraSetting(params)
  }

  const [headChecked, setHeadChecked] = useState(false)
  const [pitchChecked, setPitchChecked] = useState(false)
  const [rollChecked, setRollChecked] = useState(false)

  return (
    <>
      <MarsPannel visible={true} width={280} right={10} top={10}>
        <div className="f-mb f-tac">
          {!isStart ? (
            <MarsButton onClick={btnStart}>开始</MarsButton>
          ) : (
            <Space>
              {!isPause ? <MarsButton onClick={btnPause}>暂停</MarsButton> : <MarsButton onClick={btnProceed}>继续</MarsButton>}
              <MarsButton onClick={btnStop}>停止</MarsButton>
            </Space>
          )}
        </div>

        <MarsGui
          options={options}
          formProps={{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }}
        ></MarsGui>
        {/* {angle ? (
          <Space>
            <span>heading值:</span>
            <span>根据路线自动计算</span>
          </Space>
        ) : (
          ""
        )} */}
        <MarsForm labelCol={{ span: 8 }}>
          <MarsFormItem className="f-push-20-t" label="heading值">
            <MarsSwitch
              onClick={() => {
                setHeadChecked(!headChecked)
              }}
            ></MarsSwitch>{" "}
            {!headChecked ? (
              "根据路线自动计算"
            ) : (
              <MarsSlider
                min={0}
                max={360}
                step={1}
                defaultValue={0}
                onChange={(v) => {
                  mapWork.fixedRoute.model.heading = v
                }}
                style={{ width: "100px", float: "right" }}
              ></MarsSlider>
            )}
          </MarsFormItem>
          <MarsFormItem className="f-push-20-t" label="pitch值">
            <MarsSwitch
              onClick={() => {
                setPitchChecked(!pitchChecked)
              }}
            ></MarsSwitch>{" "}
            {!pitchChecked ? (
              "根据路线自动计算"
            ) : (
              <MarsSlider
                min={0}
                max={360}
                step={1}
                defaultValue={0}
                onChange={(v) => {
                  mapWork.fixedRoute.model.pitch = v
                }}
                style={{ width: "100px", float: "right" }}
              ></MarsSlider>
            )}
          </MarsFormItem>
          <MarsFormItem className="f-push-20-t" label="roll值">
            <MarsSwitch
              onClick={() => {
                setRollChecked(!rollChecked)
              }}
            ></MarsSwitch>{" "}
            {!rollChecked ? (
              "根据路线自动计算"
            ) : (
              <MarsSlider
                min={0}
                max={360}
                step={1}
                defaultValue={0}
                onChange={(v) => {
                  mapWork.fixedRoute.model.roll = v
                }}
                style={{ width: "100px", float: "right" }}
              ></MarsSlider>
            )}
          </MarsFormItem>
        </MarsForm>
      </MarsPannel>
      <FixedRouteInfo />
    </>
  )
}

export default UIComponent
