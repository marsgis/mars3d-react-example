import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.250697, lng: 121.468373, alt: 1768.9, heading: 116.2, pitch: -30.5 }
  }
}

export let tilesetShake
export let tiles3dLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2013 // 无底图

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  tilesetShake = new mars3d.thing.TilesetShake({
    layer: tiles3dLayer,
    positions: [
      [121.48754, 31.237295, 15.1],
      [121.49268, 31.246588, 14.5],
      [121.519515, 31.249963, 2],
      [121.524191, 31.240138, 23.7],
      [121.520988, 31.229589, 30.5],
      [121.50516, 31.220627, 11.6]
    ],
    maxDistance: 5,
    duration: 1200, // 时长
    maxHeight: 130
  })
  map.addThing(tilesetShake)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export async function drawArea() {
  const graphic = await map.graphicLayer.startDraw({
    type: "polygonP",
    style: {
      color: "rgba(255, 0, 0, 0.5)",
      outline: true,
      outlineColor: "#ffffff"
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.removeGraphic(graphic)

  tilesetShake.positions = positions
}
