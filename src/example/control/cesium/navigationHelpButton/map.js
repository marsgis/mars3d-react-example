import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    navigationHelpButton: false // 方式1：options中添加控件
  }
  return option
}

const localStorageName = "mars3d-hasSeenNavHelp-" + mars3d.Util.formatDate(new Date(), "yyyy-MM-dd")

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const navigationHelpButton = new mars3d.control.NavigationHelpButton({
    icon: "//data.mars3d.cn/img/control/navigationHelpButton.svg",
    firstOpen: true,
    localStorageName: localStorageName // 仅为了方便演示,实际项目中不需要
  })
  map.addControl(navigationHelpButton)

  // 按钮触发自定义方法
  // map.control.navigationHelpButton._container.addEventListener("click", (event) => {
  //   console.log("自定义方法")
  // })
  // navigationHelpButton._container.onclick = function (event) {
  //   console.log("自定义方法")
  // }
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
