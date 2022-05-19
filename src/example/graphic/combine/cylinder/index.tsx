import { MarsForm, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { useState } from "react"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { DataLoad } from "@mars/components/MarsSample/DataLoad"

function UIComponent() {
  const [num, setNum] = useState(1)

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsForm>
        <MarsFormItem>
          <LayerState />
        </MarsFormItem>
      </MarsForm>
      <DataLoad {...{ min: 0.1, max: 100, step: 0.1, unit: "万条" }}></DataLoad>
    </MarsPannel>
  )
}

export default UIComponent
