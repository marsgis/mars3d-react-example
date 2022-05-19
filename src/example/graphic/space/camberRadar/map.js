import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let camberRadar
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.784488, lng: 117.16699, alt: 9030, heading: 1, pitch: -57 },
    cameraController: {
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    sceneModePicker: false
  }
}
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * 地图加载完成，添加一个双曲面雷达
 *
 * @export
 * @param {Object} radarParsms
 * @returns {void}
 */
export function getViewConfig(radarParsms) {
  const style = {
    radius: radarParsms.outerRadius,
    startRadius: radarParsms.innerRadius,

    heading: radarParsms.headingValue,
    pitch: radarParsms.pitchValue,
    roll: radarParsms.rollValue,

    startFovH: Cesium.Math.toRadians(radarParsms.startFovH),
    endFovH: Cesium.Math.toRadians(radarParsms.endFovH),
    startFovV: Cesium.Math.toRadians(radarParsms.startFovV),
    endFovV: Cesium.Math.toRadians(radarParsms.endFovV)
  }

  camberRadar = new mars3d.graphic.CamberRadar({
    position: [117.170264, 31.840312, 363],
    style: {
      color: "#ff0000",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      segmentH: 50,
      ...style
    }
  })
  graphicLayer.addGraphic(camberRadar)
}

export function headingChange(value) {
  camberRadar.heading = value
}

export function pitchChange(value) {
  camberRadar.pitch = value
}

export function rollChange(value) {
  camberRadar.roll = value
}

export function outerRadiusChange(val) {
  camberRadar.radius = val
}

export function innerRadiusChange(val) {
  camberRadar.startRadius = val
}

export function startFovHChange(value) {
  camberRadar.startFovH = Cesium.Math.toRadians(value)
}

export function endFovHChange(value) {
  camberRadar.endFovH = Cesium.Math.toRadians(value)
}

export function startFovVChange(value) {
  camberRadar.startFovV = Cesium.Math.toRadians(value)
}

export function endFovVChange(value) {
  camberRadar.endFovV = Cesium.Math.toRadians(value)
}
