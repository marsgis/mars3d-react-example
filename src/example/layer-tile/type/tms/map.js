import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.968111, lng: 106.437663, alt: 8098707, heading: 5, pitch: -88 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    // {
    //   name: "TMS影像地图",
    //   icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
    //   type: "tms", // tms类型
    //   url: "//data.mars3d.cn/tile/tms",
    //   show: false
    // },
    // {
    //   name: "TMS影像地图2",
    //   icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
    //   type: "xyz", // xyz类型+tms参数
    //   tms: true,
    //   url: "//data.mars3d.cn/tile/tms/{z}/{x}/{y}.png"
    // }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  addTileLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer

export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.TmsLayer({
    name: "TMS瓦片",
    url: "//data.mars3d.cn/tile/tms"
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
