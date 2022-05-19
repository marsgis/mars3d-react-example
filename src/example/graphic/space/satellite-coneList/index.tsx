import { SateliteMessage } from "@mars/components/MarsSample/SateliteMessage/index"
import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space } from "antd"

function UIComponent() {
  return (
    <>
      <MarsPannel visible={true} top={10} right={10} width={280}>
        <Space>
          <MarsButton onClick={() => mapWork.locate()}>定位至卫星</MarsButton>

          <span>参考系:</span>
          <MarsCheckbox defaultChecked={false} onChange={(e) => mapWork.chkShowModelMatrix(e.target.checked)}>
            显示/隐藏
          </MarsCheckbox>
        </Space>
      </MarsPannel>
      <SateliteMessage />
    </>
  )
}

export default UIComponent
