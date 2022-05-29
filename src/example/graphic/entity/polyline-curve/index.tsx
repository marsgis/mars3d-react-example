import { MarsPannel, MarsButton, MarsCheckbox } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import { DataManage } from "@mars/components/MarsSample/DataManage"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { activate, disable, updateWidget, isActive } from "@mars/widgets/common/store/widget"
import { useState, useEffect } from "react"

const onClickStartDraw = () => {
  mapWork.startDrawGraphic()
}

function UIComponent() {
  const [enabledEdit, setValue] = useState(false)

  const onChangeHasEdit = (e: any) => {
    setValue(e.target.checked)
    mapWork.updateLayerHasEdit(e.target.checked)
  }

  useEffect(() => {
    // 编辑修改了模型
    mapWork.eventTarget.on("graphicEditor-update", async (e: any) => {
      if (isActive("GraphicEditor")) {
        updateWidget("GraphicEditor", { graphic: e.graphic })
      } else {
        activate({
          name: "GraphicEditor",
          data: { graphic: e.graphic }
        })
      }
    })

    // 停止编辑修改模型
    mapWork.eventTarget.on("graphicEditor-stop", async (e: any) => {
      setTimeout(() => {
        if (!mapWork.graphicLayer.isEditing) {
          disable("GraphicEditor")
        }
      }, 100)
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} top={10} right={10}>
        <div className="f-mb">
          <LayerState />
        </div>

        <div className="f-mb">
          <Space>
            <span className="mars-pannel-item-label">数据维护:</span>
            <MarsButton onClick={onClickStartDraw}>图上标绘</MarsButton>

            <MarsCheckbox checked={enabledEdit} onChange={onChangeHasEdit}>
              是否编辑
            </MarsCheckbox>
          </Space>
        </div>

        <DataManage />
      </MarsPannel>
      <LocationTo />
    </>
  )
}

export default UIComponent
