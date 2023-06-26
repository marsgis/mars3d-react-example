import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.842839, lng: 117.204275, alt: 269.9, heading: 179, pitch: -77.7 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

let videoPolygon

function addDemoGraphic1(graphicLayer) {
  videoPolygon = new mars3d.graphic.VideoPrimitive({
    positions: [
      [117.204858, 31.842209, 45.6],
      [117.204087, 31.842184, 43.6],
      [117.204087, 31.842668, 43.6],
      [117.204827, 31.842712, 43.6]
    ],
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
      opacity: 0.9,
      distanceDisplayCondition_far: 5000
    }
  })
  graphicLayer.addGraphic(videoPolygon)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 90 + 45, result.radius)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 180 + 45, result.radius)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 270 + 45, result.radius)

    const graphic = new mars3d.graphic.VideoPrimitive({
      positions: [pt1, pt2, pt3, pt4],
      style: {
        url: "//data.mars3d.cn/file/video/lukou.mp4"
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

export function updateROI(uvROI) {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }
  videoPolygon.rois = uvROI
}

export function clearROI() {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }
  videoPolygon.rois = undefined
}

export const choosePoint = (isChoosePoint) => {
  if (!videoPolygon || videoPolygon.isDestroy) {
    return
  }

  if (isChoosePoint) {
    videoPolygon.startEditingGrid()
  } else {
    videoPolygon.stopEditingGrid()
  }
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer
    .startDraw({
      type: "videoPrimitive",
      style: {
        url: "//data.mars3d.cn/file/video/lukou.mp4",
        opacity: 0.8
      },
      success: function (graphic) {
        videoPolygon = graphic
      }
    })
    .then((graphic) => {
      videoPolygon = graphic
    })
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
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
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "开始编辑网格点",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return !graphic.isEditingGrid
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.startEditingGrid()
        }
      }
    },
    {
      text: "停止编辑网格点",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.isEditingGrid
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditingGrid()
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
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },

    {
      text: "计算周长",
      icon: "fa fa-medium",
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}
