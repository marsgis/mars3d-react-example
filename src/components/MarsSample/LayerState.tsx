import { MarsPannel, $alert, MarsCheckboxGroup, MarsCheckbox } from "@mars/components/MarsUI"
import { useEffect, useMemo, useState } from "react"
import { Space } from "antd"
const mapWork = window.mapWork
const mars3d = mapWork.mars3d

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  if (mapWork.getManagerLayer) {
    return mapWork.getManagerLayer()
  }
  return mapWork.graphicLayer
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  const graphicLayer = getManagerLayer()
  graphicLayer.bindPopup(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["类型"] = event.graphic?.type
      attr["来源"] = "我是layer上绑定的Popup"
      attr["备注"] = "我支持鼠标交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })

      // return new Promise((resolve) => {
      //   //这里可以进行后端接口请求数据，setTimeout测试异步
      //   setTimeout(() => {
      //     resolve('Promise异步回调显示的弹窗内容信息')
      //   }, 2000)
      // })
    },
    { pointerEvents: true }
  )
}

// 绑定右键菜单
function bindLayerContextMenu() {
  const graphicLayer = getManagerLayer()

  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphicLayer.removeGraphic(graphic)
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        $alert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        $alert("该对象的面积为:" + strArea)
      }
    }
  ])
}

function getAttrForEvent(event) {
  if (event?.graphic?.attr) {
    return event.graphic.attr
  }
  if (!event.czmObject) {
    return {}
  }

  let attr = event.czmObject._attr || event.czmObject.properties || event.czmObject.attribute
  if (attr && attr.type && attr.attr) {
    attr = attr.attr // 兼容历史数据,V2内部标绘生产的geojson
  }
  return attr ?? {}
}

export const LayerState = (props) => {
  const [show, setShow] = useState(true)
  const [popup, setPopup] = useState(true)
  const [toolTip, setToolTip] = useState(false)
  const [menu, setMenu] = useState(false)

  useMemo(() => {
    // 恢复默认状态
    if (mapWork.eventTarget) {
      mapWork.eventTarget.on("defuatData", (item: any) => {
        setShow(item.enabledShowHide)
        setPopup(item.enabledPopup)
        setToolTip(item.enabledTooltip)
        setMenu(item.enabledRightMenu)
      })
    }
  }, [])

  useEffect(() => {
    const layer = getManagerLayer()
    if (layer) {
      setShow(layer.show)
      setPopup(layer.hasPopup())
      setToolTip(layer.hasTooltip())
      setMenu(layer.hasContextMenu())
    }
  }, [])

  // 控制显示隐藏
  const onChangeShow = (e) => {
    const checked = e.target.checked
    setShow(checked)
    const layer = getManagerLayer()
    layer.show = checked
  }

  // 绑定Popup
  const onChangePopup = (e) => {
    const checked = e.target.checked
    setPopup(checked)

    const layer = getManagerLayer()

    if (checked) {
      if (mapWork.bindLayerPopup) {
        mapWork.bindLayerPopup()
      } else {
        bindLayerPopup()
      }
    } else {
      layer.unbindPopup()
    }
  }

  // 绑定Tooltip
  const onChangeTooltip = (e) => {
    const checked = e.target.checked
    setToolTip(checked)
    const layer = getManagerLayer()
    if (checked) {
      // layer.bindTooltip("我是layer上绑定的Tooltip")
      layer.bindTooltip(
        function (event) {
          const attr = getAttrForEvent(event)
          attr["类型"] = event.graphic?.type
          attr["来源"] = "我是layer上绑定的Toolip"
          attr["备注"] = "我支持鼠标移入交互"

          return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
        },
        { pointerEvents: true }
      )
    } else {
      layer.unbindTooltip()
    }
  }

  // 绑定右键菜单
  const onChangeRightMenu = (e) => {
    const checked = e.target.checked
    setMenu(checked)
    const layer = getManagerLayer()
    if (checked) {
      if (mapWork.bindLayerContextMenu) {
        mapWork.bindLayerContextMenu()
      } else {
        bindLayerContextMenu()
      }
    } else {
      layer.unbindContextMenu(true)
    }
  }

  return (
    <div className="layerSet" style={{ height: "23px" }}>
      <Space direction={props.direction || "vertical"} wrap={!!props.wrap}>
        <span className="mars-pannel-item-label" style={{ display: props.label === "" ? "none" : "" }}>
          {props.label || "图层状态:"}
        </span>

        <MarsCheckbox checked={show} onChange={onChangeShow}>
          显示
        </MarsCheckbox>
        <MarsCheckbox checked={popup} onChange={onChangePopup}>
          Popup
        </MarsCheckbox>
        <MarsCheckbox checked={toolTip} onChange={onChangeTooltip}>
          Tooltip
        </MarsCheckbox>
        <MarsCheckbox checked={menu} onChange={onChangeRightMenu}>
          右键菜单
        </MarsCheckbox>
      </Space>
    </div>
  )
}
