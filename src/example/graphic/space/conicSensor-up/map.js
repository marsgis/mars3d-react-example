import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let conicSensor

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    // 此处参数会覆盖config.json中的对应配置
    center: { lat: 25.987821, lng: 122.076928, alt: 1295307, heading: 327, pitch: -59 }
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

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加个模型
  const graphic = new mars3d.graphic.ModelEntity({
    name: "地面站模型",
    position: [117.170264, 31.840312, 258],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)

  addConicSensor(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 初始化 添加一个双椎体
function addConicSensor(graphicLayer) {
  conicSensor = new mars3d.graphic.ConicSensor({
    position: [117.170264, 31.840312, 363],
    style: {
      angle: 25,
      length: 300000,
      color: "rgba(255,0,0,0.4)",
      outlineColor: "rgba(255,255,255,0.9)"
    }
  })
  graphicLayer.addGraphic(conicSensor)
}

// 顶部显示隐藏
export function sensorTop(isChecked) {
  conicSensor.topShow = isChecked
}

// 地面阴影
export function sensorArea(val) {
  conicSensor.shadowShow = val
}

// 圆锥体 显示/隐藏
export function sensorShowHide(isChecked) {
  conicSensor.show = isChecked
}

// 半径改变
export function sensorRadius(val) {
  conicSensor.length = val
}

// 角度(半长角)
export function angle(val) {
  conicSensor.angle = val
}
