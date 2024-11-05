import * as mars3d from "mars3d"

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 22.740833, lng: 108.379371, alt: 88.7, heading: 41.6, pitch: -30.4 }
  }
}

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */

let roaming

export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // const tiles3dLayer = new mars3d.layer.TilesetLayer({
  //   url: "//data.mars3d.cn/3dtiles/max-ditiezhan/tileset.json",
  //   maximumScreenSpaceError: 1,
  //   popup: "all"
  // })
  // map.addLayer(tiles3dLayer)

  const viewPoints = [
    { id: 0, name: "地铁口", lat: 22.7407925, lng: 108.3793365, alt: 89.7, heading: 37.4, pitch: -7.1, duration: 2 },
    { id: 1, name: "电梯口1", lat: 22.7408074, lng: 108.3793484, alt: 89.7, heading: 37.4, pitch: -5.3, duration: 2 },
    { id: 2, name: "电梯口2", lat: 22.7408334, lng: 108.3793717, alt: 88.6, heading: 41.6, pitch: -30.5, duration: 5 },
    { id: 3, name: "电梯底部", lat: 22.7409422, lng: 108.3794671, alt: 79.4, heading: 38.9, pitch: -34.6, duration: 2 },
    { id: 4, name: "出电梯", lat: 22.7409655, lng: 108.3794862, alt: 79, heading: 38.3, pitch: -7.4, duration: 2 },
    { id: 5, name: "拐角1", lat: 22.7410111, lng: 108.3795193, alt: 79, heading: 36.1, pitch: -2, duration: 1.8 },
    { id: 6, name: "拐角2", lat: 22.7410482, lng: 108.379558, alt: 79, heading: 67.4, pitch: 4.3, duration: 8.5 },
    { id: 7, name: "拐角3", lat: 22.7412154, lng: 108.3801121, alt: 79, heading: 88.6, pitch: 7.5, duration: 2.6 },
    { id: 8, name: "拐角4", lat: 22.7412359, lng: 108.3802854, alt: 79, heading: 0, pitch: 8.4, duration: 7.2 },
    { id: 9, name: "拐角5", lat: 22.7413912, lng: 108.3802919, alt: 79, heading: 1.3, pitch: -0.8, duration: 4 },
    { id: 10, name: "准备拐进电梯1", lat: 22.7415327, lng: 108.3802764, alt: 79, heading: 94.1, pitch: 5, duration: 3.5 },
    { id: 11, name: "准备拐进电梯2", lat: 22.7415401, lng: 108.3803285, alt: 79, heading: 176.9, pitch: -1.4, duration: 3.6 },
    { id: 12, name: "电梯口1", lat: 22.7414846, lng: 108.3803289, alt: 79, heading: 181.3, pitch: -1.8, duration: 2 },
    { id: 13, name: "电梯口2", lat: 22.741466, lng: 108.3803291, alt: 78.7, heading: 176.9, pitch: -23.1, duration: 4 },
    { id: 14, name: "电梯口3", lat: 22.7414011, lng: 108.3803284, alt: 74.7, heading: 180.8, pitch: -38, duration: 2 },
    { id: 15, name: "出电梯", lat: 22.741388, lng: 108.3803281, alt: 73.9, heading: 177.7, pitch: 2.1, duration: 2.6 },
    { id: 16, name: "进地铁1", lat: 22.7413128, lng: 108.380329, alt: 73.9, heading: 189, pitch: 1.6, duration: 2.6 },
    { id: 17, name: "进地铁2", lat: 22.7412386, lng: 108.3803242, alt: 73.9, heading: 272.8, pitch: -4.8, duration: 2.6 }
  ]

  // eslint-disable-next-line no-undef
  roaming = new TweensRoaming({
    points: viewPoints
  })
  map.addThing(roaming)

  showCameraRoute(viewPoints) // 显示相机点的位置方向和路线，便于对比查看
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function start() {
  console.log("开始")
  roaming.start()
}

export function pause() {
  console.log("暂停")
  roaming.pause()
}
export function resume() {
  console.log("继续")
  roaming.resume()
}
export function stop() {
  console.log("停止")
  roaming.stop()
}

// 显示相机点的位置方向和路线，便于对比查看
function showCameraRoute(viewPoints) {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const points = []
  for (let i = 0; i < viewPoints.length; i++) {
    const item = viewPoints[i]
    const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, item.alt)
    points.push(position)

    // 文本
    const graphic = new mars3d.graphic.LabelPrimitive({
      position,
      style: {
        text: i,
        font_size: 14
      }
    })
    graphicLayer.addGraphic(graphic)

    // 相机角度示意
    const camera = new Cesium.Camera(map.scene)
    camera.position = position
    camera.frustum.aspectRatio = 1
    camera.frustum.fov = Cesium.Math.toRadians(45)
    camera.frustum.near = 0.01
    camera.frustum.far = 1
    camera.setView({
      destination: position,
      orientation: { heading: Cesium.Math.toRadians(item.heading), pitch: Cesium.Math.toRadians(item.pitch) }
    })

    const frustumPrimitive = new mars3d.graphic.FrustumPrimitive({
      position,
      camera,
      style: {
        angle: 40,
        distance: 0.5,
        fill: false,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 1.0
      }
    })
    graphicLayer.addGraphic(frustumPrimitive)
  }

  // 线
  const graphicLine = new mars3d.graphic.PolylinePrimitive({
    positions: points,
    style: {
      width: 1,
      color: "rgba(200,200,200,0.3)"
    }
  })
  graphicLayer.addGraphic(graphicLine)
}
