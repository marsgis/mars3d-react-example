import { MarsButton, MarsForm, MarsFormItem, MarsGui, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "distanceValue",
      label: "裁剪距离",
      value: 0,
      min: -100,
      max: 100,
      step: 1,
      extra: "{distanceValue}",
      extraWidth: 40,
      change(value) {
        mapWork.rangeDistance(value)
      }
    },
    {
      type: "slider",
      field: "deviationValue",
      label: "Z偏移量",
      value: 0,
      min: -100,
      max: 100,
      step: 1,
      extra: "{deviationValue}",
      extraWidth: 40,
      change(value) {
        mapWork.rangeNormalZ(value)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem label="单个裁剪面"></MarsFormItem>
        <MarsFormItem>
          <MarsButton onClick={() => mapWork.drawLine()}>按绘制线裁剪</MarsButton>
        </MarsFormItem>
        <MarsFormItem>
          <Space>
            <MarsButton onClick={() => mapWork.clippingType("ZR")}>切顶部</MarsButton>
            <MarsButton onClick={() => mapWork.clippingType("Z")}>切底部</MarsButton>
            <MarsButton onClick={() => mapWork.clippingType("XR")}>切东向</MarsButton>
          </Space>
        </MarsFormItem>

        <MarsFormItem>
          <Space>
            <MarsButton onClick={() => mapWork.clippingType("X")}>切西向</MarsButton>
            <MarsButton onClick={() => mapWork.clippingType("Y")}>切南向</MarsButton>
            <MarsButton onClick={() => mapWork.clippingType("YR")}>切北向</MarsButton>
          </Space>
        </MarsFormItem>

        <MarsFormItem label="多个裁剪面"></MarsFormItem>
        <MarsFormItem>
          <Space>
            <MarsButton onClick={() => mapWork.drawExtent()}>绘制矩形</MarsButton>
            <MarsButton onClick={() => mapWork.drawPoly()}>绘制面</MarsButton>
            <MarsButton onClick={() => mapWork.drawPoly2()}>绘制面（外切）</MarsButton>
          </Space>
        </MarsFormItem>
        <MarsFormItem label="裁剪面参数"></MarsFormItem>
      </MarsForm>
      <MarsGui formProps={{ labelCol: { span: 7 } }} options={options}></MarsGui>
      <div className="f-tac">
        <MarsButton onClick={() => mapWork.clear()}>清除</MarsButton>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
