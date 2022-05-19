import { MarsForm, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
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
      <DataLoad {...{ min: 1, max: 100000, step: 0.1, num: 1024 }}/>
    </MarsPannel>
  )
}

export default UIComponent
