import * as mapWork from "./map.js"
import { MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { useRef } from "react"

function UIComponent() {
  const guiRef = useRef<any>()

  // 参数调节面板
  const upadteMyValue = (field, value) => {
    guiRef.current.updateField(field, value)
    onParticleSystemOptionsChange()
  }

  const onParticleSystemOptionsChange = () => {
    mapWork.onParticleSystemOptionsChange(guiRef.current.getValues())
  }

  const options: GuiItem[] = [
    {
      type: "slider",
      field: "speedFactor",
      label: "速度系数",
      value: 0.2,
      min: 0.05,
      max: 1,
      step: 0.01,
      change(value) {
        upadteMyValue("speedFactor", value)
      }
    },
    {
      type: "slider",
      field: "lineWidth",
      label: "线宽度",
      value: 4.0,
      min: 0.01,
      max: 16.0,
      step: 0.01,
      change(value) {
        upadteMyValue("lineWidth", value)
      }
    },
    {
      type: "slider",
      field: "dropRate",
      label: "下降率",
      value: 0.003,
      min: 0.0,
      max: 0.1,
      step: 0.001,
      change(value) {
        upadteMyValue("dropRate", value)
      }
    },
    {
      type: "slider",
      field: "dropRateBump",
      label: "下降速度",
      value: 0.01,
      min: 1,
      max: 10,
      step: 0.01,
      change(value) {
        upadteMyValue("dropRateBump", value)
      }
    },
    {
      type: "slider",
      field: "particlesNumber",
      label: "粒子总数",
      value: 9000,
      min: 1,
      max: 256 * 256,
      step: 1,
      change(value) {
        upadteMyValue("particlesNumber", value)
      }
    },
    {
      type: "slider",
      field: "fadeOpacity",
      label: "透明度",
      value: 0.996,
      min: 0.9,
      max: 0.999,
      step: 0.001,
      change(value) {
        upadteMyValue("fadeOpacity", value)
      }
    },
    {
      type: "slider",
      field: "fixedHeight",
      label: "固定高度",
      value: 0.0,
      min: 1,
      max: 10000,
      step: 1,
      change(value) {
        upadteMyValue("fixedHeight", value)
      }
    },
    {
      type: "color",
      field: "lineColor",
      label: "线颜色",
      value: "#4696DB",
      change(value) {
        mapWork.changeColor(value)
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="300px" right="10" top="10">
      <MarsGui formProps={{ labelCol: { span: 7 } }} ref={guiRef} options={options}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
