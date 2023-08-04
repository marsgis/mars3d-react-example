import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <GraphicLayerState defaultCount={10} interaction={false}/>
      </MarsPannel>
    </>
  )
}

export default UIComponent
