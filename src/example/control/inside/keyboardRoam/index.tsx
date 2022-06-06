import { MarsButton, MarsForm, MarsFormItem, MarsPannel, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem label="演示视角：">
          <Space>
            <MarsButton onClick={() => mapWork.centerAtDX1()}>室内</MarsButton>
            <MarsButton onClick={() => mapWork.centerAtDX2()}>室外</MarsButton>
          </Space>
        </MarsFormItem>
        <MarsFormItem label="平移步长：">
          <MarsSlider onChange={(e) => mapWork.changeSlider(e)} min={0} max={300} step={0.01} style={{ width: "50%" }}></MarsSlider>
        </MarsFormItem>

        <MarsFormItem>
          <img src="/img/tietu/keyboard.png" alt="" />
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
