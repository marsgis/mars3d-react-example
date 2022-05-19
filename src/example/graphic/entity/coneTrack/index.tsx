import { MarsPannel, MarsButton } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

const onClickSelPoint = () => {
  mapWork.onClickSelPoint()
}

function UIComponent() {
  return (
    <MarsPannel visible={true} top={10} right={10}>
      <MarsButton onClick={onClickSelPoint}>追踪目标点</MarsButton>
    </MarsPannel>
  )
}

export default UIComponent
