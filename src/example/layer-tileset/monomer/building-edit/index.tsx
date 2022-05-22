import { MarsButton, MarsPannel, MarsRadio, MarsRadioGroup } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space, Upload } from "antd"
import { useCallback, useMemo } from "react"
import { disable, activate } from "@mars/widgets/common/store/widget"

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
  const item = info.file
  const fileName = item.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
  if (fileType !== "json") {
    alert("文件类型不合法,请选择json格式标注文件！")
  }
  mapWork.openGeoJSON(item)
}

function UIComponent() { 

  const showEditor = useCallback(
    (e: any) => {
      activate({
        name: "GraphicEditor",
        data: { graphic: e.graphic }
      })
    },
    [activate]
  )

  useMemo(() => {
    mapWork.eventTarget.on("graphicEditor-start", async (e: any) => {
      showEditor(e)
    })
    // 编辑修改了模型
    mapWork.eventTarget.on("graphicEditor-update", async (e: any) => {
      showEditor(e)
    })

    // 停止编辑修改模型
    mapWork.eventTarget.on("graphicEditor-stop", async (e: any) => {
      disable("GraphicEditor")
    })
  }, [disable, showEditor])

  return (
    <MarsPannel visible={true} right={10} top={10} width={292}>
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
          <MarsButton>打开...</MarsButton>
        </Upload>
        <MarsButton onClick={() => mapWork.saveGeoJSON()}>保存</MarsButton>
        <MarsButton onClick={() => mapWork.deleteAll()}>清除</MarsButton>
      </Space>
    </MarsPannel>
  )
}

export default UIComponent
