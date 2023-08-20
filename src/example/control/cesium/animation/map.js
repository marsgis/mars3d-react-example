import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    timeline: false,
    animation: false // 当前演示的示例控件 - 时钟仪表控制 控件 (Cesium原生)
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

  // 修改原生控件范围
  // 该方法需要在 创建map(new mars3d.Map(options)) 之前执行
  // Cesium.AnimationViewModel.defaultTicks = [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, 120.0, 300.0, 600.0, 900.0, 1800.0, 3600.0]

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const animation = new mars3d.control.Animation({
    ticks: [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0] // 调整范围
  })
  map.addControl(animation)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
