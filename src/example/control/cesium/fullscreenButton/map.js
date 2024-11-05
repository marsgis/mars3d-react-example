import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    fullscreenButton: false // 当前演示的示例控件 - 全屏按钮 控件 (Cesium原生)
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

  globalNotify(
    "已知问题提示",
    `(1)cesium本身机制，用iframe嵌入后无法全屏里面的div；
     (2)示例框架原因，使用iframe嵌入，全屏后不显示其他面板；
    `
  )

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const fullscreenButton = new mars3d.control.FullscreenButton({
    // fullscreenElement: document.body, // 全屏整个页面
    fullscreenElement: map.container, // 仅全屏画布
    icon: "//data.mars3d.cn/img/control/fullscreenButton.svg"
  })
  map.addControl(fullscreenButton)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
