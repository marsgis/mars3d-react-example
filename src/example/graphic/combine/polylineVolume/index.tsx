import { MarsForm, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { DataLoad } from "@mars/components/MarsSample/DataLoad"

function UIComponent() {

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <LayerState />
        </MarsFormItem>
      </MarsForm>
      <DataLoad {...{ min: 1, max: 50000, step: 1, num: 500 }}/>
    </MarsPannel>
  )
}

export default UIComponent
