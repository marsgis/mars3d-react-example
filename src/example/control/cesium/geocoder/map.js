import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    geocoder: true,
    geocoderConfig: {
      key: ["f2fedb9b08ae13d22f1692cd472d345e", "2e6ca4aeb6867fb637a5bee8333e5d3a"] // 高德key
    }
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

  // 查询结果回调方法
  map.controls.geocoder.viewModel.complete.addEventListener(function () {
    const arrdata = map.controls.geocoder.viewModel.suggestions
    console.log("查询结果", arrdata)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
