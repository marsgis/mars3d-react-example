import { MarsPannel } from "@mars/components/MarsUI"
import { TileLayerState } from "@mars/components/MarsSample/TileLayerState"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <TileLayerState interaction="false" /> 
    </MarsPannel>
  )
}

export default UIComponent
