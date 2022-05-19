import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 30.606438, lng: 116.329605, alt: 53280, heading: 0, pitch: -60 }
  }
}
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
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic14(graphicLayer)
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

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 2500.0),
      color: "#00ff00",
      opacity: 0.4,

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        color: "#00ff00",
        opacity: 0.8
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 演示个性化处理graphic
  initGraphicManager(graphic)
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 31.0, 1000),
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      color: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      maximumConeDegree: 90,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.EllipsoidWave, {
        color: "#00FF00",
        speed: 5.0
      }),
      outline: false
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.4, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 2500.0),
      innerRadii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
      minimumClockDegree: -15.0,
      maximumClockDegree: 15.0,
      minimumConeDegree: 75.0,
      maximumConeDegree: 105.0,
      pitch: 30,
      color: "#f33349",
      opacity: 0.9,
      outline: true,
      outlineColor: "#ffffff",
      label: {
        text: "我是原始的",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例4" }
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
  graphicCopy.position = [116.5, 31.0, 1000]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

// 2圈平面扇形
function addDemoGraphic5(graphicLayer) {
  const outerRadius = 5000.0
  const innerRadius = 1000

  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 30.9, 1000],
    style: {
      radii: new Cesium.Cartesian3(outerRadius, outerRadius, outerRadius),
      innerRadii: new Cesium.Cartesian3(innerRadius, innerRadius, innerRadius),
      minimumClockDegree: -20.0,
      maximumClockDegree: 20.0,
      minimumConeDegree: 90,
      maximumConeDegree: 90,
      color: "rgba(255,255,0,0.2)",
      outline: true
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 半圆顶球体
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      maximumConeDegree: 90,
      color: Cesium.Color.BLUE.withAlpha(0.3),
      outline: true
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 含内半径 半圆顶球体
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2000.0, 1500.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 800.0, 600.0),
      maximumConeDegree: 90,
      color: Cesium.Color.RED.withAlpha(0.3),
      outline: true
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 被切开的含内半径 半圆顶球体
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
      minimumConeDegree: 20.0,
      maximumConeDegree: 90,
      color: Cesium.Color.YELLOW.withAlpha(0.3),
      outline: true
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 顶部和底部切出的桶形体
function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.5, 30.9, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
      minimumConeDegree: 60.0,
      maximumConeDegree: 140.0,
      color: Cesium.Color.DARKCYAN.withAlpha(0.3),
      outline: true
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(graphic)
}

// 碗行体
function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.1, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1800.0, 1800.0, 1800.0),
      minimumConeDegree: 110.0,
      color: "rgba(31,254,230,0.3)",
      outline: true
    },
    attr: { remark: "示例10" }
  })
  graphicLayer.addGraphic(graphic)
}

// 时钟开孔
function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      innerRadii: new Cesium.Cartesian3(1500.0, 1500.0, 1500.0),
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: 20.0,
      maximumConeDegree: 70.0,
      color: "rgba(149,228,12,0.3)",
      outline: true
    },
    attr: { remark: "示例11" }
  })
  graphicLayer.addGraphic(graphic)
}

// 局部圆顶
function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      maximumConeDegree: 90.0,
      color: "rgba(242,250,25,0.3)",
      outline: true
    },
    attr: { remark: "示例12" }
  })
  graphicLayer.addGraphic(graphic)
}

// 部分椭圆体
function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.8, 1000),
    style: {
      radii: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
      innerRadii: new Cesium.Cartesian3(700.0, 700.0, 700.0),
      minimumClockDegree: 180.0,
      maximumClockDegree: 400.0,
      maximumConeDegree: 90.0,
      color: "rgba(247,154,44,0.3)",
      outline: true
    },
    attr: { remark: "示例13" }
  })
  graphicLayer.addGraphic(graphic)
}

// 土星综合对象
function addDemoGraphic14(graphicLayer) {
  const position = new mars3d.LngLatPoint(116.5, 30.8, 1000)
  const graphic = new mars3d.graphic.EllipsoidEntity({
    name: "土星",
    position: position,
    style: {
      radii: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
      color: new Cesium.Color(0.95, 0.82, 0.49)
    },
    attr: { remark: "示例14" }
  })
  graphicLayer.addGraphic(graphic)

  const graphicNei = new mars3d.graphic.EllipsoidEntity({
    name: "土星的内圈",
    position: position,
    style: {
      radii: new Cesium.Cartesian3(4000.0, 4000.0, 4000.0),
      innerRadii: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
      minimumConeDegree: 89.8,
      maximumConeDegree: 90.2,
      color: new Cesium.Color(0.95, 0.82, 0.49, 0.5),
      heading: 30,
      pitch: 30
    }
  })
  graphicLayer.addGraphic(graphicNei)

  const graphicWai = new mars3d.graphic.EllipsoidEntity({
    name: "土星外圈",
    position: position,
    style: {
      radii: new Cesium.Cartesian3(4600.0, 4600.0, 4600.0),
      innerRadii: new Cesium.Cartesian3(4150.0, 4150.0, 4150.0),
      minimumConeDegree: 89.8,
      maximumConeDegree: 90.2,
      color: new Cesium.Color(0.95, 0.82, 0.49, 0.5),
      heading: 30,
      pitch: 30
    }
  })
  graphicLayer.addGraphic(graphicWai)
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

export function updateLayerHasEdit(val) {
  graphicLayer.hasEdit = val
}

// 按钮事件
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "ellipsoid",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6
    }
  })
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  /* graphic.on(mars3d.EventType.click, function (event) {
    console.log("监听graphic，单击了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听graphic，鼠标移入了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听graphic，鼠标移出了矢量对象", event)
  }) */

  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}
