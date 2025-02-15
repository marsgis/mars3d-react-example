import * as mapWork from "./map.js"
import { MarsFormItem, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { Button, Space } from "antd"
import { useRef } from "react"

function UIComponent() {
  const guiRef = useRef<any>()

  
  

  const options: GuiItem[] = [
    {
      type: "slider",
      field: "particlesNumber",
      label: "粒子总数",
      value: 100,
      min: 1,
      max: 1000,
      step: 1,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ particlesTextureSize: value })
      }
    },
    {
      type: "slider",
      field: "lineWidth",
      label: "轨迹宽度",
      value: [1, 5],
      range: true,
      min: 1,
      max: 10,
      step: 0.1,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ lineWidth: { min: value[0], max: value[1] } })
        
      }
    },
    {
      type: "slider",
      field: "lineLength",
      label: "轨迹长度",
      value: [20, 100],
      range: true,
      min: 1,
      max: 200,
      step: 1,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ lineLength: { min: value[0], max: value[1] } })
        
      }
    },
    {
      type: "slider",
      field: "speedFactor",
      label: "速度系数",
      value: 0.2,
      min: 0.05,
      max: 1,
      step: 0.01,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ speedFactor: value })
        
      }
    },
    {
      type: "slider",
      field: "dropRate",
      label: "下降率",
      value: 0.003,
      min: 0.0001,
      max: 0.01,
      step: 0.0001,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ dropRate: value })
        
      }
    },
    {
      type: "slider",
      field: "dropRateBump",
      label: "下降速度",
      value: 0.01,
      min: 0,
      max: 0.2,
      step: 0.001,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ dropRateBump: value })
        
      }
    },
    {
      type: "switch",
      field: "flipY",
      label: "翻转Y坐标",
      value: false,
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ flipY: value })
       
      }
    },
    {
      type: "color",
      field: "lineColor",
      label: "线颜色",
      value: "#4696DB",
      change(value) {
        // console.log("value------", value)
        mapWork.setLayerOptions({ colors: [value] })
        
      }
    }
  ]
  return (
    <MarsPannel visible={true} width="400px" right="10" top="10">
      <MarsFormItem label="演示数据">
        <Space>
          <Button onClick={() => mapWork.loadHongkongData()}>香港</Button>
          <Button onClick={() => mapWork.loadDongnanData1()}>新加坡</Button>
          <Button onClick={() => mapWork.loadDongnanData2()}>洋流</Button>
          <Button onClick={() => mapWork.loadEarthData()}>全球</Button>
        </Space>
      </MarsFormItem>
      <MarsGui formProps={{ labelCol: { span: 7 } }} ref={guiRef} options={options}></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
