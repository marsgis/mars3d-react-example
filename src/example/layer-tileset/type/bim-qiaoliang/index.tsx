import { MarsCollapse, MarsButton, MarsPannel, MarsCheckbox, MarsSlider, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState } from "react"
import "./index.less"

function UIComponent() {
  const [alpha, setAlpha] = useState(0.5)
  return (
    <MarsPannel visible={true} right="10" top="10" width={380}>
      <MarsCollapse
        defaultActiveKey={["1", "2", "3"]}
        items={[
          {
            key: "1",
            label: "地下模式",
            children: (
              <Space wrap>
                <span className="mars-pannel-item-label">地表透明度:</span>
                <MarsSlider
                  min={0}
                  max={1}
                  step={0.1}
                  defaultValue={0.5}
                  style={{ width: "140px" }}
                  onChange={(e) => {
                    mapWork.alphaChange(e)
                    setAlpha(e)
                  }}
                ></MarsSlider>
                <MarsCheckbox
                  onChange={(e) => {
                    mapWork.chkUnderground(e.target.checked, alpha)
                  }}
                >
                  是否开启
                </MarsCheckbox>
              </Space>
            )
          },
          {
            key: "2",
            label: "地下开挖",
            children: (
              <Space wrap>
                <Space wrap>
                  <span className="mars-pannel-item-label">开挖深度:</span>
                  <MarsInputNumber
                    min={-500}
                    max={999}
                    step={1}
                    defaultValue={30}
                    onChange={(e) => {
                      mapWork.heightChange(e)
                    }}
                  ></MarsInputNumber>
                  <MarsCheckbox
                    defaultChecked={true}
                    onChange={(e) => {
                      mapWork.chkClippingPlanes(e.target.checked)
                    }}
                  >
                    是否开挖
                  </MarsCheckbox>
                </Space>
                <Space wrap>
                  <MarsButton
                    onClick={() => {
                      mapWork.drawExtent()
                    }}
                  >
                    矩形
                  </MarsButton>

                  <MarsButton
                    onClick={() => {
                      mapWork.drawPolygon()
                    }}
                  >
                    多边形
                  </MarsButton>

                  <MarsButton
                    onClick={() => {
                      mapWork.clearWJ()
                    }}
                  >
                    清除
                  </MarsButton>
                </Space>
              </Space>
            )
          },
          {
            key: "3",
            label: "模型裁剪",
            children: (
              <Space wrap>
                <Space wrap>
                  <span className="mars-pannel-item-label">裁剪距离:</span>
                  <MarsSlider
                    min={-50}
                    max={50}
                    step={0.1}
                    defaultValue={0}
                    style={{ width: "140px" }}
                    onChange={(e) => {
                      mapWork.distanceChange(e)
                    }}
                  ></MarsSlider>
                </Space>
                <Space wrap>
                  <MarsButton
                    onClick={() => {
                      mapWork.clipTop()
                    }}
                  >
                    切顶
                  </MarsButton>

                  <MarsButton
                    onClick={() => {
                      mapWork.clipBottom()
                    }}
                  >
                    切底
                  </MarsButton>

                  <MarsButton
                    onClick={() => {
                      mapWork.clipPoly()
                    }}
                  >
                    内挖
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clipPoly2()
                    }}
                  >
                    外切
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clipLine()
                    }}
                  >
                    按线切
                  </MarsButton>
                  <MarsButton
                    onClick={() => {
                      mapWork.clearClip()
                    }}
                  >
                    清除
                  </MarsButton>
                </Space>
              </Space>
            )
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
