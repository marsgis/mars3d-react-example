import { MarsDialog, MarsIcon, MarsTabs, MarsTabPane } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mars3d from "mars3d"
import { useEffect, useState, useCallback } from "react"
import MarsStyle from "./MarsStyle"
import MarsAvailability from "./MarsAvailability"
import _ from "lodash"
import "./index.less"

function GraphicEditor({ currentWidget, ...props }) {
  const [graphic, setGraphic] = useState(null)
  const [style, setStyle] = useState(null)
  const [availability, setAvailability] = useState(null)

  const [layerName, setLayerName] = useState("")
  const [customType, setCustomType] = useState("")
  const [graphicType, setGraphicType] = useState("")

  const [acTab, setAcTab] = useState("style")

  const tabChange = useCallback((key: string) => {
    setAcTab(key)
  }, [])

  useEffect(() => {
    console.log("编辑面板接收到了graphic对象更新:", currentWidget)
    const gp = currentWidget?.data?.graphic
    if (!gp || gp.isDestroy || !gp._layer) {
      return
    }

    setLayerName(gp._layer.name)
    setCustomType(currentWidget.data?.styleType || gp.options.styleType)
    setGraphicType(gp.type)
    setStyle(_.cloneDeep(gp?.style))
    // console.log("availability", gp?.availability)
    setAvailability(_.cloneDeep(gp?.availability))

    setGraphic(gp)
  }, [currentWidget])

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
          <MarsTabPane key="style" tab="样式"></MarsTabPane>
          <MarsTabPane key="availability" tab="时序"></MarsTabPane>
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
            {acTab === "style" && (
              <MarsStyle
                style={style}
                graphic={graphic}
                layerName={layerName}
                customType={customType}
                graphicType={graphicType}
                onChange={(data) => {
                  console.log("修改了style样式", data)
                  graphic.setStyle(_.cloneDeep(data))
                  // setStyle(_.cloneDeep(data))
                }}
              ></MarsStyle>
            )}
            {acTab === "availability" && (
              <MarsAvailability
                availability={availability}
                onChange={(data) => {
                  if (data && data.length) {
                    graphic.availability = data
                  } else {
                    graphic.availability = null
                  }
                }}
              ></MarsAvailability>
            )}
          </div>
        </>
      )}
    </MarsDialog>
  )
}

export default GraphicEditor
