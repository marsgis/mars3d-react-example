import * as mapWork from "./map.js"
import { MarsFormItem, MarsSwitch, MarsPannel } from "@mars/components/MarsUI"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="启用状态">
        <MarsSwitch
          defaultChecked
          onChange={(value) => {
            mapWork.setEffect(value)
          }}
        ></MarsSwitch>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
