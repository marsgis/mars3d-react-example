import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lng: 102.5, lat: 35.13135, alt: 14307887.9, heading: 0, pitch: -90 }
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

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  // 创建视点，duration参数调节每个步骤时长
  const viewPoints = [
    { lng: 108.961601, lat: 34.217109, alt: 509.2, heading: 314.5, pitch: -22.5, duration: 6, stop: 0 },
    { lng: 108.96164, lat: 34.222159, alt: 510.3, heading: 211.2, pitch: -22.5, duration: 8, stop: 0 },
    { lng: 108.957259, lat: 34.221967, alt: 494.3, heading: 127.5, pitch: -17.2, duration: 8, stop: 0 },
    { lng: 108.957319, lat: 34.217225, alt: 515.5, heading: 25.4, pitch: -25.3, duration: 8 }
  ]

  // 视角切换（分步执行）
  map.setCameraViewList(viewPoints)

  // showCameraRoute(viewPoints) // 显示相机点的位置方向和路线，便于对比查看
}

export function pauseCameraViewList() {
  map.pauseCameraViewList()
}

export function proceedCameraViewList() {
  map.proceedCameraViewList()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
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
        angle: 45,
        distance: 2,
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
