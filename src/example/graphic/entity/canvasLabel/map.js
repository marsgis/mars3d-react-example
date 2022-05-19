import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerEvent() // 对图层绑定相关事件
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
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

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    position: new mars3d.LngLatPoint(116.308659, 30.914005, 429.94),
    style: {
      text: "合肥火星科技有限公司",
      font_size: 50,
      scale: 0.5, // font_size放大，再缩小可以文字显示更清晰
      font_family: "黑体",
      color: "#ffffff",
      backgroundColor: "rgba(226,190,40,0.5)",
      backgroundPadding: 15,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      visibleDepth: false
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.position = [116.18869, 30.95041, 525.84]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.text = "MarsGIS-我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "贴地文字",
    position: new mars3d.LngLatPoint(116.241728, 30.879732),
    style: {
      text: "Mars3D平台",
      font_size: 50,
      scale: 0.5, // font_size放大，再缩小可以文字显示更清晰
      color: "#ffff00",

      stroke: true,
      strokeColor: "#cccccc",
      strokeWidth: 2,

      clampToGround: true
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "根据视距缩放文字",
    position: new mars3d.LngLatPoint(116.340026, 30.873948, 383.31),
    style: {
      text: "中国安徽合肥",
      font_size: 60,
      color: "#00ff00",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      scaleByDistance: new Cesium.NearFarScalar(10000, 0.5, 500000, 0.1)
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CanvasLabelEntity({
    name: "根据视距显示文字",
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 1548.6),
    style: {
      text: "火星科技Mars3D平台",
      font_size: 50,
      scale: 0.5, // font_size放大，再缩小可以文字显示更清晰
      font_family: "微软雅黑",
      color: "#ffffff",

      // backgroundColor: "rgba(226,190,40,0.5)",
      backgroundPadding: 15,
      outlineColor: "#ffffff",
      outlineWidth: 5,

      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000),

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        font_size: 30
      }
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

// 在图层级处理一些事物
function bindLayerEvent() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  /* graphicLayer.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听layer，鼠标移入了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听layer，鼠标移出了矢量对象", event)
  }) */

  // 数据编辑相关事件， 用于属性弹窗的交互
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    eventTarget.fire("graphicEditor-start", e)
  })

  graphicLayer.on(
    [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
    function (e) {
      eventTarget.fire("graphicEditor-update", e)
    }
  )

  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    eventTarget.fire("graphicEditor-stop", e)
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
    }
  ])
}

// 按钮事件
export function updateLayerHasEdit(val) {
  graphicLayer.hasEdit = val
}

export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "canvasLabel",
    style: {
      text: "火星科技Mars3D平台",
      color: "#0081c2",
      font_size: 50,
      scale: 0.5, // font_size放大，再缩小可以文字显示更清晰

      stroke: true,
      strokeColor: "#ffffff",
      strokeWidth: 2
    },
    success: function (graphic) {
      console.log("绘制完成", graphic)
    }
  })
}

export function onClickStartBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce()
    }
  })
}

export function onClickStartBounce2() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.startBounce) {
      graphic.startBounce({
        autoStop: true,
        step: 2,
        maxHeight: 90
      })
    }
  })
}

export function onClickStopBounce() {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.stopBounce) {
      graphic.stopBounce()
    }
  })
}
