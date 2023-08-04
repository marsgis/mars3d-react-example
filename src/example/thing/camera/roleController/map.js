/**
 * 该示例由 刘博方 开发，
 * 开源地址： https://github.com/ShareQiu1994/CesiumRoleController/
 */
import * as mars3d from "mars3d"
import { CesiumRoleController } from "./CesiumRoleController.js"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.839441, lng: 117.153132, alt: 857.4, heading: 5, pitch: -28.3 }
  }
}

let controller // 控制器

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  controller = new CesiumRoleController(mars3d.Cesium, map.viewer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startController() {
  map.setCursor("crosshair")

  map.once("click", (event) => {
    map.setCursor("default")
    initController(event.cartesian)
  })
}

export function stopController() {
  controller.destroy()
}

function initController(position) {
  const point = mars3d.LngLatPoint.fromCartesian(position) // 转为经纬度
  controller.init({
    position: [point.lng, point.lat],
    url: "//data.mars3d.cn/gltf/mars/man/running.glb",
    animation: "run",
    lockViewLevel: 1,
    pitch: -25,
    speed: 2,
    range: 300.0
  })
}
