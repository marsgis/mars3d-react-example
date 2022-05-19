import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let rectangularSensor

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.834006, lng: 118.779512, alt: 306743, heading: 313, pitch: -58 },
    cameraController: {
      constrainedAxis: false
    }
  },
  control: {
    sceneModePicker: false
  }
}

export const eventTarget = new mars3d.BaseClass()

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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * 默认相阵控雷达
 * @param {number} heading 方向角
 * @param {number} pitch 仰角
 * @param {number} roll 左右（row）
 * @param {number} radius 半径
 * @param {number} xValue 上下夹角
 * @param {number} yValue 左右夹角
 * @returns {void}
 */
export function addDemoGraphic1(params) {
  rectangularSensor = new mars3d.graphic.RectangularSensor({
    position: [117.218875, 31.817812, 138],
    style: {
      heading: params.headingValue,
      pitch: params.pitchValue,
      roll: params.rollValue,

      radius: params.radius, // 传感器的半径
      xHalfAngleDegree: params.xValue, // 传感器水平半角
      yHalfAngleDegree: params.yValue, // 传感器垂直半角

      color: "#00ffff",
      opacity: 0.4,
      lineColor: "#ffffff", // 线的颜色

      showScanPlane: true, // 是否显示扫描面
      scanPlaneColor: "#00ffff",
      scanPlaneOpacity: 0.9,
      scanPlaneMode: "vertical", // 扫描面模式 垂直vertical/水平horizontal
      scanPlaneRate: 3, // 扫描速率,
      depthTest: true
    }
  })

  graphicLayer.addGraphic(rectangularSensor)
}

/**
 * 半径发生改变
 *
 * @export
 * @param {number} value 半径值
 * @returns {void}
 */
export function radiusChange(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.radius = value
  })
}

/**
 * 方向发生改变
 *
 * @export
 * @param {number} value 角度
 * @returns {void}
 */
export function headingChange(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.heading = value
  })
}

/**
 * 仰角发生改变
 *
 * @export
 * @param {number} value 仰角
 * @returns {void}
 */
export function pitchChange(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.pitch = value
  })
}

/**
 * roll发生改变
 *
 * @export
 * @param {number} value 仰角
 * @returns {void}
 */
export function rollChange(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.roll = value
  })
}

/**
 * 上下夹角
 *
 * @export
 * @param {number} value 夹角
 * @returns {void}
 */
export function xHalfAngle(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.style = { xHalfAngleDegree: value }
  })
}

/**
 * 左右夹角
 *
 * @export
 * @param {number} value 夹角
 * @returns {void}
 */
export function yHalfAngle(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.style = { yHalfAngleDegree: value }
  })
}

/**
 * 是否显示扫描面
 *
 * @export
 * @param {boolean} value  value = true/false
 * @returns {void}
 */
export function ShowScanPlane(value) {
  graphicLayer.eachGraphic((rectangularSensor) => {
    rectangularSensor.style = { showScanPlane: value } // 是否显示扫描面
  })
}

/**
 * 绘制相阵控雷达
 *
 * @param {number} heading 方向
 * @param {number} pitch 仰角
 * @param {number} roll 左右（row）
 * @param {number} radius 半径
 * @param {number} xHalfAngle 上下夹角
 * @param {number} yHalfAngle 左右夹角
 * @returns {void}
 */
export function startDraw(params) {
  // 开始绘制
  graphicLayer.startDraw({
    type: "rectangularSensor",
    style: {
      heading: params.headingValue,
      pitch: params.pitchValue,
      roll: params.rollValue,

      radius: params.radius, // 传感器的半径
      xHalfAngleDegree: params.xValue, // 传感器水平半角
      yHalfAngleDegree: params.yValue, // 传感器垂直半角

      color: "#00ffff",
      opacity: 0.4,
      lineColor: "#ffffff", // 线的颜色

      showScanPlane: true, // 是否显示扫描面
      scanPlaneColor: "#00ffff",
      scanPlaneOpacity: 0.9,
      scanPlaneMode: "vertical", // 扫描面模式 垂直vertical/水平horizontal
      scanPlaneRate: 3, // 扫描速率,
      depthTest: true
    }
  })
}
