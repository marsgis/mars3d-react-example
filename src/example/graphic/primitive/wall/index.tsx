import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState defaultCount={1000} drawLabel1={"绘制墙"} drawLabel2={"绘制闭合墙"} />
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
