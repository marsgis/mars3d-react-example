import { MarsDialog, MarsIcon, MarsTabs, MarsTabPane } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mars3d from "mars3d"
import { useCallback, useEffect, useState } from "react"
import MarsPosition from "./MarsPosition"
import MarsStyle from "./MarsStyle"
import MarsAttr from "./MarsAttr"
import _ from "lodash"
import "./index.less"

function GraphicEditor({ currentWidget, ...props }) {
  const [graphic, setGraphic] = useState(null)
  const [style, setStyle] = useState(null)
  const [positions, setPositions] = useState(null)
  const [attrs, setAttrs] = useState(null)

  useEffect(() => {
    console.log("编辑面板接收到了graphic对象更新:", currentWidget)
    const gp = currentWidget.data.graphic
    setGraphic(gp)
    setStyle(_.cloneDeep(gp.style))
    setPositions(_.cloneDeep(gp.coordinates))
    setAttrs(_.cloneDeep(gp.attr))
  }, [currentWidget])

  const [acTab, setAcTab] = useState("style")

  const tabChange = useCallback((key: string) => {
    setAcTab(key)
  }, [])

  return (
    <MarsDialog
      title="属性编辑"
      width="260"
      top="60"
      bottom="40"
      left="10"
      minWidth={200}
      {...props}
      footer={
        <MarsTabs tabPosition="bottom" activeKey={acTab} type="card" onTabClick={tabChange}>
          <MarsTabPane key="attr" tab="属性"></MarsTabPane>
          <MarsTabPane key="coord" tab="坐标"></MarsTabPane>
          <MarsTabPane key="style" tab="样式"></MarsTabPane>
        </MarsTabs>
      }
    >
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
            {acTab === "attr" && (
              <MarsAttr
                attrs={attrs}
                onChange={(data) => {
                  console.log("更新属性:", data)
                  graphic.attr = data
                }}
              ></MarsAttr>
            )}
            {acTab === "coord" && (
              <MarsPosition
                positions={positions}
                graphic={graphic}
                onChange={(data) => {
                  console.log("更新positions:", data)
                  graphic.positions = data
                  setPositions(_.cloneDeep(data))
                }}
              ></MarsPosition>
            )}
            {acTab === "style" && (
              <MarsStyle
                style={style}
                graphic={graphic}
                onChange={(data) => {
                  console.log("更新style:", data)
                  graphic.setStyle(data)
                  setStyle(_.cloneDeep(data))
                }}
              ></MarsStyle>
            )}
          </div>
        </>
      )}
    </MarsDialog>
  )
}

export default GraphicEditor
