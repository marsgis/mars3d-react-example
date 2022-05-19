import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let rectSensor
let testLine

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 23.729961, lng: 116.284734, alt: 1868672, heading: 355, pitch: -65 },
    cameraController: {
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
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

  addConicSensor()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 初始化创建一个四棱锥体
function addConicSensor() {
  // 四棱锥体
  rectSensor = new mars3d.graphic.RectSensor({
    position: [117.170264, 31.840312, 363],
    style: {
      angle1: 30,
      angle2: 30,
      length: 700000,
      // length: new Cesium.CallbackProperty(function (time) {
      //   length += 100 //测试动态length
      //   return length
      // }, false),
      heading: 0,
      pitch: 40,
      roll: 0,
      color: "rgba(0,255,0,0.4)",
      outline: true,
      topShow: true,
      topSteps: 2
    }
  })
  graphicLayer.addGraphic(rectSensor)

  // 测试连接线
  testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = rectSensor.rayPosition
      if (!localEnd) {
        return []
      }
      return [rectSensor.position, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.PolylineDash, {
        color: "#ff0000"
      }),
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)
}

// 方向角
export function headingChange(value) {
  rectSensor.heading = value
}

// 俯仰角
export function pitchChange(value) {
  rectSensor.pitch = value
}

// 左右角
export function rollChange(value) {
  rectSensor.roll = value
}

// 夹角1
export function angle1(value) {
  rectSensor.angle1 = value
}
// 夹角1
export function angle2(value) {
  rectSensor.angle2 = value
}

// 显示/隐藏
export function sensorShowHide(val) {
  rectSensor.show = val
  testLine.show = val
}

// 顶部显示隐藏
export function sensorTop(val) {
  rectSensor.topShow = val
}

export function sensorLength(val) {
  rectSensor.length = val
}
