import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

const arrData = [
  { name: "油罐一", position: [117.09521, 31.814404, 47.3] },
  { name: "油罐二", position: [117.095206, 31.814878, 47.3] },
  { name: "油罐三", position: [117.094653, 31.814428, 47.3] },
  { name: "发电机", position: [117.093428, 31.816959, 31.8] },
  { name: "指挥室", position: [117.093953, 31.814397, 36] },
  { name: "加热罐", position: [117.09385, 31.815837, 36.9] },
  { name: "冷却室", position: [117.094662, 31.816403, 32.9] }
]

export const mapOptions = {
  scene: {
    center: { lat: 31.81226, lng: 117.096703, alt: 231, heading: 329, pitch: -28 }
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

  // 加载油田联合站模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    pid: 2020,
    type: "3dtiles",
    name: "油田联合站",
    url: "//data.mars3d.cn/3dtiles/max-ytlhz/tileset.json",
    position: { lng: 117.094224, lat: 31.815859, alt: 26.4 },
    rotation: { z: 116.2 },
    maximumScreenSpaceError: 1,
    center: { lat: 32.407076, lng: 117.459703, alt: 3361, heading: 358, pitch: -51 }
  })
  map.addLayer(tiles3dLayer)

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 初始加载
  for (let i = 0; i < arrData.length; i++) {
    const item = arrData[i]

    const graphic = new mars3d.graphic.CanvasBillboard({
      position: item.position,
      style: {
        text: 18,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(800, 0.4, 1200, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000)
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  setInterval(() => {
    graphicLayer.eachGraphic((graphic) => {
      graphic.text = random(0, 100) // 更新文本
    })
  }, 1000)
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

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
