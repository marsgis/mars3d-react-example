import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState drawLabel1={"绘制线"} drawLabel2={"绘制闭合线"} />

        <div>
          <MarsButton onClick={() => mapWork.startDrawBrushLine()}>绘制自由曲线</MarsButton>
        </div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
