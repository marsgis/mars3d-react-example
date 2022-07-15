import { MarsButton, MarsForm, MarsFormItem, MarsInputNumber, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useState } from "react"
import { Space } from "antd"
function UIComponent() {
  const [distace, setDistance] = useState(0)

  const [range, setRange] = useState(0)

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

        <MarsFormItem>
          <div className="f-mb">
            <Space>
              <span>裁剪距离</span>
              <MarsSlider
                min={-100}
                max={100}
                value={distace}
                defaultValue={0}
                style={{ width: "100px" }}
                onChange={(e) => {
                  setDistance(e)
                  mapWork.rangeDistance(e)
                }}
              ></MarsSlider>
              <MarsInputNumber
                min={-100}
                max={100}
                value={distace}
                defaultValue={0}
                style={{ width: "60px" }}
                onChange={(e) => {
                  setDistance(e)
                  mapWork.rangeDistance(e)
                }}
              ></MarsInputNumber>
              米
            </Space>
          </div>
          <div className="f-mb">
            <Space>
              <span>斜切偏移量</span>
              <MarsSlider
                min={-100}
                max={100}
                value={range}
                defaultValue={0}
                style={{ width: "100px" }}
                onChange={(e) => {
                  setRange(e)
                  mapWork.rangeNormalZ(e)
                }}
              ></MarsSlider>
              <MarsInputNumber
                min={-100}
                max={100}
                value={range}
                defaultValue={0}
                style={{ width: "60px" }}
                onChange={(e) => {
                  setRange(e)
                  mapWork.rangeNormalZ(e)
                }}
              ></MarsInputNumber>
              米
            </Space>
          </div>
        </MarsFormItem>
      </MarsForm>

      <div className="f-tac">
        <MarsButton onClick={() => mapWork.clear()}>清除</MarsButton>
      </div>
    </MarsPannel>
  )
}

export default UIComponent
