import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { MarsPannel } from "@mars/components/MarsUI"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <LayerState></LayerState>
    </MarsPannel>
  )
}

export default UIComponent
