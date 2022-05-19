import { MarsButton, MarsCheckbox, MarsFormItem, MarsPannel } from "@mars/components/MarsUI"
import { LayerState } from "@mars/components/MarsSample/LayerState.jsx"
import { DataManage } from "@mars/components/MarsSample/DataManage.jsx"
import { Space } from "antd"
import * as mapWork from "./map.js"

function UIComponent() {
  return (
    <MarsPannel visible={true} right="10" top="10">
      <LayerState></LayerState>

      <MarsFormItem label="数据维护">
        <Space>
          <MarsButton
            onClick={() => {
              mapWork.startDrawGraphic()
            }}
          >
            图上标绘
          </MarsButton>
          <MarsCheckbox
            onChange={(data) => {
              mapWork.updateLayerHasEdit(data.target.checked)
            }}
          >
            是否编辑
          </MarsCheckbox>
        </Space>
      </MarsFormItem>

      <DataManage></DataManage>
    </MarsPannel>
  )
}

export default UIComponent
