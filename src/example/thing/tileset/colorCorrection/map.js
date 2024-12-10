import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032698, alt: 73, heading: 343, pitch: -21 }
  }
}

let tiles3dLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    // tilesetLayer.colorCorrection 是TilesetColorCorrection对象，因为与模型是1对1关系，已经内置进去
    colorCorrection: {
      brightness: 1.0
    }
  })
  map.addLayer(tiles3dLayer)

  // let tilesetColorCorrection = new mars3d.thing.TilesetColorCorrection({
  //   layer: tiles3dLayer
  // })
  // map.addThing(tilesetColorCorrection)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 是否开启特效
export function setDepthOfField(val) {
  tiles3dLayer.colorCorrection.enabled = val
}
// 修改对应参数
export function setBrightness(val) {
  tiles3dLayer.colorCorrection.brightness = val
}

export function setContrast(val) {
  tiles3dLayer.colorCorrection.contrast = val
}

export function setHue(val) {
  tiles3dLayer.colorCorrection.hue = val
}

export function setSaturation(val) {
  tiles3dLayer.colorCorrection.saturation = val
}
