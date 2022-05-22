import { MarsCheckbox, MarsPannel } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} right={10} top={10} height="45">
        <MarsCheckbox onChange={(e) => mapWork.chkUnderground(e.target.checked)}>是否动态</MarsCheckbox>
      </MarsPannel>
      <div style={{ position: "absolute", bottom: "40px", right: "20px" }}>
        <img style={{ height: "200px" }} src="/img/legend/heatmap.png" alt="" />
      </div>
    </>
  )
}
export default UIComponent
