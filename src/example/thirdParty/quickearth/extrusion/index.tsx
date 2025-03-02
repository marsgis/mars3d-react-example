import { MarsPannel, MarsFormItem, MarsSlider } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10" width="300">
      <MarsFormItem label="缩放比例">
        <MarsSlider
          defaultValue={500}
          min={0.0}
          max={1000.0}
          step={1.0}
          onChange={(value) => {
            mapWork.changeScale(value)
          }}
        ></MarsSlider>
      </MarsFormItem>
    </MarsPannel>
  )
}

export default UIComponent
