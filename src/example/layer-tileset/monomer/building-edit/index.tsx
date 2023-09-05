import { MarsButton, MarsPannel, MarsRadio, MarsRadioGroup } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import { Space, Upload } from "antd"
import { useCallback, useEffect } from "react"
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
  const item = info.file as any
  const fileName = item.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
  if (fileType !== "json") {
    alert("文件类型不合法,请选择json格式标注文件！")
  }

  mapWork.openGeoJSON(item.originFileObj)
}

function UIComponent() {
  const showEditor = useCallback(
    (e: any) => {
      const graphic = e.graphic
      if (!graphic._conventStyleJson) {
        graphic.options.style = graphic.toJSON().style // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
        graphic._conventStyleJson = true // 只处理一次
      }

      activate({
        name: "GraphicEditor",
        data: { graphic: e.graphic, hideAvailability: true }
      })
    },
    [activate]
  )
  useEffect(() => {
    const mars3d = window.mapWork.mars3d
    // 矢量数据创建完成
    mapWork.graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
      // if (formState.hasEdit) {
      showEditor(e)
      // }
    })
    // 修改了矢量数据
    mapWork.graphicLayer.on([mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle], function (e) {
      showEditor(e)
    })
    // 停止编辑
    mapWork.graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
      setTimeout(() => {
        if (!mapWork.graphicLayer.isEditing) {
          disable("GraphicEditor")
        }
      }, 100)
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
