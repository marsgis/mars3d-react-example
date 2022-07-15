import { MarsPannel } from "@mars/components/MarsUI"
import { GraphicLayerState } from "@mars/components/MarsSample/GraphicLayerState"


function UIComponent() {

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <GraphicLayerState />
      <span>建议：绘制时顺着道路方向选点，直线时多采集点</span>
    </MarsPannel>
  )
}

export default UIComponent
