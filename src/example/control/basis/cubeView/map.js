import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.scene.center = { lat: 31.80616, lng: 117.131968, alt: 3066.7, heading: 46.1, pitch: -25.1 }
  option.control = {
    cubeView: { top: "10px", left: "5px" } // 当前示例展现的控件 - 立方体视图
  }
  return option
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  // const cubeView = new mars3d.control.CubeView({ top: "10px", right: "5px" })
  // map.addControl(cubeView)

  map.control.cubeView.on(mars3d.EventType.click, function(event) {
    globalMsg("单击了 cubeView 控件")
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
