import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let fogEffect

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.770983, lng: 116.227417, alt: 1020, heading: 132, pitch: -17 },
    globe: {
      depthTestAgainstTerrain: true // 必须开启
    }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 雾效果
  fogEffect = new mars3d.effect.HighFog({
    height: 300 // 大于此高度后不显示
  })
  map.addEffect(fogEffect)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 是否开始雾效果
export function setFogEffect(val) {
  fogEffect.enabled = val
}

// 改变雾的颜色
export function setColor(color) {
  fogEffect.color = Cesium.Color.fromCssColorString(color)
}

export function setGlobalDensity(val) {
  fogEffect.density = val
}
export function setFogHeight(val) {
  fogEffect.height = val
}
