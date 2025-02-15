import { MarsButton, MarsForm, MarsFormItem, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import "./index.less"
import classNames from "classnames"
import { Space } from "antd"
import { useState } from "react"

function UIComponent() {
  const [activeValue, setActiveValue] = useState(0)

  mapWork.eventTarget.on("keydown", function (event) {
    setActiveValue(event.keyCode)
  })
  mapWork.eventTarget.on("keyup", function (event) {
    setActiveValue(undefined)
  })

  const codeList = [
    {
      codeValue: 81,
      codeName: "Q",
      codeClass: "zm_q"
    },
    {
      codeValue: 87,
      codeName: "W",
      codeClass: "zm_w"
    },
    {
      codeValue: 69,
      codeName: "E",
      codeClass: "zm_e"
    },
    {
      codeValue: 65,
      codeName: "A",
      codeClass: "zm_a"
    },
    {
      codeValue: 83,
      codeName: "S",
      codeClass: "zm_s"
    },
    {
      codeValue: 68,
      codeName: "D",
      codeClass: "zm_d"
    },
    {
      codeValue: 85,
      codeName: "U",
      codeClass: "zm_u"
    },
    {
      codeValue: 73,
      codeName: "I",
      codeClass: "zm_i"
    },
    {
      codeValue: 79,
      codeName: "O",
      codeClass: "zm_o"
    },
    {
      codeValue: 74,
      codeName: "J",
      codeClass: "zm_j"
    },
    {
      codeValue: 75,
      codeName: "K",
      codeClass: "zm_k"
    },
    {
      codeValue: 76,
      codeName: "L",
      codeClass: "zm_l"
    },
    {
      codeValue: 38,
      codeName: "↑",
      codeClass: "zm_up"
    },
    {
      codeValue: 37,
      codeName: "←",
      codeClass: "zm_left"
    },
    {
      codeValue: 40,
      codeName: "↓",
      codeClass: "zm_down"
    },
    {
      codeValue: 39,
      codeName: "→",
      codeClass: "zm_right"
    }
    
  ]

  return (
    <>
      <MarsPannel visible={true} right={10} top={10} >
        <MarsForm>
          <MarsFormItem label="演示视角：">
            <Space>
              <MarsButton onClick={() => mapWork.centerAtDX1()}>室内</MarsButton>
              <MarsButton onClick={() => mapWork.centerAtDX2()}>室外</MarsButton>
            </Space>
          </MarsFormItem>
          <MarsFormItem label="平移步长：">
            <MarsSlider onChange={(e) => mapWork.changeSlider(e)} min={0} max={300} step={0.01} style={{ width: "50%" }}></MarsSlider>
          </MarsFormItem>
        </MarsForm>
      </MarsPannel>
      <MarsPannel visible={true} left={10} top={10}>
        <div className="keyboard-img">
          {codeList.map((item) => (
            <div
              style={{ display: activeValue === item.codeValue ? "block" : "none" }}
              className={classNames({
                zm: true,
                [item.codeClass]: true,
                active: activeValue === item.codeValue 
              })}
            >
              {item.codeName}
            </div>
          ))}
        </div>
      </MarsPannel>
    </>
  )
}

export default UIComponent
