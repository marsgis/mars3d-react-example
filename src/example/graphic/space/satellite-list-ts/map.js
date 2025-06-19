import * as mars3d from "mars3d"

export let map

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并)
export const mapOptions = {
  scene: {
    center: { lat: 32.802044, lng: 106.866718, alt: 26602327.3, heading: 356.8, pitch: -89.9 },
    shadows: true,
    showSun: false,
    showMoon: false,
    orderIndependentTranslucency: false,
    contextOptions: {
      webgl: {
        alpha: true
      }
    },
    globe: {
      baseColor: "#0E427B",
      showGroundAtmosphere: false
    }
  },
  terrain: {
    show: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  addOcCenterPoints() // 运控中心
  addReceiverPoints() // 信关站
  addLocationPoints() // 终端(在线+离线)
  addSatellite() // 卫星轨道

  // 绑定事件
  eventTarget.fire("loadGraphicLayer", {})
}

export let controlCenterLayer
export let signalStationLayer
export let onlineEndLayer
export let offlineEndLayer
export let satelliteGraphicLayer

const receiverPoints = [
  { lng: 130.403, lat: 46.772, alt: 0, info: { title: "Z信关站" } },
  { lng: 116.007, lat: 39.073, alt: 0, info: { title: "H信关站" } },
  { lng: 108.898, lat: 34.932, alt: 0, info: { title: "O信关站" } },
  { lng: 86.232, lat: 41.552, alt: 0, info: { title: "U信关站" } },
  { lng: 109.796, lat: 19.599, alt: 0, info: { title: "F信关站", label: "left" } },
  { lng: 75.98976, lat: 39.47042, alt: 0, info: { title: "X信关站" } }
]

// 运控中心
function addOcCenterPoints() {
  controlCenterLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(controlCenterLayer)

  const points = [
    {
      lng: 116.10981,
      lat: 39.020859,
      alt: 0,
      info: { title: "运控中心" }
    },
    {
      lng: 106.79559,
      lat: 29.68831,
      alt: 0,
      info: { title: "运控中心" }
    }
  ]

  for (const point of points) {
    point.info.location = `${point.lng.toFixed(3)}°E ${point.lat.toFixed(3)}°N`
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position: new mars3d.LngLatPoint(point.lng, point.lat, point.alt),
      attr: point.info,
      style: {
        image: "https://data.mars3d.cn/img/marker/oc-center.png",
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        label: {
          text: point.info.title,
          color: "#fff",
          font_size: 18,
          font_weight: 700,
          pixelOffsetX: 0,
          pixelOffsetY: 20
        }
      }
    })

    controlCenterLayer.addGraphic(graphic)
  }
}
// 信关站
function addReceiverPoints() {
  signalStationLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(signalStationLayer)

  for (const point of receiverPoints) {
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position: new mars3d.LngLatPoint(point.lng, point.lat, point.alt),
      attr: point.info,
      style: {
        image: "https://data.mars3d.cn/img/marker/receiver.png",
        scale: 0.8,
        label: {
          text: point.info.title,
          color: "#eee",
          font_size: 16,
          font_weight: 600,
          pixelOffsetX: point.info.label === "left" ? -30 : 30,
          pixelOffsetY: 15
        }
      }
    })

    signalStationLayer.addGraphic(graphic)
  }
}
// 终端
function addLocationPoints() {
  // 在线终端
  onlineEndLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(onlineEndLayer)

  // 离线终端
  offlineEndLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(offlineEndLayer)

  const points = [
    {
      lng: 28.2355,
      lat: -25.7566,
      alt: 0,
      info: {
        title: "高轨宽带",
        id: "NF0001",
        status: "在线",
        attrs: [
          { label: "ID", value: "NF0001" },
          { label: "状态", value: "在线" }
        ]
      }
    },
    {
      lng: 29.2999,
      lat: -27.7988,
      alt: 0,
      info: {
        title: "高轨宽带",
        id: "NF0002",
        status: "在线",
        attrs: [
          { label: "ID", value: "NF0002" },
          { label: "状态", value: "在线" }
        ]
      }
    },
    {
      lng: 120.383294,
      lat: 36.106825,
      alt: 0,
      info: {
        title: "高轨终端",
        id: "ZD9005",
        status: "在线",
        attrs: [
          { label: "ID", value: "ZD9005" },
          { label: "状态", value: "在线" }
        ]
      }
    },
    // 石家庄 2
    {
      lng: 114.479587,
      lat: 38.062396,
      alt: 0,
      info: {
        title: "高轨终端",
        id: "ZD9003",
        status: "在线",
        attrs: [
          { label: "ID", value: "ZD9003" },
          { label: "状态", value: "在线" }
        ]
      }
    },
    {
      lng: 114.516665,
      lat: 38.060774,
      alt: 0,
      info: {
        title: "高轨终端",
        id: "ZD9004",
        status: "在线",
        attrs: [
          { label: "ID", value: "ZD9004" },
          { label: "状态", value: "在线" }
        ]
      }
    }
  ]
  for (const point of points) {
    point.info.attrs.push({
      label: "位置",
      value: `${point.lng.toFixed(3)}°E ${point.lat.toFixed(3)}°N`
    })
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position: new mars3d.LngLatPoint(point.lng, point.lat, point.alt),
      attr: point.info,
      style: {
        image:
          point.info.status === "离线" ? "https://data.mars3d.cn/img/marker/point-red.png" : "https://data.mars3d.cn/img/marker/point-yellow.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scale: 0.5,
        opacity: 0.7
      }
    })
    if (point.info.status === "离线") {
      offlineEndLayer.addGraphic(graphic)
    } else if (point.info.status === "在线") {
      onlineEndLayer.addGraphic(graphic)
    }
    const graphicCircle = new mars3d.graphic.CircleEntity({
      position: new mars3d.LngLatPoint(point.lng, point.lat, point.alt),
      allowDrillPick: true,
      style: {
        radius: 40000,
        materialType: mars3d.MaterialType.CircleWave,
        materialOptions: {
          color: point.info.status === "离线" ? "red" : "yellow",
          count: 1,
          speed: 12
        }
      }
    })
    if (point.info.status === "离线") {
      offlineEndLayer.addGraphic(graphicCircle)
    } else if (point.info.status === "在线") {
      onlineEndLayer.addGraphic(graphicCircle)
    }
  }
}

const satelliteList = []
// 卫星
function addSatellite() {
  // 卫星轨道
  satelliteGraphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(satelliteGraphicLayer)

  const satellites = [
    {
      name: "近极轨01",
      tle1: "1 57288U 23095A   24289.04166667  .00000096  00000+0  10000-8 0 00002",
      tle2: "2 57288  86.5082 215.8573 0019497  88.2671 185.8695 13.39487089 62084",
      cone: { length: 2500000 },
      type: "近极轨"
    },
    {
      name: "近极轨02",
      tle1: "1 57289U 23095B   24289.04166667  .00000000  00000-0  10000-8 0 00003",
      tle2: "2 57289  86.5083 215.8582 0018070  86.8146 222.6899 13.39487977 62085",
      cone: { length: 2500000 },
      type: "近极轨"
    },
    {
      name: "近极轨03",
      tle1: "1 57291U 23002A   24289.04166667  .00000000  00000-0  10000-8 0 00004",
      tle2: "2 57291  86.5130 183.6530 0001822  64.3473 233.9341 13.39485594 43031",
      cone: { length: 2500000 },
      type: "近极轨"
    },
    {
      name: "倾斜轨01",
      tle1: "1 57387U 23003D   24289.04166667  .00000000  00000-0  10000-8 0 00001",
      tle2: "2 57387  49.9999  58.9888 0000939  84.9154 141.7220 13.41398211 39371",
      cone: { length: 2500000 },
      type: "倾斜轨"
    },
    {
      name: "倾斜轨02",
      tle1: "1 57388U 23003E   24289.04166667  .00000000  00000-0  10000-8 0 00002",
      tle2: "2 57388  49.9981  59.5607 0001006  58.7666 183.0141 13.41400232 39369",
      cone: { length: 2500000 },
      type: "倾斜轨"
    },
    {
      name: "倾斜轨03",
      tle1: "1 57389U 23003F   24289.04166667  .00000000  00000-0  10000-8 0 00003",
      tle2: "2 57389  49.9967  59.5019 0001129  73.9781 182.8750 13.41397455 39369",
      cone: { length: 2500000 },
      type: "倾斜轨"
    },
    {
      name: "倾斜轨04",
      tle1: "1 57390U 23003A   24289.04166667  .00000000  00000-0  10000-8 0 00005",
      tle2: "2 57390  49.9606  44.0344 0011683 212.0913   8.4085 13.41408656 43860",
      cone: { length: 2500000 },
      type: "倾斜轨"
    },
    {
      name: "倾斜轨05",
      tle1: "1 57391U 23003B   24289.04166667  .00000000  00000-0  10000-8 0 00006",
      tle2: "2 57391  49.9605  44.0082 0011554 200.7124  34.4359 13.41408344 43861",
      cone: { length: 2500000 },
      type: "倾斜轨"
    },
    {
      name: "倾斜轨06",
      tle1: "1 57392U 23003C   24289.04166667  .00000000  00000-0  10000-8 0 00007",
      tle2: "2 57392  49.9606  43.9866 0013572 209.2281  40.2228 13.41430508 43868",
      cone: { length: 2500000 },
      type: "倾斜轨"
    }
  ]

  // 清除图层
  satelliteGraphicLayer.clear()

  for (const satellite of satellites) {
    addSatelliteItem(satellite)
  }
}
function addSatelliteItem(satellite) {
  let weixingPosition = null
  const weixing = new mars3d.graphic.Satellite({
    name: satellite.name,
    tle1: satellite.tle1,
    tle2: satellite.tle2,
    model: {
      url: "https://data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 0.7,
      minimumPixelSize: 90,
      color: "#388CF8",
      fill: true,
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      colorBlendAmount: 0.8
    },
    label: {
      text: satellite.name,
      font_size: 40,
      font_weight: "bold",
      pixelOffsetX: 0,
      pixelOffsetY: -30,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    path: getPathColor(satellite.type),
    attr: {
      type: satellite.type
    }
  })

  satelliteGraphicLayer.addGraphic(weixing)
  satelliteList.push(weixing)

  let weixingPoint = mars3d.LngLatPoint.fromCartesian(weixing.position)

  const cylinderGraphic = new mars3d.graphic.CylinderEntity({
    position: new Cesium.CallbackProperty(() => {
      return Cesium.Cartesian3.fromDegrees(weixingPoint.lng, weixingPoint.lat, weixingPoint.alt / 2)
    }, false),
    allowDrillPick: true,
    style: {
      length: 0,
      topRadius: 0,
      bottomRadius: satellite.cone.length,
      color: Cesium.Color.WHITE.withAlpha(0.3),
      outline: true,
      outlineColor: "#518afa",
      outlineOpacity: 0.8,
      numberOfVerticalLines: 0,
      heading: 0,
      pitch: 0,
      roll: 0
    },
    attr: {
      type: satellite.type
    }
  })

  satelliteGraphicLayer.addGraphic(cylinderGraphic)
  satelliteList.push(cylinderGraphic)

  weixing.on(mars3d.EventType.change, (event) => {
    const graphic = event.graphic
    weixingPosition = graphic.position
    weixingPoint = mars3d.LngLatPoint.fromCartesian(weixingPosition)
    const constantProperty = new Cesium.ConstantProperty(weixingPoint.alt) // Example property with a constant value of 42
    cylinderGraphic.entityGraphic.length = constantProperty
    cylinderGraphic.entity.orientation = graphic.orientation
  })

  for (const receiver of receiverPoints) {
    const sendLine = new mars3d.graphic.PolylineEntity({
      positions: new Cesium.CallbackProperty(() => {
        const receiverPosition = Cesium.Cartesian3.fromDegrees(receiver.lng, receiver.lat, receiver.alt)
        // 卫星当前的经纬度
        if (weixingPosition) {
          const weixingPositionP = mars3d.LngLatPoint.fromCartesian(weixingPosition)
          // 卫星圆锥覆盖的近似最远距离
          const maxDistance = calculateHypotenuse(weixingPositionP.alt, satellite.cone.length)
          // 卫星和接收器的距离
          const distance = Cesium.Cartesian3.distance(weixingPosition, receiverPosition)
          if (maxDistance && distance && maxDistance > distance) {
            return [weixingPosition, receiverPosition]
          }
        }
        return []
      }, false),
      style: {
        width: 5,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "#00ffff",
          speed: 10,
          percent: 0.15,
          alpha: 0.2
        }
      },
      attr: {
        type: satellite.type
      }
    })
    satelliteGraphicLayer.addGraphic(sendLine)
    satelliteList.push(sendLine)
  }
}

// 根据两个直角边求斜边
function calculateHypotenuse(a, b) {
  if (typeof a !== "number" || typeof b !== "number" || a <= 0 || b <= 0) {
    throw new Error("Both sides should be positive numbers.")
  }
  const hypotenuseSquared = a ** 2 + b ** 2
  const hypotenuse = Math.sqrt(hypotenuseSquared)
  return hypotenuse
}

// 判断轨迹颜色
function getPathColor(type) {
  const colorMap = {
    近极轨: {
      width: 2,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#FFFFFF"
      },
      closure: true
    },
    倾斜轨: {
      width: 2,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#80B0FE"
      },
      closure: true
    }
  }
  return colorMap[type]
}

export function switchSatellites(show, type) {
  satelliteList.forEach((graphic) => {
    if (graphic.attr.type === type) {
      graphic.show = show
    }
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
