import { MarsPannel } from "@mars/components/MarsUI"

import { LayerState } from "@mars/components/MarsSample/LayerState"

import { LocationTo } from "@mars/components/MarsSample/LocationTo"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <LayerState direction="horizontal"/>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
