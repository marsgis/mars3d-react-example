import * as mapWork from "./map.js"
import { MarsSwitch, MarsPannel, MarsFormItem } from "@mars/components/MarsUI"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
    <MarsFormItem label="开启：">
      <MarsSwitch
        defaultChecked
        onChange={(value) => {
          mapWork.changeState(value)
        }}
      ></MarsSwitch>
    </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
