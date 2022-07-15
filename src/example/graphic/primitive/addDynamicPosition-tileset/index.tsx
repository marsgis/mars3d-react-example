import { MarsPannel } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <LayerState direction="horizontal" />
    </MarsPannel>
  )
}

export default UIComponent
