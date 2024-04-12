import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 30.991457, lng: 116.336944, alt: 2610.8, heading: 223.8, pitch: -29.4 }
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
  addDemoGraphic3(graphicLayer)
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
    attr: { remark: "示例1" }
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
    attr: { remark: "示例2" }
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



function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.ModelEntity({
    name: "警车",
    position: new mars3d.LngLatPoint(116.312961, 30.986354, 1260),
    style: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      scale: 20,
      minimumPixelSize: 50,
      heading: 0
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)

  // 三维场景内调整方向不是很好用，建议直接UI面板弄3个角度的滑动条更方便。
  const pointEdit = new mars3d.thing.MatrixRotate({
    position: graphic.position,
    roll: graphic.style.heading,
    pitch: graphic.style.pitch,
    heading: graphic.style.heading
  })
  map.addThing(pointEdit)

  pointEdit.on(mars3d.EventType.change, (event) => {
    graphic.style.heading = event.heading
    graphic.style.pitch = event.pitch
    graphic.style.roll = event.roll
    graphic.updateOrientation()

    graphic.fire(mars3d.EventType.editStyle)
  })
}


