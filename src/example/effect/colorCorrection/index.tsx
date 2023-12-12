import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsPannel, MarsSwitch, MarsSlider, MarsFormItem, MarsForm } from "@mars/components/MarsUI"
import { Space } from "antd"
import "./index.less"

function UIComponent(props) {
  const [brightness, setBrightness] = useState(1.0)
  const [contrast, setContrast] = useState(1.0)
  const [hue, setHue] = useState(0.0)
  const [saturation, setSaturation] = useState(1.0)
  return (
    <MarsPannel visible={true} right="10" top="10" width={260}>
      <MarsForm {...{ labelCol: { span: 7 }, labelAlign: "right" }}>
        <MarsFormItem label="启用">
          <MarsSwitch
            defaultChecked
            onChange={(v) => {
              mapWork.setDepthOfField(v)
            }}
          ></MarsSwitch>
        </MarsFormItem>

        <MarsFormItem label="亮度">
          <Space>
            <MarsSlider
              defaultValue={brightness}
              min={0}
              max={2.0}
              step={0.1}
              onChange={(data) => {
                setBrightness(data)
                mapWork.setBrightness(brightness)
              }}
            />
          </Space>
        </MarsFormItem>
        <MarsFormItem label="对比度">
          <Space>
            <MarsSlider
              defaultValue={contrast}
              min={0}
              max={2.0}
              step={0.1}
              onChange={(data) => {
                setContrast(data)
                mapWork.setContrast(contrast)
              }}
            />
          </Space>
        </MarsFormItem>
        <MarsFormItem label="色调">
          <Space>
            <MarsSlider
              defaultValue={hue}
              min={0}
              max={1.0}
              step={0.1}
              onChange={(data) => {
                setHue(data)
                mapWork.setHue(hue)
              }}
            />
          </Space>
        </MarsFormItem>
        <MarsFormItem label="饱和度">
          <Space>
            <MarsSlider
              defaultValue={saturation}
              min={0}
              max={2.0}
              step={0.1}
              onChange={(data) => {
                setSaturation(data)
                mapWork.setSaturation(saturation)
              }}
            />
          </Space>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
