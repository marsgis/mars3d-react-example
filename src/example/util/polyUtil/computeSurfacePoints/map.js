import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

export const mapOptions = {
  scene: {
    center: { lat: 31.667593, lng: 117.163634, alt: 5394.7, heading: 358.7, pitch: -55.8 }
  },
  terrain: false
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

let graphicLayer
let graphic1
let graphic2
let graphic3

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({ popup: "all" })
  map.addLayer(graphicLayer)

  const point = [117.181079, 31.705313, 100]

  graphic1 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c1.gltf"
    },
    attr: { remark: "c1" }
  })
  graphicLayer.addGraphic(graphic1)

  graphic2 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c2.gltf"
    },
    attr: { remark: "c2" }
  })
  graphicLayer.addGraphic(graphic2)

  graphic3 = new mars3d.graphic.ModelPrimitive({
    position: point,
    style: {
      url: "//data.mars3d.cn/gltf/mars/dikuai/c3.gltf"
    },
    attr: { remark: "c3" }
  })
  graphicLayer.addGraphic(graphic3)
}
/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function removeAll() {
  hideTipMarker()
}

export function measureSection() {
  graphicLayer
    .startDraw({
      type: "polyline",
      style: {
        color: "#ff0000",
        width: 3
      }
    })
    .then((graphic) => {
      const positionsShow = graphic.positionsShow
      graphic.remove(true)

      showTipLine(positionsShow)
      computeStepSurfaceLine(positionsShow)
    })
}

export const formatDistance = mars3d.MeasureUtil.formatDistance

async function computeStepSurfaceLine(positions) {
  const newPositions = mars3d.PolyUtil.interPolyline({
    map,
    positions,
    splitNum: 50,
    exact: true,
    surfaceHeight: false // 不用重复计算高度
  })
  console.log("插值后新坐标数组", newPositions)

  graphic1.show = true
  graphic2.show = false
  graphic3.show = false
  await delay(100)

  const result1 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints1 = result1.positions
  console.log("生成第1层数据", result1)

  graphic1.show = false
  graphic2.show = true
  graphic3.show = false
  await delay(100)

  const result2 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints2 = result2.positions
  console.log("生成第2层数据", result2)

  graphic1.show = false
  graphic2.show = false
  graphic3.show = true
  await delay(500)
  const result3 = await mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: newPositions,
    has3dtiles: true,
    exact: true
  })
  const arrHeightPoints3 = result3.positions
  console.log("生成第3层数据", result3)

  graphic1.show = true
  graphic2.show = true
  graphic3.show = true

  let all_distance = 0
  let this_distance = 0
  const arrPoint = []
  const arrLen = []
  const arrHB1 = []
  const arrHB2 = []
  const arrHB3 = []

  for (let i = 0; i < arrHeightPoints1.length; i++) {
    // 长度
    if (i !== 0) {
      const templen = Cesium.Cartesian3.distance(arrHeightPoints1[i], arrHeightPoints1[i - 1])
      all_distance += templen
      this_distance += templen
    }
    arrLen.push(Number(all_distance.toFixed(1)))

    // 海拔高度
    const point = mars3d.LngLatPoint.fromCartesian(arrHeightPoints1[i])
    arrHB1.push(point.alt)
    arrPoint.push(point)

    // 其他3层的高度
    const point2 = mars3d.LngLatPoint.fromCartesian(arrHeightPoints2[i])
    arrHB2.push(point2.alt)

    const point3 = mars3d.LngLatPoint.fromCartesian(arrHeightPoints3[i])
    arrHB3.push(point3.alt)
  }

  eventTarget.fire("measureEnd", { arrLen, arrHB1, arrHB2, arrHB3, arrPoint })
}

let lineGraphic
export function showTipLine(positions) {
  if (lineGraphic) {
    lineGraphic.remove(true)
  }
  lineGraphic = new mars3d.graphic.DistanceMeasure({
    positions: positions,
    style: {
      width: 6,
      color: "#3388ff",
      clampToGround: true
    },
    showAddText: true
  })
  graphicLayer.addGraphic(lineGraphic)
}

let tipGraphic
/**
 *  echart图表中的图标
 *
 * @export
 * @param {Array} point 坐标点
 * @param {number} z 海拔高度
 * @param {html} inthtml html
 * @returns {void}
 */
export function showTipMarker(point, z, inthtml) {
  const _position_draw = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z)

  if (!tipGraphic) {
    tipGraphic = new mars3d.graphic.BillboardEntity({
      name: "当前点",
      position: _position_draw,
      style: {
        image: "//data.mars3d.cn/img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
      }
    }).addTo(map.graphicLayer)
    tipGraphic._setPositionsToCallback()
  }
  tipGraphic._position_draw = _position_draw
  tipGraphic.bindPopup(inthtml).openPopup()
}

export function hideTipMarker() {
  if (!tipGraphic) {
    return
  }
  tipGraphic.remove(true)
  tipGraphic = null
}

// eslint-disable-next-line promise/param-names
const delay = (ms) => new Promise((res) => setTimeout(res, ms))
