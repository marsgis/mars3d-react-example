import { MarsPannel, MarsButton, MarsInputNumber, MarsRadioGroup, MarsRadio } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"

let gridType: string

function UIComponent() {
  const [step, setStep] = useState(5)
  const [type, setType] = useState("")

  const stepChange = (value: number) => {
    setStep(value)
    creatGrid()
  }

  const onChangeGrid = (e: any) => {
    gridType = e.target.value
    setType(e.target.value)
    creatGrid()
  }

  const creatGrid = () => {
    switch (gridType) {
      case "point":
        mapWork.pointGrid(step)
        break

      case "triangle":
        mapWork.triangleGrid(step)
        break

      case "square":
        mapWork.squareGrid(step)
        break

      case "hex":
        mapWork.hexGrid(step)
        break

      default:
        break
    }
  }

  return (
    <MarsPannel visible={true} top={10} right={10} height={100}>
      <div className="f-mb">
        <Space>
          <span>步长:</span>
          <MarsInputNumber value={step} min={1} max={10} onChange={stepChange}></MarsInputNumber>公里
          <MarsButton
            onClick={() => {
              mapWork.pointGrid(step)
            }}
          >确定</MarsButton>
        </Space>
      </div>

      <Space>
        <span>类型:</span>
        <MarsRadioGroup onChange={onChangeGrid}>
          <MarsRadio value="point">点</MarsRadio>
          <MarsRadio value="triangle">三角网</MarsRadio>
          <MarsRadio value="square">方格网</MarsRadio>
          <MarsRadio value="hex">蜂窝网</MarsRadio>
        </MarsRadioGroup>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
