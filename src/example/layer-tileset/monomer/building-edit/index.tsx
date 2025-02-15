import { MarsButton, MarsPannel, MarsRadio, MarsRadioGroup } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space, Upload } from "antd"
import { useEffect } from "react"
import { disable, activate, isActive, updateWidget } from "@mars/widgets/common/store/widget"

interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}

const modeChange = (e) => {
  if (e === "1") {
    mapWork.toBJMS()
  } else {
    mapWork.toYLMS()
  }
}

// 打开
const openGeoJSON = (info: FileInfo) => {
  const item = info.file as any
  const fileName = item.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
  if (fileType !== "json") {
    alert("文件类型不合法,请选择json格式标注文件！")
  }

  mapWork.openGeoJSON(item.originFileObj)
}

function UIComponent() {
  useEffect(() => {
    // ************************属性面板************************/
    mapWork.eventTarget.on("updateGraphicOptionsWidget", (event) => {
      if (event.disable) {
        disable("graphic-options")
      } else {
        const data = { layerId: event.layerId, graphicId: event.graphicId }
        if (!isActive("graphic-options")) {
          activate({ name: "graphic-options", data })
        } else {
          updateWidget("graphic-options", data)
        }
      }
    })
  }, [])

  return (
    <MarsPannel visible={true} right={10} top={10} width={276}>
      <Space wrap>
        <MarsRadioGroup
          onChange={(e: any) => {
            modeChange(e.target.value)
          }}
          defaultValue={"1"}
        >
          <MarsRadio value={"1"}>编辑模式</MarsRadio>
          <MarsRadio value={"2"}>预览模式</MarsRadio>
        </MarsRadioGroup>
        <MarsButton onClick={() => mapWork.drawPolygon()}>单体化面</MarsButton>
        <Upload onChange={openGeoJSON} multiple={false} name={"file"} accept={"json,geojson"} showUploadList={false}>
          <MarsButton>打开</MarsButton>
        </Upload>
        <MarsButton onClick={() => mapWork.saveGeoJSON()}>保存</MarsButton>
        <MarsButton onClick={() => mapWork.deleteAll()}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
