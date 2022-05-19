import { MarsPannel, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  const triangulation = (e: any) => {
    mapWork.checkedTriangulation(e.target.checked)
  }

  return (
    <MarsPannel visible={true} top={10} right={10} height={46}>
      <MarsCheckbox onChange={triangulation}>地形三角网</MarsCheckbox>
    </MarsPannel>
  )
}

export default UIComponent
