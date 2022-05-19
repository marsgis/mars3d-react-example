import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <MarsButton href="editor-react.html?id=graphic/particleSystem/style" target="_blank">
        style参数调试
      </MarsButton>
    </MarsPannel>
  )
}

export default UIComponent
