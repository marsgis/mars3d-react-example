import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { DataManage } from "@mars/components/MarsSample/DataManage"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { useState } from "react"

const onClickStartDraw = () => {
  mapWork.startDrawGraphic()
}

const onClickDrawExtruded = () => {
  mapWork.onClickDrawExtruded()
}

function UIComponent() {
  const [enabledEdit, setValue] = useState(false)

  const onChangeHasEdit = (e: any) => {
    setValue(e.target.checked)
    mapWork.updateLayerHasEdit(e.target.checked)
  }

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb">
          <LayerState />
        </div>

        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">数据维护:</span>
            <MarsButton onClick={onClickStartDraw}>标绘椭圆</MarsButton>
            <MarsButton onClick={onClickDrawExtruded}>椭圆柱</MarsButton>

            <MarsCheckbox checked={enabledEdit} onChange={onChangeHasEdit}>
              是否编辑
            </MarsCheckbox>
          </Space>
        </div>

        <div>
          <DataManage />
        </div>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
