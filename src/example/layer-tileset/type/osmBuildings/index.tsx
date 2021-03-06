import * as mapWork from "./map.js"
import { MarsButton, MarsColor, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { Space } from "antd"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <div className="f-mb">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.setStyle1()
            }}
          >
            原始
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.setStyle2()
            }}
          >
            特效样式
          </MarsButton>

          <MarsButton
            onClick={() => {
              mapWork.setStyle3()
            }}
          >
            夜景贴图
          </MarsButton>
        </Space>
      </div>

      <MarsFormItem label="建筑物颜色">
        <MarsColor
          value={"#ffffff"}
          onChange={(data) => {
            mapWork.selectColor(data)
          }}
        ></MarsColor>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
