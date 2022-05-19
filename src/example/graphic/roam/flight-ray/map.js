import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let roamLine
const roamLineData = {}

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.344715, lng: 115.783073, alt: 10056, heading: 158, pitch: -55 },
    globe: {
      // depthTestAgainstTerrain: true,
    }
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
  map.hasTerrain = false

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该数据可以从 基础项目 飞行漫游功能界面操作后保存JSON
  const flydata = {
    speed: 200,
    positions: [
      [115.833866, 31.311451, 4000],
      [115.785116, 31.293944, 4000],
      [115.748115, 31.266263, 4000],
      [115.711031, 31.216472, 4000]
    ],
    model: {
      url: "//data.mars3d.cn/gltf/mars/zhanji.glb",
      scale: 0.01,
      minimumPixelSize: 100,
      show: true
    },
    path: {
      color: "#ffff00",
      width: 3,
      show: true
    },
    shadow: {
      type: "wall",
      show: true
    },
    camera: {
      type: "zy",
      followedX: 50,
      followedZ: 10
    },
    clockLoop: false,
    interpolation: false,
    showGroundHeight: true,
    clampToGround: false
  }

  roamLine = new mars3d.graphic.RoamLine(flydata)
  graphicLayer.addGraphic(roamLine)

  // 启动漫游
  roamLine.start()

  testShading()

  if (map.controls.timeline) {
    map.controls.timeline.zoomTo(roamLine.startTime, roamLine.stopTime)
  }

  // 显示基本信息，名称、总长、总时间
  roamLineData.td_alltimes = mars3d.Util.formatTime(roamLine.alltimes)
  roamLineData.td_alllength = mars3d.MeasureUtil.formatDistance(roamLine.alllen)

  roamLine.on(mars3d.EventType.change, (event) => {
    // 面板显示相关信息
    showRealTimeInfo(event, roamLine.alltimes)
    // 漫游组件
    eventTarget.fire("roamLineChange", roamLineData)
  })

  eventTarget.fire("loadRoamLine")
}

export function updateModel(isAuto, val) {
  const pitch = val.slidePitchStep
  const roll = val.slideRollStep

  roamLine.updateAngle(isAuto, {
    pitch: pitch,
    roll: roll
  })
}

export function clearGraphic() {
  groundLayer.clear()
}

// 显示实时坐标和时间
function showRealTimeInfo(params, _alltime) {
  if (params == null) {
    return
  }

  let val = Math.ceil((params.time * 100) / _alltime)
  if (val < 1) {
    val = 1
  }
  if (val > 100) {
    val = 100
  }

  roamLineData.percent = val

  roamLineData.td_jd = params.lng
  roamLineData.td_wd = params.lat
  roamLineData.td_gd = mars3d.MeasureUtil.formatDistance(params.alt)

  roamLineData.td_times = mars3d.Util.formatTime(params.time)
  roamLineData.td_length = mars3d.MeasureUtil.formatDistance(params.len)

  if (params.hbgd) {
    roamLineData.td_dmhb = mars3d.MeasureUtil.formatDistance(params.hbgd)
  } else {
    roamLineData.td_dmhb = "未知"
  }

  if (params.ldgd) {
    roamLineData.td_ldgd = mars3d.MeasureUtil.formatDistance(params.ldgd)
  } else {
    roamLineData.td_ldgd = "未知"
  }
}

let groundLayer // 地面投影图层

function testShading() {
  // 卫星朝向的中线地面点
  const line1 = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const pt1 = roamLine.position
      const pt2 = centerPosion
      if (!pt1 || !pt2) {
        return []
      }

      return [pt1, pt2]
    }, false),
    style: {
      width: 2,
      color: "#ff0000",
      arcType: Cesium.ArcType.NONE
    }
  })
  map.graphicLayer.addGraphic(line1)

  // 卫星边线2点
  const graphicTriangle = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const positions = getFourShadingPosition({
        angle: 2.4,
        angle2: 1.4
      })
      return positions
    }, false),
    style: {
      width: 2,
      color: "#0000ff",
      clampToGround: true
    }
  })
  map.graphicLayer.addGraphic(graphicTriangle)

  // 创建矢量数据图层
  groundLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(groundLayer)

  setInterval(function () {
    if (!map.clock.shouldAnimate || !thisPositions) {
      return
    }
    addPolygon()
  }, 1500)
}

// 获取地面的四棱台投影面
let thisPositions
let centerPosion

function getFourShadingPosition(opts) {
  // 位置
  const pt1 = roamLine.position
  if (!pt1) {
    return
  }

  const ellipsoid = map.scene.globe.ellipsoid

  // 张角
  const angle1 = Cesium.Math.toRadians(opts.angle) / 2

  const heading = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, roamLine.heading))
  const pitch = Cesium.Math.toRadians(Cesium.defaultValue(opts.pitch, roamLine.pitch))
  const roll = Cesium.Math.toRadians(Cesium.defaultValue(opts.heading, roamLine.roll))

  // 张角
  const angle2 = Cesium.Math.toRadians(opts.angle2) / 2

  const ptLeft1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft1) {
    return
  }

  const ptRight1 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch + angle2, roll - angle1), true, ellipsoid)
  if (!ptRight1) {
    return
  }

  const ptRight2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll - angle1), true, ellipsoid)
  if (!ptRight2) {
    return
  }

  const ptLeft2 = mars3d.PointUtil.getRayEarthPosition(pt1, new Cesium.HeadingPitchRoll(heading, pitch - angle2, roll + angle1), true, ellipsoid)
  if (!ptLeft2) {
    return
  }

  const ptLeft = Cesium.Cartesian3.midpoint(ptLeft1, ptLeft2, new Cesium.Cartesian3())
  const ptRight = Cesium.Cartesian3.midpoint(ptRight1, ptRight2, new Cesium.Cartesian3())
  thisPositions = [ptLeft, ptRight]

  centerPosion = Cesium.Cartesian3.midpoint(ptLeft, ptRight, new Cesium.Cartesian3())

  return [ptLeft1, ptRight1, ptRight2, ptLeft2, ptLeft1]
}

let lastPositions

function addPolygon() {
  if (lastPositions == null) {
    lastPositions = thisPositions
    return
  }
  const positions = [lastPositions[0], lastPositions[1], thisPositions[1], thisPositions[0]]
  lastPositions = thisPositions

  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: positions,
    style: {
      color: "#ff0000",
      opacity: 0.3
    }
  })
  groundLayer.addGraphic(primitive)

  if (groundLayer.length > 2000) {
    groundLayer.clear()
  }
}
