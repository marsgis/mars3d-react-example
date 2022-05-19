import { MarsPannel } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10}>
          <LayerState />
    </MarsPannel>
  )
}

export default UIComponent
