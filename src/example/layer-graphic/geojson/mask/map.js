import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.307787, lng: 117.559842, alt: 312871, heading: 0, pitch: -64 },
    cameraController: {
      zoomFactor: 3.0
      // minimumZoomDistance: 1,
      // maximumZoomDistance: 1000000
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
  map = mapInstance // 记录首次创建的map

  addDemoGeoJsonLayer1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGeoJsonLayer1() {
  // geojson 合肥边界线
  const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
    url: "//data.mars3d.cn/file/geojson/areas/340100.json",
    mask: true, // 标识为遮罩层【重点参数】
    symbol: {
      styleOptions: {
        fill: true,
        color: "rgb(2,26,79)",
        opacity: 0.9,
        outline: true,
        outlineColor: "#39E09B",
        outlineWidth: 8,
        outlineOpacity: 0.8,
        arcType: Cesium.ArcType.GEODESIC,
        // global: false, // 是否全球遮罩，false时为中国区域
        clampToGround: true
      }
    }
    // flyTo: true
  })
  map.addLayer(geoJsonLayer)
}

function addDemoGraphic1() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const graphic = new mars3d.graphic.Mask({
    positions: [
      [117.110342, 32.535753],
      [117.488096, 32.230414],
      [117.881477, 32.229449],
      [117.982377, 31.490802],
      [117.492253, 30.937991],
      [117.025486, 31.238623],
      [117.154036, 31.536974],
      [116.764612, 31.521848],
      [116.687682, 31.914268],
      [116.965552, 32.115349]
    ],
    style: {
      fill: true,
      color: "rgb(2,26,79)",
      opacity: 0.9,
      outline: true,
      outlineColor: "#39E09B",
      outlineWidth: 8,
      outlineOpacity: 0.8,
      arcType: Cesium.ArcType.GEODESIC,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)
}
