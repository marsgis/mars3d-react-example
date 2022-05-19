import { MarsPannel, MarsButton, MarsGui } from "@mars/components/MarsUI"
import { Space, Upload } from "antd"
import { useCallback, useEffect, useState } from "react"
import * as mapWork from "./map.js"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
// import { activate, disable, updateWidget, isActive } from "@mars/common/store/widgetnew"

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
// let needOpen = true

function UIComponent() {
  // useEffect(() => {
  //   // 编辑修改了模型
  //   mapWork.eventTarget.on("graphicEditor-update", async (e: any) => {
  //     needOpen = true
  //     if (isActive("GraphicEditor")) {
  //       updateWidget("GraphicEditor", { graphic: e.graphic })
  //     } else {
  //       activate({
  //         name: "GraphicEditor",
  //         data: { graphic: e.graphic }
  //       })
  //     }

  //     setTimeout(() => {
  //       needOpen = false
  //     }, 200)
  //   })

  //   // 停止编辑修改模型
  //   mapWork.eventTarget.on("graphicEditor-stop", async (e: any) => {
  //     setTimeout(() => {
  //       if (!needOpen) {
  //         disable("GraphicEditor")
  //       } else {
  //         needOpen = true
  //       }
  //     }, 100)
  //   })
  // }, [])
  return (
    <>
      <MarsPannel visible={true} right="10" top="10" width="345px">
        <MarsGui
          options={[
            {
              type: "checkbox",
              field: "control",
              label: "图层状态",
              value: ["show", "bindmenu", "iseditable"],
              options: [
                {
                  label: "显示隐藏",
                  value: "show"
                },
                {
                  label: "Popup绑定",
                  value: "bindpopup"
                },
                {
                  label: "Tooltip绑定",
                  value: "bindtooltip"
                },
                {
                  label: "右键菜单绑定",
                  value: "bindmenu"
                },
                {
                  label: "是否编辑",
                  value: "iseditable"
                }
              ],
              change(data) {
                onChangeShow(data.includes("show"))
                onChangePopup(data.includes("bindpopup"))
                onChangeTooltip(data.includes("bindtooltip"))
                onChangeContextMenu(data.includes("bindmenu"))
                onChangeHasEdit(data.includes("iseditable"))
              }
            },
            {
              type: "custom",
              label: "图层管理",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
                  <MarsButton onClick={() => mapWork.downloadJsonFile()}>保存GeoJSON</MarsButton>
                  <Upload
                    multiple={false}
                    name="file"
                    accept="json,geojson"
                    showUploadList={false}
                    onChange={onClickOpenJson}
                    beforeUpload={() => false}
                  >
                    <MarsButton>打开...</MarsButton>
                  </Upload>
                </Space>
              )
            },
            {
              type: "custom",
              label: "二维贴地",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawPolygon("doubleArrow")}>钳击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("closeVurve")}>闭合曲面</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("attackArrow")}>攻击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("gatheringPlace")}>集结地</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("straightArrow")}>粗直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("fineArrowYW")}>燕尾直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("fineArrow")}>粗单尖直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("attackArrowPW")}>平尾攻击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon("attackArrowYW")}>燕尾攻击箭头</MarsButton>
                </Space>
              )
            },
            {
              type: "custom",
              label: "三维贴地",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("doubleArrow")}>钳击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("closeVurve")}>闭合曲面</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("attackArrow")}>攻击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("gatheringPlace")}>集结地</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("straightArrow")}>粗直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("fineArrowYW")}>燕尾直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("fineArrow")}>粗单尖直箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("attackArrowPW")}>平尾攻击箭头</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon("attackArrowYW")}>燕尾攻击箭头</MarsButton>
                </Space>
              )
            }
          ]}
        ></MarsGui>
      </MarsPannel>
      <LocationTo />
    </>
  )
}

// 打开GeoJSON
function onClickOpenJson(info: FileInfo) {
  mapWork.openGeoJSON(info.file)
}

// 显示隐藏
function onChangeShow(enabledShowHide) {
  mapWork.graphicLayer.show = enabledShowHide
}

// 是否绑定Popup
function onChangePopup(enabledPopup: boolean) {
  if (enabledPopup) {
    mapWork.bindLayerPopup()
  } else {
    mapWork.graphicLayer.unbindPopup()
  }
}

// 是否绑定Tooltip
function onChangeTooltip(enabledTooltip: boolean) {
  if (enabledTooltip) {
    mapWork.graphicLayer.bindTooltip("我是layer上绑定的Tooltip")
  } else {
    mapWork.graphicLayer.unbindTooltip()
  }
}

// 是否绑定右键菜单
function onChangeContextMenu(enabledRightMenu: boolean) {
  if (enabledRightMenu) {
    mapWork.bindLayerContextMenu()
  } else {
    mapWork.graphicLayer.unbindContextMenu(true)
  }
}

// 是否可编辑
function onChangeHasEdit(enabledEdit: boolean) {
  mapWork.graphicLayer.hasEdit = enabledEdit
}

export default UIComponent
