import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 30.990185, lng: 116.341991, alt: 2465.9, heading: 224.8, pitch: -23.5 }
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

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
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
  const graphic = new mars3d.graphic.PointEntity({
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 1548.6),
    style: {
      color: "#0000ff",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)

  const pointEdit = new mars3d.thing.MatrixMove2({
    position: graphic.position
  })
  map.addThing(pointEdit)

  pointEdit.on(mars3d.EventType.change, (event) => {
    graphic.position = event.position
  })
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PointEntity({
    position: new mars3d.LngLatPoint(116.317108, 30.974377, 1528.3),
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)

  const pointEdit = new mars3d.thing.MatrixMove({
    position: graphic.position
  })
  map.addThing(pointEdit)

  pointEdit.on(mars3d.EventType.change, (event) => {
    graphic.position = event.position
  })
}
