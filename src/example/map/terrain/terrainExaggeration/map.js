import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.086616, lng: 118.731447, alt: 97704, heading: 244, pitch: -22 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // map.scene.globe.terrainExaggeration = 10 // 修改地形夸张程度,v1.115及之前版本

  map.scene.verticalExaggeration = 10 // 修改地形夸张程度, v1.116+版本
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

/**
 * 地形夸张程度改变
 * @param {number} val 默认值1.0
 * @returns {void}
 */
export function changeTerrain(val) {
  map.scene.verticalExaggeration = val
}
