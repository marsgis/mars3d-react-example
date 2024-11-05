import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    homeButton: false // 方式1：options中添加控件 - 视角复位控制 控件 (Cesium原生)
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

  // 修改控件title
  // document.getElementsByClassName("cesium-home-button")[0].setAttribute("title", "复位")

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const homeButton = new mars3d.control.HomeButton({
    title: "复位",
    icon: "//data.mars3d.cn/img/control/homeButton.svg", // 回到默认视域按钮
    click: function (event) {
      console.log("HomeButton 自定义click方法")
      map.flyHome()
    }
  })
  map.addControl(homeButton)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
