import { RoamLine } from "@mars/components/MarsSample/RoamLine/index"

import { MarsButton, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState } from "react"
function UIComponent() {
  const [radio, setRadio] = useState("2")

  const options: GuiItem[] = [
    {
      type: "radio",
      field: "type",
      label: "模型角度",
      value: "2",
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
        mapWork.updateModel(false, data)
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
        mapWork.updateModel(false, data)
      }
    }
  ]

  return (
    <>
      <MarsPannel visible={true} width={260} right={10} top={10}>
        <MarsGui
          options={options}
          formProps={{
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
          }}
        ></MarsGui>

        {radio === "2" ? (
          <div className="f-mb">
            <Space>
              <span>heading值:</span>
              <span>根据路线自动计算</span>
            </Space>
          </div>
        ) : (
          ""
        )}

        <div className="f-tac">
          <MarsButton onClick={() => mapWork.clearGraphic()}>清除地面投影</MarsButton>
        </div>
      </MarsPannel>
      <RoamLine />
    </>
  )
}

export default UIComponent
