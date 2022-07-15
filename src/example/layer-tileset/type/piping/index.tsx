import { MarsCollapse, MarsCollapsePanel, MarsButton, MarsPannel, MarsCheckbox, MarsSlider, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState } from "react"

function UIComponent() {
  const [alpha, setAlpha] = useState(0.5)
  return (
    <MarsPannel visible={true} right="10" top="10" width={340}>
      <MarsCollapse defaultActiveKey={["1", "2", "3"]}>
        <MarsCollapsePanel key="1" header="地下模式">
          <Space wrap>
            <span className="mars-pannel-item-label">地表透明度:</span>
            <MarsSlider
              min={0}
              max={1}
              step={0.1}
              defaultValue={0.5}
              style={{ width: "100px" }}
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
        </MarsCollapsePanel>
        <MarsCollapsePanel key="2" header="地下开挖">
          <div className="f-mb">
            <Space>
              <span className="mars-pannel-item-label">开挖深度:</span>
              <MarsInputNumber
                min={-500}
                max={999}
                step={1}
                defaultValue={30}
                style={{ width: "120px" }}
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
          </div>

          <Space>
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
        </MarsCollapsePanel>
        <MarsCollapsePanel key="3" header="演示视角">
          <div className="f-tac">
            <Space>
              <MarsButton
                onClick={() => {
                  mapWork.centerAtDX1()
                }}
              >
                俯视视角
              </MarsButton>

              <MarsButton
                onClick={() => {
                  mapWork.centerAtDX2()
                }}
              >
                地下视角
              </MarsButton>
            </Space>
          </div>
        </MarsCollapsePanel>
      </MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
