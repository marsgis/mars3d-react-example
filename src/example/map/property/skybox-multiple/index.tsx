import * as mapWork from "./map.js"
import { MarsPannel, MarsFormItem, MarsForm, MarsSlider } from "@mars/components/MarsUI"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} right="10" top="10" width={290}>
      <MarsForm labelCol={{ span: 5 }}>
        <MarsFormItem label="融合值">
          <MarsSlider
            min={0.0}
            max={2.0}
            step={0.1}
            defaultValue={0}
            onChange={(value) => {
              mapWork.onChangeSceneVal(value)
            }}
          ></MarsSlider>
        </MarsFormItem>
      </MarsForm>
    </MarsPannel>
  )
}

export default UIComponent
