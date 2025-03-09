import { MarsCollapse, MarsButton, MarsPannel, MarsGui } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import type { GuiItem } from "@mars/components/MarsUI"

function UIComponent() {
  const options: GuiItem[] = [
    {
      type: "slider",
      field: "distanceVal",
      label: "裁剪距离:",
      step: 1,
      min: -20,
      max: 30,
      value: 0,
      extra: "值：{distanceVal}",
      extraWidth: 80,
      change(data) {
        mapWork.rangeDistance(data)
      }
    },
    {
      type: "slider",
      field: "rotationAngle1",
      label: "旋转角度1:",
      step: 0.1,
      min: 0,
      max: 360,
      value: 0,
      extra: "值：{rotationAngle1}",
      extraWidth: 80,
      change(data) {
        mapWork.rangeAngle1(data)
      }
    },
    {
      type: "slider",
      field: "rotationAngle2",
      label: "旋转角度2:",
      step: 0.1,
      min: 0,
      max: 180,
      value: 0,
      extra: "值：{rotationAngle2}",
      extraWidth: 80,
      change(data) {
        mapWork.rangeAngle2(data)
      }
    }
  ]

  return (
    <MarsPannel visible={true} right="10" top="10" width={300}>
      <MarsCollapse
        defaultActiveKey={["1", "2", "3"]}
        items={[
          {
            key: "1",
            label: "单个裁剪面",
            children: (
              <Space wrap>
                <MarsButton
                  onClick={() => {
                    mapWork.drawLine()
                  }}
                >
                  按绘制线裁剪
                </MarsButton>
                <Space wrap>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("ZR")
                    }}
                  >
                    切顶部
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("Z")
                    }}
                  >
                    切底部
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("XR")
                    }}
                  >
                    切东向
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("X")
                    }}
                  >
                    切西向
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("Y")
                    }}
                  >
                    切南向
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clippingType("YR")
                    }}
                  >
                    切北向
                  </MarsButton>
                </Space>
              </Space>
            )
          },
          {
            key: "2",
            label: "多个裁剪面",
            children: (
              <Space wrap>
                <MarsButton
                  onClick={() => {
                    mapWork.drawExtent()
                  }}
                >
                  绘制矩形
                </MarsButton>

                <MarsButton
                  onClick={() => {
                    mapWork.drawPoly()
                  }}
                >
                  绘制面
                </MarsButton>

                <MarsButton
                  onClick={() => {
                    mapWork.drawPoly2()
                  }}
                >
                  绘制外切面
                </MarsButton>
              </Space>
            )
          },
          {
            key: "3",
            label: "模型裁剪",
            children: (
              <>
                <MarsGui options={options} formProps={{ labelCol: { span: 8 } }}></MarsGui>

                <div className="f-tac">
                  <MarsButton
                    onClick={() => {
                      mapWork.clear()
                    }}
                  >
                    清除
                  </MarsButton>
                </div>
              </>
            )
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
