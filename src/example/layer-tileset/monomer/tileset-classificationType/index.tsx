import * as mapWork from "./map.js"
import { MarsSwitch, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <MarsFormItem label="显示每户颜色">
        <MarsSwitch
          defaultChecked
          onChange={(data) => {
            mapWork.chkShowColor(data)
          }}
        ></MarsSwitch>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
