import { MarsDialog, MarsIcon, MarsTabs } from "@mars/components/MarsUI"
import { useLifecycle } from "@mars/widgets/common/uses/useLifecycle"
import { aloneTypeStyle } from "@mars/utils/mars-util"
import { Space } from "antd"
import * as mars3d from "mars3d"
import { useEffect, useState, useCallback } from "react"
import MarsStyle from "./MarsStyle"
import MarsBaseinfo from "./MarsBaseinfo"
import * as mapWork from "./map"
import "./index.less"

let graphicData: any
function GraphicEditor({ currentWidget, ...props }) {
  useLifecycle(mapWork)

  const [acTab, setAcTab] = useState("style")

  const [graphicOptions, setGraphicOptions] = useState(null)
  const [customType, setCustomType] = useState("")
  const [graphicType, setGraphicType] = useState("")

  // 样式
  const [style, setStyle] = useState(null)
  // 多个类型作为参数设置的矢量,如fixedRoute
  const [styleParArr, setStyleParArr] = useState([])

  useEffect(() => {
    // console.log("编辑面板接收到了graphic对象更新:", currentWidget)
    if (!currentWidget.data.layerId || !currentWidget.data.graphicId) {
      return
    }
    setGraphicType(null)
    setTimeout(() => {
      initGraphicItem(currentWidget.data.layerId, currentWidget.data.graphicId)
    }, 10)
  }, [currentWidget.data])

  // 监听到矢量数据发生变化
  function initGraphicItem(layerId: string | number, graphicId: string | number) {
    graphicData = mapWork.getGraphicOptions(layerId, graphicId)
    if (!graphicData) {
      return
    }
    setGraphicOptions(graphicData)
    // =====style===========
    const styleOptions = graphicData.style ?? {}

    const paraArr = aloneTypeStyle[graphicData.type]
    if (paraArr && paraArr.length) {
      paraArr.forEach((typeItem) => {
        const typeData = graphicData[typeItem]

        if (typeof typeItem !== "string" && typeItem.length) {
          typeItem.forEach((item) => {
            styleOptions[item] = graphicData[item]
          })
        } else if (typeData) {
          styleOptions[typeItem] = { ...typeData }
        }
      })
      setStyleParArr(paraArr)
    }

    setStyle(styleOptions)

    // =====其他参数===========
    setGraphicType(graphicData.type)
    setCustomType(currentWidget.data.styleType ?? graphicData.styleType)
  }

  const tabChange = useCallback((key: string) => {
    setAcTab(key)
  }, [])

  function getStyleHtml() {
    if (!styleParArr?.length) {
      return (
        <MarsStyle
          style={style}
          customType={customType}
          graphicType={graphicType}
          onChange={(data, key?) => {
            mapWork.setGraphicOptions({ style: data })

            let newStyle: any = {}
            if (key) {
              newStyle = { ...style, [key]: { ...style[key], ...data[key] } }
            } else {
              newStyle = { ...style, ...data }
            }
            // console.log("修改了style样式", style, data, newStyle)
            setStyle(newStyle)
          }}
        ></MarsStyle>
      )
    } else {
      return (
        <>
          <MarsStyle
            style={style}
            customType={customType}
            graphicType={graphicType}
            isParent={true}
            onChange={(data, key) => {
              mapWork.setGraphicOptions({ ...data })

              let newStyle: any = {}
              if (key) {
                newStyle = { ...style, [key]: { ...style[key], ...data[key] } }
              } else {
                newStyle = { ...style, ...data }
              }
              // console.log("修改了style样式", style, data, newStyle)
              setStyle(newStyle)
            }}
          ></MarsStyle>
          {styleParArr.map(
            (item, index) =>
              typeof item === "string" && (
                <MarsStyle
                  key={index}
                  style={style[item]}
                  graphicType={item}
                  parentType={graphicType}
                  onChange={(data, key) => {
                    mapWork.setGraphicOptions({ ...data })

                    let newStyle: any = {}
                    if (key) {
                      newStyle = { ...style, [key]: { ...style[key], ...data[key] } }
                    } else {
                      newStyle = { ...style, ...data }
                    }
                    // console.log("修改了style样式", style, data, newStyle)
                    setStyle(newStyle)
                  }}
                ></MarsStyle>
              )
          )}
        </>
      )
    }
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
        <MarsTabs
          tabPosition="bottom"
          activeKey={acTab}
          type="card"
          destroyInactiveTabPane={false}
          items={[
            { key: "style", label: "样式" },
            { key: "baseInfo", label: "基础" }
          ]}
          onTabClick={tabChange}
        ></MarsTabs>
      }
    >
      {graphicData && (
        <>
          <div className="top-handle-bar">
            <Space>
              <MarsIcon icon="send" width="20" click="flyToGraphic" title="飞行定位" onClick={() => mapWork.graphic.flyTo()}></MarsIcon>
              <MarsIcon icon="delete" width="20" click="deleteEntity" title="删除" onClick={() => mapWork.graphic.remove()}></MarsIcon>
              <MarsIcon
                icon="save"
                width="20"
                click="getGeoJson"
                title="导出geojson"
                onClick={() => {
                  // 文件处理
                  const geojson = mapWork.graphic.toJSON()
                  mars3d.Util.downloadFile("标绘item.json", JSON.stringify(geojson))
                }}
              ></MarsIcon>
            </Space>
          </div>
          <div className="attr-editor-main">
            {acTab === "style" && graphicType && getStyleHtml()}
            {acTab === "baseInfo" && (
              <MarsBaseinfo
                data={graphicOptions}
                graphicType={graphicType}
                onChange={(data) => {
                  mapWork.setGraphicOptions({ ...data })

                  const newOptions = { ...graphicOptions, ...data }
                  setGraphicOptions(newOptions)
                }}
              ></MarsBaseinfo>
            )}
          </div>
        </>
      )}
    </MarsDialog>
  )
}

export default GraphicEditor
