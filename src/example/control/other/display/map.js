import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    homeButton: {
      icon: "//data.mars3d.cn/img/control/homeButton.svg"
    },
    fullscreenButton: {
      icon: "//data.mars3d.cn/img/control/fullscreenButton.svg"
    },
    navigationHelpButton: {
      icon: "//data.mars3d.cn/img/control/navigationHelpButton.svg"
    },
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode" },
    baseLayerPicker: true,
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    distanceLegend: { left: "100px", bottom: "25px" },
    compass: { top: "10px", left: "5px" }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  const control = map.getControl("navigationHelpButton", "type")
  control.on(mars3d.EventType.click, function (event) {
    console.log("您单击了帮助按钮", event)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 按钮
export function bindPOI(val) {
  map.control.geocoder.show = val
}

// 视角复位
export function bindView(val) {
  map.control.homeButton.show = val
}

// 基础的地图切换
export function bindBaseLayerPicker(val) {
  map.control.baseLayerPicker.show = val
}

// 全屏切换
export function bindFullScreen(val) {
  map.control.fullscreenButton.show = val
}

// VR
export function bindVR(val) {
  map.control.vrButton.show = val
}

// 帮助按钮
export function bindHelpButton(val) {
  map.control.navigationHelpButton.show = val
}

// 二三维切换
export function bindSceneModePicker(val) {
  map.control.sceneModePicker.show = val
}

export function bindZoom(val) {
  map.control.zoom.show = val
}

// 面板：
// 信息状态栏
export function bindLocation(val) {
  map.control.locationBar.show = val
}

// 时钟
export function bindClock(val) {
  map.control.clockAnimate.show = val
}

// 时间刻度线
export function bindTimeLine(val) {
  map.control.timeline.show = val
}

// 导航球
export function bindNav(val) {
  map.control.compass.show = val
}

// 比例尺
export function bindLegend(val) {
  map.control.distanceLegend.show = val
}

// 图层
export function bindLayer(val) {
  document.getElementById("mars-manage-layer-btn").style.display = val ? "inline-block" : "none"
}
