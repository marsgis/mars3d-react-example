import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let colorCorrection

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032698, alt: 73, heading: 343, pitch: -21 }
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

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  // 构造效果
  colorCorrection = new mars3d.effect.ColorCorrectionEffect()
  map.addEffect(colorCorrection)
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
  colorCorrection.enabled = val
}
// 修改对应参数
export function setBrightness(val) {
  colorCorrection.brightness = val
}

export function setContrast(val) {
  colorCorrection.contrast = val
}

export function setHue(val) {
  colorCorrection.hue = val
}

export function setSaturation(val) {
  colorCorrection.saturation = val
}
