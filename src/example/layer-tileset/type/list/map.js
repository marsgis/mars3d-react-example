import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.623553, lng: 117.322405, alt: 123536, heading: 359, pitch: -81 }
  },
  control: {
    baseLayerPicker: false
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  queryTilesetData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function createLayer(layers) {
  return mars3d.LayerUtil.create(layers) // 创建图层
}

// 数据获取
async function queryTilesetData() {
  const result = await mars3d.Util.fetchJson({ url: "config/tileset.json" })
  map.setLayersOptions(result.layers)

  eventTarget.fire("initTree")
}

export function getLayrsTree(params) {
  return map.getLayrsTree(params)
}

export function getLayerById(id) {
  return map.getLayerById(id)
}

// 更新图层勾选状态
export function updateLayerShow(layer, show) {
  if (show) {
    if (!layer.isAdded) {
      map.addLayer(layer)
    }
    layer.show = true

    layer.flyTo() // 如果不想勾选定位，注释该行
  } else {
    layer.show = false
  }
}
