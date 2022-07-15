import { FixedRouteInfo } from "@mars/components/MarsSample/FixedRouteInfo/index"
import { MarsButton, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState, useRef } from "react"

function UIComponent() {
  const marsGuiRef = useRef<any>()
  const [radio, setRadio] = useState("1")

  const options: GuiItem[] = [
    {
      type: "radio",
      field: "type",
      label: "模型角度",
      value: "1",
      options: [
        {
          label: "自动",
          value: "1"
        },
        {
          label: "手动",
          value: "2"
        }
      ],
      change(data) {
        setRadio(data)
      }
    },
    {
      type: "slider",
      field: "slidePitchStep",
      label: "pitch值(前后):",
      step: 0.01,
      min: -90,
      max: 90,
      value: 0,
      show(data) {
        return data.type !== "1"
      },
      change(pitch, data) {
        updateModel()
      }
    },
    {
      type: "slider",
      field: "slideRollStep",
      label: "roll值(左右):",
      step: 0.01,
      min: -90,
      max: 90,
      value: 10,
      show(data) {
        return data.type !== "1"
      },
      change(roll, data) {
        updateModel()
      }
    }
  ]

  const updateModel = () => {
    const data = marsGuiRef.current.getValues()
    mapWork.setMoelStyle({
      noPitchRoll: data.type !== "1", // 不使用路线自动的角度
      pitch: data.slidePitchStep,
      roll: data.slideRollStep
    })
  }

  return (
    <>
      <MarsPannel visible={true} width={260} right={10} top={10}>
        <MarsGui
          options={options}
          ref={marsGuiRef}
          formProps={{
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          }}
        ></MarsGui>

        {radio !== "1" ? (
          <div className="f-mb">
            <Space>
              <span>heading值:</span>
              <span>根据路线自动计算</span>
            </Space>
          </div>
        ) : null}

        <div className="f-tac">
          <MarsButton onClick={() => mapWork.clearGroundLayer()}>清除地面投影</MarsButton>
        </div>
      </MarsPannel>
      <FixedRouteInfo />
    </>
  )
}

export default UIComponent
