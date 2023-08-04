import { MarsPannel } from "@mars/components/MarsUI"
import { TileLayerState } from "@mars/components/MarsSample/TileLayerState"
import { activate } from "@mars/widgets/common/store/widget"
import { useEffect } from "react"

function UIComponent() {
  useEffect(() => {
    activate("SearchPoi")
  }, [])
  return (
    <MarsPannel visible={true} right={10} top={10}>
      <TileLayerState /> 
    </MarsPannel>
  )
}

export default UIComponent
