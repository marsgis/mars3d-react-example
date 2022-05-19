import { MarsCollapse, MarsCollapsePanel, MarsButton, MarsPannel, MarsCheckbox, MarsSlider, MarsInputNumber } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState } from "react"

function UIComponent() {
  const [alpha, setAlpha] = useState(0.5)
  return (
    <MarsPannel visible={true} right="10" top="10" width={300}>
      <MarsCollapse defaultActiveKey={["1", "2", "3"]}>
        <MarsCollapsePanel key="1" header="地下模式">
          <Space wrap>
            <span className="mars-pannel-item-label">透明度:</span>
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
        </MarsCollapsePanel>
        <MarsCollapsePanel key="2" header="地下开挖">
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
        <MarsCollapsePanel key="3" header="模型裁剪">
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
        </MarsCollapsePanel>
      </MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
