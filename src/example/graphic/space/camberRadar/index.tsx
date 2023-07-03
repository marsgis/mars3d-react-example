import { MarsGui, MarsPannel, MarsCollapse, MarsCollapsePanel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"
import type { GuiItem } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { useEffect } from "react"

const raderParsms = {
  outerRadius: 2000,
  innerRadius: 500,
  headingValue: 0,
  pitchValue: 0,
  rollValue: 0,
  startFovH: 180,
  endFovH: -180,
  startFovV: 0,
  endFovV: 90
}

function UIComponent() {


  return (
    <MarsPannel visible={true} right={10} top={10}>
      <GraphicLayerState defaultCount={10} interaction={false} />
    </MarsPannel>
  )
}

export default UIComponent
