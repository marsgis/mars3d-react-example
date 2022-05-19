import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.229785, lng: 113.226084, alt: 3339440, heading: 0, pitch: -81 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "Ion影像地图",
      icon: "img/basemaps/bingAerial.png",
      type: "ion",
      assetId: 2,
      accessToken: mars3d.Token.ion,
      show: true
    },
    {
      name: "Ion电子地图",
      icon: "img/basemaps/bingmap.png",
      type: "ion",
      assetId: 4,
      accessToken: mars3d.Token.ion
    }
  ]
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

  eventTarget.fire("mapLoaded")
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
