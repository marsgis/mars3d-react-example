import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

export let graphicLayer // 矢量图层对象
export let testGraphicLayer
export let treeGraphicLayer

export const echartTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.328067, lng: 116.032025, alt: 1320.6, heading: 121.2, pitch: -19.3 },
    fxaa: true
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

  // 创建矢量数据图层
  testGraphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(testGraphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tower-taihu.json" })
    .then(function (res) {
      showData(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tower-taihu-tree.json" })
    .then(function (res) {
      showTreeData(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let polylines1 = []
let polylines2 = []
let polylines3 = []

function showData(arrdata) {
  const polylinesTB = [] // 图标显示的点

  // 预处理坐标及角度
  for (let i = 0, len = arrdata.length; i < len; i++) {
    const item = arrdata[i]
    const position = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.alt)
    item.position = position
    item.index = i + 1

    // 模型比例，根据塔高换算
    item.scale = item.height / 52

    // 测试塔顶高度与实际高度是否一致
    // const positionTop = mars3d.PointUtil.addPositionsHeight(position, item.height) // 顶部点
    // const graphic2 = new mars3d.graphic.PointPrimitive({
    //   position: positionTop,
    //   style: {
    //     color: "#ff0000",
    //     pixelSize: 8,
    //     outlineColor: "#ffffff",
    //     outlineWidth: 2
    //   }
    // })
    // graphicLayer.addGraphic(graphic2)

    // 计算电线塔转角角度
    if (i !== 0) {
      const priorPt = arrdata[i - 1].position
      item.lineHeading = mars3d.MeasureUtil.getAngle(priorPt, position) // 线的角度
    }
  }

  // 计算各坐标及路线坐标，并渲染矢量对象
  for (let i = 0, len = arrdata.length; i < len; i++) {
    const item = arrdata[i]
    const position = item.position

    // 计算电线塔转角角度
    let degree = item.heading
    // if (degree) {
    //   item.degree = item.lineHeading - item.heading
    // } else {
    if (i === 0) {
      degree = arrdata[i + 1].lineHeading
    } else if (i === len - 1) {
      degree = arrdata[i].lineHeading
    } else {
      const nextTower = arrdata[i + 1]
      let stepAngle = (nextTower.lineHeading - item.lineHeading) / 2
      if (stepAngle > 90) {
        stepAngle = 180 - stepAngle
      } else if (stepAngle < -90) {
        stepAngle = stepAngle + 180
      }
      degree = item.lineHeading + stepAngle
    }
    item.degree = degree
    // }

    const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)

    // 3个悬垂串的位置
    const offsetLineZ = item.height - 3.9
    let newPoint1 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 10.6, offsetLineZ), hpr) // 左边挂线
    let newPoint2 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, 0, offsetLineZ), hpr) // 中间线
    let newPoint3 = mars3d.PointUtil.getPositionByHprAndOffset(position, new Cesium.Cartesian3(0, -10.6, offsetLineZ), hpr) // 右边挂线

    polylinesTB.push(newPoint2) // 图标显示的点

    drawWireTowerModel(position, degree, item.scale, item)
    drawWireTowerJYZModel(newPoint1, degree)// 3个悬垂串模型
    drawWireTowerJYZModel(newPoint2, degree)
    drawWireTowerJYZModel(newPoint3, degree)

    // 计算路线点
    const jyzHeight = -5
    newPoint1 = mars3d.PointUtil.addPositionsHeight(newPoint1, jyzHeight)
    newPoint2 = mars3d.PointUtil.addPositionsHeight(newPoint2, jyzHeight)
    newPoint3 = mars3d.PointUtil.addPositionsHeight(newPoint3, jyzHeight)

    if (i === 0) {
      polylines1.push(newPoint1)
      polylines2.push(newPoint2)
      polylines3.push(newPoint3)
    } else {
      const angularityFactor = -5000
      const num = 50
      let positions = mars3d.PolyUtil.getLinkedPointList(polylines1[polylines1.length - 1], newPoint1, angularityFactor, num) // 计算曲线点
      polylines1 = polylines1.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines2[polylines2.length - 1], newPoint2, angularityFactor, num) // 计算曲线点
      polylines2 = polylines2.concat(positions)

      positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines3.length - 1], newPoint3, angularityFactor, num) // 计算曲线点
      polylines3 = polylines3.concat(positions)
    }
  }

  // 绘制路线
  drawGuideLine(polylines1, "#0000ff")
  drawGuideLine(polylines2, "#cccccc")
  drawGuideLine(polylines3, "#ff0000")

  polylines1 = mars3d.LngLatArray.toArray(polylines1)
  polylines2 = mars3d.LngLatArray.toArray(polylines2)
  polylines3 = mars3d.LngLatArray.toArray(polylines3)

  // 绘制断面图echarts图表
  computeSurfacePointsHeight(polylinesTB)
}

// 绘制电线塔模型
function drawWireTowerModel(position, degree, scale, item) {
  const html = mars3d.Util.getTemplateHtml({
    title: "塔杆",
    template: [
      { field: "index", name: "杆塔序号" },
      { field: "type", name: "杆塔型号" },
      { field: "degree", name: "方向" },
      { field: "height", name: "杆塔高度" },
      { field: "alt", name: "海拔高度" }
    ],
    attr: item
  })

  const graphic = new mars3d.graphic.ModelPrimitive({
    position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/tower/tower-500kV.glb",
      heading: degree,
      scale: scale,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
    },
    popup: html
  })
  graphicLayer.addGraphic(graphic)
}

function drawWireTowerJYZModel(position, degree) {
  // cesium v1.123渲染报错，暂时注释了
  // const graphic2 = new mars3d.graphic.ModelPrimitive({
  //   position,
  //   style: {
  //     url: "//data.mars3d.cn/gltf/mars/tower/tower-jyz.glb",
  //     heading: degree,
  //     pitch: 90, // 模型本身不是竖直，需要加pitch纠正
  //     scale: 1,
  //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
  //   }
  // })
  // graphicLayer.addGraphic(graphic2)
}

function drawGuideLine(positions, color) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions,
    style: {
      width: 4,
      color
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 绘制断面图echarts图表
function computeSurfacePointsHeight(polylines) {
  // 绘制断面图
  mars3d.PolyUtil.computeSurfacePoints({
    scene: map.scene,
    positions: polylines, // 需要计算的源路线坐标数组
    exact: true
  }).then((result) => {
    const heightArry = []
    const heightTDArray = []
    let distanceArray
    for (let i = 0; i < polylines.length; i++) {
      const item = polylines[i]
      const carto = Cesium.Cartographic.fromCartesian(item)

      const height = mars3d.Util.formatNum(carto.height) // 设计高度  当小数点后面的数字一致时，会省略小数点，不显示
      const tdHeight = mars3d.Util.formatNum(Cesium.Cartographic.fromCartesian(result.positions[i]).height) // 地面高度
      heightArry.push(height)
      heightTDArray.push(tdHeight)

      // 距离数组
      const positionsLineFirst = result.positions[0]
      distanceArray = result.positions.map(function (data) {
        return Math.round(Cesium.Cartesian3.distance(data, positionsLineFirst)) // 计算两点之间的距离,返回距离
      })
    }
    echartTarget.fire("addEchart", { heightArry, heightTDArray, distanceArray })
  })
}

//= ==========计算最近点=============

// 渲染所有树，单击可以单个计算
function showTreeData(arrdata) {
  // 创建矢量数据图层
  treeGraphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(treeGraphicLayer)

  // 在layer上绑定监听事件
  treeGraphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了Tree矢量对象", event)

    const point = event.graphic.attr.top
    drawNearPointInfo(point)
  })

  for (let i = 0, len = arrdata.length; i < len; i++) {
    const item = arrdata[i]

    const position = Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.alt)
    const positionTop = mars3d.PointUtil.addPositionsHeight(position, item.height) // 树顶部点

    // 模型比例，根据数高换算
    const scale = item.height / 5.6

    const graphic = new mars3d.graphic.ModelPrimitive({
      position,
      style: {
        url: "//data.mars3d.cn/gltf/imap/de07d417d587494291daccb7670609fb/gltf/gltf2.gltf",
        scale: scale,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000.0)
      },
      attr: {
        top: positionTop
      }
    })
    treeGraphicLayer.addGraphic(graphic)

    // 测试 树顶部高度 与实际高度是否一致
    const graphic2 = new mars3d.graphic.PointPrimitive({
      position: positionTop,
      style: {
        color: "#ff0000",
        pixelSize: 3,
        outlineColor: "#ffffff",
        outlineWidth: 1
      },
      attr: {
        top: positionTop
      }
    })
    treeGraphicLayer.addGraphic(graphic2)
  }
}

// 批量计算所有树
export async function batchComputing() {
  globalMsg("计算的数据较多，计算中，请稍后……")

  setTimeout(() => {
    treeGraphicLayer.eachGraphic((graphic) => {
      const point = graphic.attr.top
      drawNearPointInfo(point)
    })
  }, 1000)
}

// 单个绘制点的计算
export async function drawPoint() {
  const graphic = await testGraphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 8,
      color: "#3388ff"
    }
  })
  console.log("完成了draw标绘", graphic)

  let point = graphic.positionShow

  point = mars3d.PointUtil.addPositionsHeight(point, 10) // 树高抬高测试
  graphic.position = point

  drawNearPointInfo(point)
}

function drawNearPointInfo(point) {
  point = mars3d.LngLatPoint.toArray(point)

  let selLine // 多个线中的最近线
  let selNearest // 多个线中的最近线对应的最近点

  let minDis = Number.MAX_VALUE
  const arrLines = [polylines1, polylines2, polylines3]
  for (let index = 0; index < arrLines.length; index++) {
    const line = arrLines[index]
    const snapped = turf.nearestPointOnLine(turf.lineString(line), turf.point(point), { units: "meters" }) // 点到线上最近的点

    if (snapped.properties.dist < minDis) {
      minDis = snapped.properties.dist

      selLine = line
      selNearest = snapped
    }
  }

  const nearOnLinePt = selLine[selNearest.properties.index] // 最近点（电线上的实际点）
  const nearOnLineNextPt = selLine[selNearest.properties.index + 1] ?? nearOnLinePt // 最近点的下一个点（电线上的实际点）
  const resultPt = selNearest.geometry.coordinates // 与电线的垂线的 新坐标交点,但不知道高度值)

  // 垂线的交点新坐标对应高度的计算
  const h1 = nearOnLinePt[2]
  const h2 = nearOnLineNextPt[2]
  const dis1 = mars3d.MeasureUtil.getDistance([nearOnLinePt, resultPt])
  const dis2 = mars3d.MeasureUtil.getDistance([nearOnLineNextPt, resultPt])
  if (dis1 === 0) {
    resultPt[2] = h1
  } else if (dis2 === 0) {
    resultPt[2] = h2
  } else {
    resultPt[2] = h2 + ((h1 - h2) * dis1) / (dis1 + dis2)
  }

  // addTestPoint(nearOnLinePt, "线上index点")
  // addTestPoint(nearOnLineNextPt, "线上index+1点")
  addTestPoint(resultPt, "我是最近点")

  // 显示测量结果
  const graphic = new mars3d.graphic.HeightTriangleMeasure({
    positions: [point, resultPt],
    style: {
      width: 3,
      color: "#ffff00"
    },
    label: {
      font_size: 13,
      color: "#ffffff",
      pixelOffsetY: -10,
      distanceDisplayCondition: true,
      distanceDisplayCondition_far: 4000,
      distanceDisplayCondition_near: 0
    }
  })
  testGraphicLayer.addGraphic(graphic)
}

function addTestPoint(position, text) {
  const graphic = new mars3d.graphic.PointEntity({
    position: position,
    style: {
      color: "#00ff00",
      pixelSize: 8,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      label: {
        text: text,
        font_size: 13,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 4000,
        distanceDisplayCondition_near: 0
      }
    }
  })
  testGraphicLayer.addGraphic(graphic)
}
