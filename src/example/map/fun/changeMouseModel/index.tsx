import * as mapWork from "./map.js"
import { MarsRadioGroup, MarsRadio, MarsPannel } from "@mars/components/MarsUI"

function UIComponent(props) {
  return (
    <MarsPannel visible={true} height="50px" right="10" top="10">
      <MarsRadioGroup
        defaultValue={1}
        onChange={(data) => {
          mapWork.shadingMaterials(data.target.value)
        }}
      >
        <MarsRadio value={1} checked>
          更换中键和右键
        </MarsRadio>
        <MarsRadio value={2}>Cesium操作习惯</MarsRadio>
      </MarsRadioGroup>
    </MarsPannel>
  )
}

export default UIComponent
