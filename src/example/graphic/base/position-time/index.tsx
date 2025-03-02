import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState drawLabel1="绘制时序点" drawLabel2="绘制漫游路线" />
      </MarsPannel>
    </>
  )
}

export default UIComponent
