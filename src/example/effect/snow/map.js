import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let snowEffect
let snowCover

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032697, alt: 73, heading: 343, pitch: -21 },
    globe: {
      // depthTestAgainstTerrain: true
    }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 雾化效果
  map.scene.fog.density = 0.001
  map.scene.fog.minimumBrightness = 0.8

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "https://data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  snowEffect = new mars3d.effect.Snow({
    speed: 20,
    maxHeight: 8000 // 大于此高度后不显示
  })
  map.addEffect(snowEffect)

  snowCover = new mars3d.effect.SnowCover({
    layer: tiles3dLayer, // 如果传值3dtiles图层，只对该模型生效
    alpha: 0.6,
    maxHeight: 8000 // 大于此高度后不显示
  })
  map.addEffect(snowCover)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 是否开启下雪效果
export function setSnow(val) {
  snowEffect.enabled = val
}

// 速度
export function setSpeed(value) {
  snowEffect.speed = value
}
//
export function setScale(value) {
  snowEffect.scale = value
}

// 是否开启积雪效果
export function setCover(val) {
  snowCover.enabled = val
}

// 积雪厚度
export function setAlpha(value) {
  snowCover.alpha = value
}
