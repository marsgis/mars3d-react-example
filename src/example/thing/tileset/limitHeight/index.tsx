import { useState } from "react"
import * as mapWork from "./map.js"
import { MarsPannel, MarsButton, MarsSlider, MarsFormItem, MarsForm } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  const [limitHeight, setHeightValue] = useState(30)
  return (
    <MarsPannel visible={true} right="10" top="10" width={310}>
      <MarsForm {...{ labelCol: { span: 6 } }}>
        <MarsFormItem label="分析区域">
          <Space>
            <MarsButton
              onClick={() => {
                mapWork.drawExtent()
              }}
            >
              绘制矩形
            </MarsButton>

            <MarsButton
              onClick={() => {
                mapWork.drawPolygon()
              }}
            >
              绘制面
            </MarsButton>

            <MarsButton
              onClick={() => {
                mapWork.clear()
              }}
            >
              清除
            </MarsButton>
          </Space>
        </MarsFormItem>

        <MarsFormItem label="限定高度">
          <MarsSlider
            defaultValue={limitHeight}
            min={0}
            max={180}
            onChange={(data) => {
              setHeightValue(data)
              mapWork.currHeight(limitHeight)
            }}
          />
        </MarsFormItem>
        <MarsFormItem label="高度">{limitHeight}</MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
