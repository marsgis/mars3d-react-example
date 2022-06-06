import { MarsCheckbox, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right={10} top={10} height={44}>
      <MarsCheckbox onChange={(e) => mapWork.enabledSmallTooltip(e.target.checked)} defaultChecked={true}>
        启用/禁用
      </MarsCheckbox>
    </MarsPannel>
  )
}

export default UIComponent
