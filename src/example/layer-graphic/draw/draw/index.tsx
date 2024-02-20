import { MarsPannel, MarsButton, MarsGui } from "@mars/components/MarsUI"
import { Space, Upload } from "antd"
import { useEffect } from "react"
import * as mapWork from "./map.js"
import { LocationTo } from "@mars/components/MarsSample/LocationTo"
import { activate, disable, updateWidget, isActive } from "@mars/widgets/common/store/widget"

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

function UIComponent() {
  useEffect(() => {
    // @ts-ignore
    const mars3d = window.mars3d
    // 矢量数据创建完成
    // mapWork.graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    //   activate({
    //     name: "GraphicEditor",
    //     data: { graphic: e.graphic }
    //   })
    // })
    // 修改了矢量数据
    mapWork.graphicLayer.on(
      [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
      function (e) {
        if (isActive("GraphicEditor")) {
          updateWidget("GraphicEditor", { graphic: e.graphic })
        } else {
          activate({
            name: "GraphicEditor",
            data: { graphic: e.graphic }
          })
        }
      }
    )
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
    <>
      <MarsPannel visible={true} right="10" top="10" width="345px">
        <MarsGui
          options={[
            {
              type: "checkbox",
              field: "control",
              label: "图层管理",
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
                },
                {
                  label: "开启顶点吸附",
                  value: "onlyVertexPosition"
                }
              ],
              change(data) {
                onChangeShow(data.includes("show"))
                onChangePopup(data.includes("bindpopup"))
                onChangeTooltip(data.includes("bindtooltip"))
                onChangeContextMenu(data.includes("bindmenu"))
                onChangeHasEdit(data.includes("iseditable"))
                onChangeOnlyPickModel(data.includes("onlyVertexPosition"))
              }
            },
            {
              type: "custom",
              label: "数据管理",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.graphicLayer.clear()}>清除</MarsButton>
                  <Upload
                    multiple={false}
                    name="file"
                    accept="json,geojson,kml,kmz"
                    showUploadList={false}
                    onChange={onClickOpenJson}
                    beforeUpload={() => false}
                  >
                    <MarsButton>打开</MarsButton>
                  </Upload>
                  <MarsButton onClick={() => mapWork.saveGeoJSON()}>保存GeoJSON</MarsButton>
                  <MarsButton onClick={() => mapWork.saveKML()}>另存KML</MarsButton>
                  <MarsButton onClick={() => mapWork.saveWKT()}>另存WKT</MarsButton>
                </Space>
              )
            },
            {
              type: "custom",
              label: "单个点类",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawPoint()}>点</MarsButton>
                  <MarsButton onClick={() => mapWork.drawLabel()}>文字</MarsButton>
                  <MarsButton onClick={() => mapWork.drawMarker()}>图标点</MarsButton>
                  <MarsButton onClick={() => mapWork.startDrawModel()}>小模型</MarsButton>
                </Space>
              )
            },
            {
              type: "custom",
              label: "二维空间",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawPolyline(false)}>线</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon(false)}>面</MarsButton>
                  <MarsButton onClick={() => mapWork.drawEllipse(false)}>圆</MarsButton>
                  <MarsButton onClick={() => mapWork.drawRectangle(false)}>矩形</MarsButton>
                  <MarsButton onClick={() => mapWork.draPlane()}>平面</MarsButton>
                  <MarsButton onClick={() => mapWork.drawCurve(false)}>曲线</MarsButton>
                  <MarsButton onClick={() => mapWork.drawCorridor(false)}>走廊</MarsButton>
                </Space>
              )
            },
            {
              type: "custom",
              label: "二维贴地",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawPolyline(true)}>线</MarsButton>
                  <MarsButton onClick={() => mapWork.drawPolygon(true)}>面</MarsButton>
                  <MarsButton onClick={() => mapWork.drawEllipse(true)}>圆</MarsButton>
                  <MarsButton onClick={() => mapWork.drawCurve(true)}>曲线</MarsButton>
                  <MarsButton onClick={() => mapWork.drawCorridor(true)}>走廊</MarsButton>
                  <MarsButton onClick={() => mapWork.drawRectangle(true)}>矩形</MarsButton>
                </Space>
              )
            },
            {
              type: "custom",
              label: "三维空间",
              element: (
                <Space wrap>
                  <MarsButton onClick={() => mapWork.drawEllipsoid()}>球</MarsButton>
                  <MarsButton onClick={() => mapWork.draWall(false)}>墙</MarsButton>
                  <MarsButton onClick={() => mapWork.drawBox()}>盒子</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedCircle()}>圆柱</MarsButton>
                  <MarsButton onClick={() => mapWork.drawCylinder()}>圆锥</MarsButton>
                  <MarsButton onClick={() => mapWork.draWall(true)}>闭合墙</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedPolygon()}>面立体</MarsButton>
                  <MarsButton onClick={() => mapWork.drawExtrudedRectangle()}>矩形立体</MarsButton>
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

// 是否仅在Tiles上拾取
function onChangeOnlyPickModel(onlyVertexPosition: boolean) {
  mapWork.updateonlyVertexPosition(onlyVertexPosition)
}

export default UIComponent
