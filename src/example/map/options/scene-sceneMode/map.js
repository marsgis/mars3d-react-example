import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.692469, lng: 116.341333, alt: 16567, heading: 0, pitch: -30 },
    sceneMode: Cesium.SceneMode.SCENE3D,
    cameraController: {
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000
    }
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

  // 加个标识
  const graphic = new mars3d.graphic.PointEntity({
    position: [116.317765, 30.973406, 1508],
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    tooltip: "我是视角中心点"
    // flyTo: true
  })
  map.graphicLayer.addGraphic(graphic)

  // // 切换场景前事件
  // let lastCameraView // 记录视角
  // map.on(mars3d.EventType.morphStart, function (event) {
  //   lastCameraView = map.getCameraView()
  // })
  // // 切换场景后事件
  // map.on(mars3d.EventType.morphComplete, function (event) {
  //   map.setCameraView(lastCameraView, { duration: 0 })
  // })

  // 切换场景前事件
  let lastCenterPoint // 记录中心点
  map.on(mars3d.EventType.morphStart, function (event) {
    lastCenterPoint = map.getCenter()
    if (lastCenterPoint) {
      graphic.position = lastCenterPoint
    }
  })
  // 切换场景后事件
  map.on(mars3d.EventType.morphComplete, function (event) {
    if (lastCenterPoint) {
      const radius = map.camera.positionCartographic.height
      map.flyToPoint(lastCenterPoint, { radius, duration: 0 })
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 切换为二维视图
export function to2d() {
  map.scene.morphTo2D(0)
}

// 切换为三维视图
export function to3d() {
  map.scene.morphTo3D(0)
}

// 切换为2.5D维视图
export function toGLB() {
  map.scene.morphToColumbusView(0)
}
