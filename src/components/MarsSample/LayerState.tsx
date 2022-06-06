import { MarsPannel, $alert, MarsCheckboxGroup, MarsFormItem } from "@mars/components/MarsUI"
const mapWork = window.mapWork
const mars3d = mapWork.mars3d

const onChangeShow = () => {
  const layer = getManagerLayer()
  layer.show = true
}

const onChangePopup = () => {
  if (mapWork.bindLayerPopup) {
    mapWork.bindLayerPopup()
  } else {
    bindLayerPopup()
  }
}

const onChangeTooltip = () => {
  const layer = getManagerLayer()
  // layer.bindTooltip("我是layer上绑定的Tooltip")
  layer.bindTooltip(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["类型"] = event.graphic?.type
      attr["来源"] = "我是layer上绑定的Toolip"
      attr["备注"] = "我支持鼠标移入交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
    },
    { pointerEvents: true }
  )
}

const onChangeRightMenu = () => {
  const layer = getManagerLayer()
  if (mapWork.bindLayerContextMenu) {
    mapWork.bindLayerContextMenu()
  } else {
    bindLayerContextMenu()
  }
}

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

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })

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
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.startEditing) {
          return false
        }
        return !graphic.isEditing
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.isEditing
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.stopEditing(graphic)
        }
      }
    },
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

const optionsWithDisabled = [
  { label: "显示", value: "show" },
  { label: "Popup", value: "popup" },
  { label: "Tooltip", value: "tooltip" },
  { label: "右键菜单", value: "rightMenu" }
]

function onChange(checkedValues) {
  const layer = getManagerLayer()
  layer.show = false // 先隐藏
  layer.unbindPopup() // 先解除popup
  layer.unbindTooltip() // 先解除tooltip
  layer.unbindContextMenu(true) // 线解除右键菜单

  checkedValues.forEach((type: string) => {
    switch (type) {
      case "show":
        onChangeShow()
        break

      case "popup":
        onChangePopup()
        break

      case "tooltip":
        onChangeTooltip()
        break

      case "rightMenu":
        onChangeRightMenu()
        break

      default:
        break
    }
  })
}

export const LayerState = (props) => {
  return (
    <div style={{ height: "23px" }}>
      <span className="mars-pannel-item-label" style={{ display: props.label ? "none" : "" }}>
        {props.label || "图层状态:"}
      </span>
      <MarsCheckboxGroup options={optionsWithDisabled} defaultValue={["show", "popup", "rightMenu"]} onChange={onChange} />
    </div>
  )
}
