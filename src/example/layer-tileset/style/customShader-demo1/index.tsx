import { Space } from "antd"
import * as mapWork from "./map.js"
import { MarsSwitch, MarsPannel, MarsFormItem, MarsSlider } from "@mars/components/MarsUI"
import "./index.less"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
        <MarsFormItem label="自动切换：">
            <MarsSwitch
                defaultChecked
                onChange={(value) => {
                    mapWork.changePlay(value)
                }}
            ></MarsSwitch>
        </MarsFormItem>
        <MarsFormItem label="线框扫描：">
            <MarsSwitch
                defaultChecked
                onChange={(value) => {
                    mapWork.changeOutline(value)
                }}
            ></MarsSwitch>
        </MarsFormItem>
        <MarsFormItem label="外观过渡：">
          <Space>
            <MarsSlider
              defaultValue={1}
              min={-100}
              max={200}
              step={1}
              onChange={(data) => {
                mapWork.changeHeight(data)
              }}
            />
          </Space>
        </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
