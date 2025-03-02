import { MarsPannel, MarsSlider, MarsSwitch, MarsFormItem } from "@mars/components/MarsUI"
import { Space } from "antd"
import { useState } from "react"
import * as mapWork from "./map.js"

function UIComponent() {
  const [gradations, setGradations] = useState(50)

  return (
    <MarsPannel visible={true} right="10" top="10" width="200">
      <MarsFormItem label="启用">
        <MarsSwitch
          defaultChecked
          onChange={(value) => {
            mapWork.setEnabled(value)
          }}
        />
      </MarsFormItem>

      <MarsFormItem label="速度">
        <MarsSlider
          value={gradations}
          onChange={(e) => {
            setGradations(e)
            mapWork.setGradations(100 - e)
          }}
          min={1}
          max={100}
          step={1}
        />
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
