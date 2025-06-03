import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.271234, lng: 106.570087, alt: 432.5, heading: 23.9, pitch: -38.5 },
    globe: {
      depthTestAgainstTerrain: true
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { bottom: "380px", left: "5px" }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到组件中

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.control.toolbar.container.style.bottom = "55px" // 修改toolbar控件的

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerContextMenu()

  loadRouteDemoData()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 取数据方法
async function loadRouteDemoData() {
  // 取数据
  const arrPnts = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/uav-route.json" })

  addRoute(arrPnts)
}

// async function loadRouteDemoData1() {
//   // 取大疆司空2原始数据
//   let result = await mars3d.Util.fetchJson({ url: "mqtt.json" })

//   result = result[0].messages
//   let lastItem
//   const arrPnts = []
//   for (let i = 0; i < result.length; i++) {
//     const payload = JSON.parse(result[i].payload)
//     const item = payload.data // 字段说明 https://developer.dji.com/doc/cloud-api-tutorial/cn/api-reference/pilot-to-cloud/mqtt/others/aircraft/properties.html
//     const newItem = {
//       sn: payload.gateway, // 唯一标识
//       time: mars3d.Util.formatDate(new Date(payload.timestamp)), // 时间
//       // 无人机本身信息
//       lng: mars3d.Util.formatNum(item.longitude, 7),
//       lat: mars3d.Util.formatNum(item.latitude, 7),
//       alt: mars3d.Util.formatNum(item.height, 2),
//       heading: mars3d.Util.formatNum(item.attitude_head || 0, 1),
//       pitch: mars3d.Util.formatNum(item.attitude_pitch || 0, 1),
//       roll: mars3d.Util.formatNum(item.attitude_roll || 0, 1),
//       // 相机信息
//       camera: {
//         pitch: mars3d.Util.formatNum(item["81-0-0"].gimbal_pitch || 0, 1),
//         roll: mars3d.Util.formatNum(item["81-0-0"].gimbal_roll || 0, 1),
//         heading: mars3d.Util.formatNum(item["81-0-0"].gimbal_yaw || 0, 1),
//         zoom: mars3d.Util.formatNum(item["81-0-0"].zoom_factor, 4) // 变焦倍数
//       }
//     }
//     if (
//       lastItem &&
//       lastItem.lng === newItem.lng &&
//       lastItem.lat === newItem.lat &&
//       lastItem.alt === newItem.alt &&
//       lastItem.heading === newItem.heading &&
//       lastItem.pitch === newItem.pitch &&
//       lastItem.roll === newItem.roll
//     ) {
//       continue
//     }
//     arrPnts.push(newItem)

//     lastItem = newItem
//   }
//   console.log("坐标信息", arrPnts)

//   // mars3d.Util.downloadFile("uav-route.json", JSON.stringify(arrPnts))

//   addRoute(arrPnts)
// }

export let fixedRoute
function addRoute(arrPnts) {
  // 渲染路线
  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "飞机航线",
    position: {
      type: "time", // 时序动态坐标
      timeField: "time",
      list: arrPnts
    },
    label: {
      text: "火星无人机",
      font_size: 30,
      scale: 0.5,
      font_family: "宋体",
      color: "#ffffff",
      background: true,
      backgroundColor: "rgba(0,0,0,0.5)",
      pixelOffsetY: -35,
      distanceDisplayCondition: true,
      distanceDisplayCondition_far: 100000,
      visibleDepth: false
    },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
      scale: 1,
      minimumPixelSize: 100,
      pitch: 0 // 固定角度
    },
    path: {
      // leadTime: 0 ,//不显示未飞行过的
      width: 4,
      color: "rgba(52, 187, 212, 0.6)"
      // materialType: mars3d.MaterialType.LineFlow,
      // materialOptions: {
      //   color: "#ffffff",
      //   image: "https://data.mars3d.cn/img/textures/arrow-small.png",
      //   repeat: new Cesium.Cartesian2(500, 1),
      //   speed: 10,
      //   bgColor: "rgba(52, 187, 212, 0.6)"
      // }
    },
    clockRange: Cesium.ClockRange.CLAMPED, // 到达终点后停止
    flyTo: true
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  fixedRoute.start()

  // 修改控件对应的时间
  if (map.control.timeline) {
    map.control.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }

  // 添加一些联动的矢量对象
  addIndexNumPoint(arrPnts)
  addGroundLine()
  // addVideo2D()
  addRectSensor(arrPnts)
}

// 绘制连接地面线
function addGroundLine() {
  const groundPoint = new mars3d.graphic.PointPrimitive({
    position: fixedRoute.position,
    style: {
      color: "#ff0000",
      pixelSize: 6
    }
  })
  graphicLayer.addGraphic(groundPoint)

  const linePositions = []
  const groundLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      return linePositions
    }, false),
    style: {
      width: 1,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.WHITE,
        dashLength: 20
      }
    }
  })
  graphicLayer.addGraphic(groundLine)

  fixedRoute.on(mars3d.EventType.change, function (event) {
    const wrjPt = fixedRoute.position
    const wrjCarto = Cesium.Cartographic.fromCartesian(wrjPt)
    const dmHeight = mars3d.PointUtil.getHeight(map?.scene, wrjCarto, { max: wrjCarto.height })
    const pt2 = Cesium.Cartesian3.fromRadians(wrjCarto.longitude, wrjCarto.latitude, dmHeight)

    // 更新竖直线坐标
    linePositions[0] = wrjPt
    linePositions[1] = pt2

    // 更新其他矢量对象
    groundPoint.position = pt2

    // const wrjHeight = wrjCarto.height - dmHeight // 相对地面高度（AGL）‌: 飞行海拔-地面海拔
    // fixedRoute.label.text = `火星无人机\nAGL:${mars3d.Util.formatNum(wrjHeight, 2)}m`

    // 绝对高度（ASL）‌: 飞行海拔
    fixedRoute.label.text = `火星无人机\nASL:${mars3d.Util.formatNum(wrjCarto.height, 2)}m`
  })
}

// 绘制 相机视锥体
function addRectSensor(arr) {
  const headingProperty = new Cesium.SampledProperty(Number)
  const pitchProperty = new Cesium.SampledProperty(Number)
  const rollProperty = new Cesium.SampledProperty(Number)

  const angleProperty = new Cesium.SampledProperty(Number)

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    const time = Cesium.JulianDate.fromDate(new Date(item.time))
    headingProperty.addSample(time, item.camera.heading)
    pitchProperty.addSample(time, item.camera.pitch)
    rollProperty.addSample(time, item.camera.roll)

    angleProperty.addSample(time, 10 + item.camera.zoom)
  }

  const rectSensor = new mars3d.graphic.RectSensor({
    id: "7CTDLA900A0005-rectSensor",
    position: fixedRoute.property,
    style: {
      angle1: angleProperty,
      angle2: angleProperty,
      length: 2000,
      rayEllipsoid: true,
      color: "rgba(0,255,255,0.3)",
      outline: true,
      topShow: true,
      topSteps: 2,
      flat: true,
      cameraHpr: true,
      heading: headingProperty,
      pitch: pitchProperty,
      roll: rollProperty
    }
  })
  graphicLayer.addGraphic(rectSensor)

  // 连接线
  const testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = rectSensor?.rayPosition
      if (!localEnd) {
        return []
      }
      return [rectSensor.position, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#ff0000"
      },
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)
}
// 增加随路线的视频效果
function addVideo2D() {
  const video2D = new mars3d.graphic.Video2D({
    position: new Cesium.CallbackProperty((time) => {
      return fixedRoute.position
    }, false),
    style: {
      url: "https://data.mars3d.cn/file/video/lukou.mp4",
      angle: 40,
      angle2: 20,
      heading: 0,
      pitch: 0,
      distance: 10,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  fixedRoute.on(mars3d.EventType.change, function (event) {
    // const hpr = mars3d.PointUtil.getHeadingPitchRollByOrientation(event.position, event.orientation)
    // video2D.style.heading = Cesium.Math.toDegrees(hpr.heading)
    // video2D.style.pitch = Cesium.Math.toDegrees(hpr.pitch)

    video2D.style.heading = fixedRoute.heading
    video2D.style.pitch = fixedRoute.pitch
  })
}

// 添加路线的数字点位标识
async function addIndexNumPoint(arr) {
  for (let i = 0; i < arr.length; i++) {
    const idx = i + 1
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position: arr[i],
      style: {
        image: await getMarkerImg(idx),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      attr: { index: idx }
    })
    graphicLayer.addGraphic(graphic)
  }
}

// 获取数字标识图标
let indexMark
async function getMarkerImg(num) {
  if (!indexMark) {
    indexMark = await Cesium.Resource.fetchImage({ url: "https://data.mars3d.cn/img/marker/bg/poi-num.png" })
  }

  const canvas = document.createElement("canvas")
  canvas.width = 19
  canvas.height = 25
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(indexMark, 0, 0) // 绘制图片

  // 绘制文字
  ctx.fillStyle = "#ffffff"
  ctx.font = "12px 楷体"
  ctx.textBaseline = "middle"
  ctx.fillText(num, num < 10 ? 6 : 3, 10)

  return canvas.toDataURL("image/png")
}

function lookAtThis(localEnd) {
  const rectSensor = graphicLayer.getGraphicById("7CTDLA900A0005-rectSensor")
  const localStart = rectSensor.positionShow

  const hpr = mars3d.PointUtil.getCameraHeadingPitchRollForLine(map.scene, localStart, localEnd)
  rectSensor.heading = Cesium.Math.toDegrees(hpr.heading)
  rectSensor.pitch = Cesium.Math.toDegrees(hpr.pitch)
  rectSensor.roll = Cesium.Math.toDegrees(hpr.roll)

  // 调用无人机相关接口，把heading等传过去
  console.log("当前方向", rectSensor.heading, rectSensor.pitch, rectSensor.roll)
}
function flyToThis(cartesian) {
  const point = mars3d.LngLatPoint.fromCartesian(cartesian)

  // 调用无人机相关接口，把point坐标等传过去
  console.log("当前位置", point)
}
// 绑定右键菜单
function bindLayerContextMenu() {
  const newItems = [
    {
      text: "看向此处",
      icon: "fa fa-eye",
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      callback: (e) => {
        lookAtThis(e.cartesian)
      }
    },
    {
      text: "飞行到此处",
      icon: "fa fa-send",
      show: function (e) {
        return Cesium.defined(e.cartesian)
      },
      callback: (e) => {
        flyToThis(e.cartesian)
      }
    }
  ]
  // map.bindContextMenu(newItems)

  // 不改变原有菜单的绑定方式
  const defaultContextmenuItems = map.getDefaultContextMenu()
  defaultContextmenuItems.splice(0, 0, ...newItems)
  map.bindContextMenu(defaultContextmenuItems)
}

function bindPopup(fixedRoute) {
  fixedRoute.bindPopup(
    `<div style="width: 200px">
      <div>总 距 离：<span id="lblAllLen"> </span></div>
      <div>总 时 间：<span id="lblAllTime"> </span></div>
      <div>开始时间：<span id="lblStartTime"> </span></div>
      <div>剩余时间：<span id="lblRemainTime"> </span></div>
      <div>剩余距离：<span id="lblRemainLen"> </span></div>
    </div>`,
    { closeOnClick: false }
  )

  // 刷新局部DOM,不影响popup面板的其他控件操作
  fixedRoute.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // popup对应的DOM

    const params = fixedRoute?.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = mars3d.Util.formatTime(params.second_all / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(fixedRoute.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = mars3d.Util.formatTime((params.second_all - params.second) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all - params.distance) || "完成"
    }
  })
}

// ui层使用
export const formatDistance = mars3d.MeasureUtil.formatDistance
export const formatTime = mars3d.Util.formatTime
