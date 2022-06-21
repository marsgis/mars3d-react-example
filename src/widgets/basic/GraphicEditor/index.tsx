import { MarsDialog, MarsIcon } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mars3d from "mars3d"
import { useEffect, useState } from "react"
import MarsStyle from "./MarsStyle"
import _ from "lodash"
import "./index.less"

function GraphicEditor({ currentWidget, ...props }) {
  const [graphic, setGraphic] = useState(null)
  const [style, setStyle] = useState(null)

  useEffect(() => {
    console.log("编辑面板接收到了graphic对象更新:", currentWidget)
    const gp = currentWidget.data.graphic
    setGraphic(gp)
    setStyle(_.cloneDeep(gp.style))
  }, [currentWidget.data.graphic])

  return (
    <MarsDialog title="属性编辑" width="260" top="60" bottom="40" left="10" minWidth={200} {...props}>
      {graphic && (
        <>
          <div className="top-handle-bar">
            <Space>
              <MarsIcon icon="send" width="20" click="flyToGraphic" title="飞行定位" onClick={() => graphic.flyTo()}></MarsIcon>
              <MarsIcon icon="delete" width="20" click="deleteEntity" title="删除" onClick={() => graphic.remove()}></MarsIcon>
              <MarsIcon
                icon="save"
                width="20"
                click="getGeoJson"
                title="导出geojson"
                onClick={() => {
                  // 文件处理
                  const geojson = graphic.toGeoJSON()
                  geojson.properties._layer = graphic._layer.name
                  mars3d.Util.downloadFile("标绘item.json", JSON.stringify(geojson))
                }}
              ></MarsIcon>
            </Space>
          </div>
          <div className="attr-editor-main">
            <MarsStyle
              style={style}
              graphic={graphic}
              onChange={(data) => {
                console.log("更新style:", data)
                graphic.setStyle(data)
                setStyle(_.cloneDeep(data))
              }}
            ></MarsStyle>
          </div>
        </>
      )}
    </MarsDialog>
  )
}

export default GraphicEditor
