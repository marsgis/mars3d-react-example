import { RoamLine } from "@mars/components/MarsSample/RoamLine/index"

import { MarsButton, MarsGui, MarsInputNumber, MarsPannel, MarsSelect } from "@mars/components/MarsUI"
import { Space, Row, Col } from "antd"
import { useCallback, useEffect, useState } from "react"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const [angle, setAngle] = useState(false)

  const options: GuiItem[] = [
    {
      type: "select",
      field: "select",
      label: "速度",
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
    },
    {
      type: "switch",
      field: "isHand",
      label: "模型角度",
      value: false,
      change(value) {
        setAngle(value)
      }
    },
    {
      type: "slider",
      field: "slidePitchStep",
      label: "pitch值(前后):",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      show(data) {
        return data.isHand
      },
      change(slidePitchStep, data) {
        mapWork.updateModel(false, data)
      }
    },
    {
      type: "slider",
      field: "slideRollStep",
      label: "roll值(左右):",
      step: 0.01,
      min: 0,
      max: 360,
      value: 0,
      show(data) {
        return data.isHand
      },
      change(slideRollStep, data) {
        mapWork.updateModel(false, data)
      }
    }
  ]

  const [pause, setPause] = useState("pause")

  const [enableShow, setEnable] = useState(false)

  // 启动漫游
  const btnStart = () => {
    mapWork.startRoamLine()
    setEnable(true)
    setPause("pause")
  }

  // 暂停漫游
  const btnPause = () => {
    const status = mapWork.pauseRoamLine()
    if (status === "pause") {
      setPause("pause")
    } else {
      setPause("continue")
    }
  }

  // 停止漫游
  const btnStop = () => {
    mapWork.stopRoamLine()
    setEnable(false)
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

  return (
    <>
      <MarsPannel visible={true} width={280} right={10} top={10}>
        <div className="f-mb f-tac">
          <Space>
            <MarsButton onClick={btnStart}>开始</MarsButton>
            {enableShow ? <MarsButton onClick={btnPause}>{pause === "pause" ? "暂停" : "继续"}</MarsButton> : ""}
            <MarsButton onClick={btnStop}>停止</MarsButton>
          </Space>
        </div>

        <MarsGui
          options={options}
          formProps={{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }}
        ></MarsGui>
        {angle ? (
          <Space>
            <span>heading值:</span>
            <span>根据路线自动计算</span>
          </Space>
        ) : (
          ""
        )}
      </MarsPannel>
      <RoamLine />
    </>
  )
}

export default UIComponent
