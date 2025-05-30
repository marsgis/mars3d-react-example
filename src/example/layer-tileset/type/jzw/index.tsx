import { MarsCollapse, MarsButton, MarsPannel, MarsSlider, MarsCheckbox, MarsColor } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width={350}>
      <MarsCollapse
        defaultActiveKey={["1", "2", "3"]}
        items={[
          {
            key: "1",
            label: "原始样式",
            children: (
              <Space wrap>
                <MarsButton
                  onClick={() => {
                    mapWork.setStyleDef()
                  }}
                >
                  倾斜摄像(某县城)
                </MarsButton>
                建筑物颜色
                <MarsColor
                  value={"#34bdff"}
                  onChange={(e) => {
                    mapWork.changeColor(e)
                  }}
                ></MarsColor>
              </Space>
            )
          },
          {
            key: "2",
            label: "建筑物样式",
            children: (
              <Space wrap>
                <MarsButton
                  onClick={() => {
                    mapWork.setStyle1()
                  }}
                  title="这是Mars3D内置的"
                >
                  动态特效1
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    mapWork.setStyle2()
                  }}
                  title="这是不改动cesium源码的"
                >
                  动态特效2
                </MarsButton>
                <MarsButton
                  onClick={() => {
                    mapWork.setStyle3()
                  }}
                >
                  夜景贴图
                </MarsButton>
              </Space>
            )
          },
          {
            key: "3",
            label: "叠加场景效果",
            children: (
              <Space wrap>
                <span className="mars-pannel-item-label"> 叠加效果:</span>
                <MarsCheckbox
                  onChange={(e) => {
                    mapWork.chkBloom(e.target.checked)
                  }}
                >
                  开启泛光
                </MarsCheckbox>
                <MarsCheckbox
                  onChange={(e) => {
                    mapWork.chkShadows(e.target.checked)
                  }}
                >
                  开启光照
                </MarsCheckbox>

                <span className="mars-pannel-item-label"> 亮度效果:</span>
                <MarsCheckbox
                  defaultChecked={true}
                  onChange={(e) => {
                    mapWork.chkBrightness(e.target.checked)
                  }}
                >
                  开启亮度
                </MarsCheckbox>
                <MarsSlider
                  min={0.1}
                  max={8.0}
                  step={0.05}
                  defaultValue={1.5}
                  style={{ width: "120px" }}
                  onChange={(e) => {
                    mapWork.alphaChange(e)
                  }}
                ></MarsSlider>
              </Space>
            )
          }
        ]}
      ></MarsCollapse>
    </MarsPannel>
  )
}

export default UIComponent
