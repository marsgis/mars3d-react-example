import { MarsPannel, MarsButton, MarsFormItem, MarsSlider } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width="300">
      <MarsFormItem label="步长">
        <MarsSlider
          defaultValue={0.2}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(value) => {
            mapWork.changeChangeDelta(value)
          }}
        ></MarsSlider>
      </MarsFormItem>
      <MarsFormItem label="开关">
        <Space>
          <MarsButton onClick={mapWork.start}>开启</MarsButton>
          <MarsButton onClick={mapWork.stop}>停止</MarsButton>
        </Space>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
