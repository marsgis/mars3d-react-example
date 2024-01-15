import { MarsDialog, MarsIcon, MarsTabs, MarsTabPane, MarsButton } from "@mars/components/MarsUI"
import { useLifecycle } from "@mars/widgets/common/uses/useLifecycle"
import { Space } from "antd"
import * as mars3d from "mars3d"
import { useEffect, useState, useCallback } from "react"
import MarsStyle from "./MarsStyle"
import MarsAvailability from "./MarsAvailability"
import * as mapWork from "./map"
import _ from "lodash"
import "./index.less"



function GraphicEditor({ currentWidget, ...props }) {
  useLifecycle(mapWork)

  const [graphic, setGraphic] = useState(null)
  const [style, setStyle] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [showAvailability, setShowAvailability] = useState(true)

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
    if (currentWidget?.data?.hideAvailability) {
      setShowAvailability(false)
    }

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

  const items = [
    { key: "style", label: "样式" }
  ]

  function getItems(items) {
    if (showAvailability) {
      items.push({
        key: "availability", label: "时序"
      })
    }
    return items
  } 

  return (
    <MarsDialog
      title="属性编辑"
      width="315"
      top="60"
      bottom="40"
      left="10"
      minWidth={200}
      {...props}
      footer={
        <MarsTabs tabPosition="bottom" activeKey={acTab} type="card" onTabClick={tabChange} items={ getItems(items) }></MarsTabs>
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
            {(
              <MarsStyle
                style={style}
                showMarsStyle={ acTab === "style" }
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
            {(
              <MarsAvailability
                availability={availability}
                showMarsStyle={ acTab === "availability" }
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
