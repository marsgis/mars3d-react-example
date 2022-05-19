import { MarsPannel, MarsGui, MarsFormItem, MarsButton, MarsForm } from "@mars/components/MarsUI"
import type { GuiItem } from "@mars/components/MarsUI"
import { useRef } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const marsGuiRef = useRef<any>()

  const options: GuiItem[] = [
    {
      type: "number",
      field: "pointHeight",
      label: "点高度",
      value: 10.0,
      change(data) {
        marsGuiRef.current.updateField("pointHeight", data)
        mapWork.txtTargetHeight(data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "sliderParticleSize",
      label: "粒子图片大小",
      step: 1,
      min: 2,
      max: 60,
      value: 20,
      extra: "{sliderParticleSize}(px)",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("sliderParticleSize", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "slideStart",
      label: "粒子开始比例",
      step: 1,
      min: 0.0,
      max: 10.0,
      value: 1,
      extra: "{slideStart}",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("slideStart", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "slideStop",
      label: "粒子结束比例",
      step: 1,
      min: 0.0,
      max: 10.0,
      value: 3,
      extra: "{slideStop}",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("slideStop", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "emissionRate",
      label: "粒子发射数量",
      step: 1,
      min: 0.0,
      max: 500.0,
      value: 200,
      extra: "{emissionRate}(次/秒)",
      extraWidth: 80,
      change(data) {
        marsGuiRef.current.updateField("emissionRate", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "slideMinLife",
      label: "最小寿命时长",
      step: 0.1,
      min: 0.1,
      max: 30.0,
      value: 1.2,
      extra: "{slideMinLife}(秒)",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("slideMinLife", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "slideMaxLife",
      label: "最大寿命时长",
      step: 0.1,
      min: 0.1,
      max: 30.0,
      value: 3.2,
      extra: "{slideMaxLife}(秒)",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("slideMaxLife", data)
        initParamView()
      }
    },
    {
      type: "slider",
      field: "slideGravity",
      label: "重力因子",
      step: 1,
      min: -20.0,
      max: 20.0,
      value: -11,
      extra: "{slideGravity}",
      extraWidth: 60,
      change(data) {
        marsGuiRef.current.updateField("slideGravity", data)
        initParamView()
      }
    }
  ]

  const initParamView = () => {
    const data = marsGuiRef.current.getValues()
    const updateValue = {
      pointHeight: data.pointHeight || "10.0",
      sliderParticleSize: data.sliderParticleSize || 20,
      slideStart: data.slideStart || 1,
      slideStop: data.slideStop || 3,
      emissionRate: data.emissionRate || 200,
      slideMinLife: data.slideMinLife || 1.2,
      slideMaxLife: data.slideMaxLife || 3.2,
      slideGravity: data.slideGravity || -11.0
    }
    mapWork.initParamView(updateValue)
  }

  return (
    <MarsPannel visible={true} top={10} right={10} width="350">
      <MarsForm {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}>
        <MarsFormItem label="所在位置">
          <MarsButton
            onClick={() => {
              mapWork.btnSelectPosition()
            }}
          >
            图上选点
          </MarsButton>
        </MarsFormItem>

        <MarsFormItem label="发射目标方向">
          <MarsButton
            onClick={() => {
              mapWork.btnSelectTarget(marsGuiRef.current.getValues().pointHeight)
            }}
          >
            图上选点
          </MarsButton>
        </MarsFormItem>
      </MarsForm>

      <MarsGui
        options={options}
        ref={marsGuiRef}
        formProps={{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 }
        }}
      ></MarsGui>
    </MarsPannel>
  )
}

export default UIComponent
