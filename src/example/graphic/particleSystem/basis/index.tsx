import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState defaultCount={100} interaction={false} drawLabel1="绘制水柱" drawLabel2="绘制火焰" />
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
