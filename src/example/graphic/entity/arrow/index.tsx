import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState drawLabel1={"绘制直箭头"} drawLabel2={"绘制燕尾直箭头"} />
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
