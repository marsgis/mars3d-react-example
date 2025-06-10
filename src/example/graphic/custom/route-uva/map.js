import { scale } from "echarts/types/src/scale/helper.js"
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

// 取数据方法只是用于当前示例模拟实时数据，真实项目直接取数据调用addRoute方法
async function loadRouteDemoData() {
  const arrPnts = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/uav-route.json" })

  // 为了播放动画，修改当前时间回退1秒，因为数据永远是当前时间之前的
  const date = new Date(arrPnts[0].time)
  date.setSeconds(date.getSeconds() - 1)
  map.clock.currentTime = Cesium.JulianDate.fromDate(date)

  let index = 0
  const startPlay = () => {
    if (index < arrPnts.length) {
      const item = arrPnts[index]
      addRoute(item)
    } else {
      clearInterval(timeTik)
    }
    index++
  }
  startPlay()

  const timeTik = setInterval(startPlay, 1000)
}

// 更新无人机路线（没有构造时自动添加对象）
function addRoute(item) {
  const graphicId = item.sn
  let route = graphicLayer.getGraphicById(graphicId)
  if (!route) {
    // 绘制无人机
    route = new mars3d.graphic.Route({
      id: graphicId,
      model: {
        url: "https://data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
        scale: 1,
        minimumPixelSize: 100,
        pitch: 0 // 固定角度
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
      path: {
        leadTime: 0, // 不显示未飞行过的
        width: 2,
        color: "rgba(255, 255, 0, 0.7)"
      },
      flyTo: true
    })
    graphicLayer.addGraphic(route)
    bindPopup(route) // 绑定popup

    // 是与route绑定的矢量对象，放在route构造时一起构造
    addGroundLine(route, graphicId)
    addRectSensor(route, graphicId)
  }

  const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, item.alt)
  route.addTimePosition(position, item.time)

  const rectSensor = graphicLayer.getGraphicById(graphicId + "-rectSensor")
  rectSensor.heading = item.camera.heading
  rectSensor.pitch = item.camera.pitch
  rectSensor.roll = item.camera.roll
  rectSensor.angle1 = 10 + item.camera.zoom
  rectSensor.angle2 = 10 + item.camera.zoom

  console.log("更新数据完成", item)
}

// 绘制连接地面线
function addGroundLine(route) {
  const groundPoint = new mars3d.graphic.PointPrimitive({
    id: route.id + "-groundPoint",
    position: route.position,
    style: {
      color: "#ff0000",
      pixelSize: 6
    }
  })
  graphicLayer.addGraphic(groundPoint)

  const linePositions = []
  const groundLine = new mars3d.graphic.PolylineEntity({
    id: route.id + "-groundLine",
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

  route.on(mars3d.EventType.change, function (event) {
    const wrjPt = route.position
    const wrjCarto = Cesium.Cartographic.fromCartesian(wrjPt)
    const dmHeight = mars3d.PointUtil.getHeight(map?.scene, wrjCarto, { max: wrjCarto.height })
    const pt2 = Cesium.Cartesian3.fromRadians(wrjCarto.longitude, wrjCarto.latitude, dmHeight)

    // 更新竖直线坐标
    linePositions[0] = wrjPt
    linePositions[1] = pt2

    // 更新其他矢量对象
    groundPoint.position = pt2

    if (route.label) {
      // const wrjHeight = wrjCarto.height - dmHeight // 相对地面高度（AGL）‌: 飞行海拔-地面海拔
      // fixedRoute.label.text = `火星无人机\nAGL:${mars3d.Util.formatNum(wrjHeight, 2)}m`

      // 绝对高度（ASL）‌: 飞行海拔
      route.label.text = `火星无人机\nASL:${mars3d.Util.formatNum(wrjCarto.height, 2)}m`
    }
  })
}

// 绘制 相机视锥体
function addRectSensor(route) {
  const rectSensor = new mars3d.graphic.RectSensor({
    id: route.id + "-rectSensor",
    position: route.property,
    style: {
      angle1: 10,
      angle2: 10,
      length: 2000,
      rayEllipsoid: true,
      color: "rgba(0,255,255,0.3)",
      outline: true,
      topShow: true,
      topSteps: 2,
      flat: true,
      cameraHpr: true,
      heading: 0,
      pitch: 0,
      roll: 0
    }
  })
  graphicLayer.addGraphic(rectSensor)

  // 连接线
  const rectLine = new mars3d.graphic.PolylineEntity({
    id: route.id + "-rectLine",
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
  graphicLayer.addGraphic(rectLine)
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
    `<div style="width: 150px;height:80px">
      <div>经度：<span id="lblLng"> </span></div>
      <div>纬度：<span id="lblLat"> </span></div>
      <div>绝对高度：<span id="lblASL"> </span></div>
      <div>相对地面高度：<span id="lblAGL"> </span></div>
    </div>`,
    { closeOnClick: false }
  )

  // 刷新局部DOM,不影响popup面板的其他控件操作
  fixedRoute.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // popup对应的DOM

    const wrjPt = fixedRoute.position
    if (!wrjPt) {
      return
    }
    const wrjCarto = Cesium.Cartographic.fromCartesian(wrjPt)

    const lblLng = container.querySelector("#lblLng")
    if (lblLng) {
      lblLng.innerHTML = mars3d.Util.formatNum(mars3d.Cesium.Math.toDegrees(wrjCarto.longitude), 6)
    }

    const lblLat = container.querySelector("#lblLat")
    if (lblLat) {
      lblLat.innerHTML = mars3d.Util.formatNum(mars3d.Cesium.Math.toDegrees(wrjCarto.latitude), 6)
    }

    const lblASL = container.querySelector("#lblASL")
    if (lblASL) {
      lblASL.innerHTML = `${mars3d.Util.formatNum(wrjCarto.height, 2)}m`
    }

    const lblAGL = container.querySelector("#lblAGL")
    if (lblAGL) {
      const dmHeight = mars3d.PointUtil.getHeight(map?.scene, wrjCarto, { max: wrjCarto.height })
      const wrjHeight = wrjCarto.height - dmHeight // 相对地面高度（AGL）‌: 飞行海拔-地面海拔
      lblAGL.innerHTML = `${mars3d.Util.formatNum(wrjHeight, 2)}m`
    }
  })
}


// 当需要无人机竖直飞行时，方向不乱变化，执行下下面方法
function bindVelocityVectorPropertyGetValueFun() {
  const timeNowScratch = new Cesium.JulianDate()
  const position1Scratch = new Cesium.Cartesian3()
  const position2Scratch = new Cesium.Cartesian3()
  Cesium.VelocityVectorProperty.prototype._getValue = function (time, velocityResult, positionResult) {
    if (!Cesium.defined(time)) {
      time = Cesium.JulianDate.now(timeNowScratch)
    }

    if (!Cesium.defined(velocityResult)) {
      velocityResult = new Cesium.Cartesian3()
    }

    const property = this._position
    if (Cesium.Property.isConstant(property)) {
      return undefined
    }

    const thisVal = property.getIndex(time, position1Scratch) // property.getValue(time, position1Scratch)
    let position1 = thisVal?.value
    if (!Cesium.defined(position1)) {
      return undefined
    }

    let position2 = property.getValueByIndex(thisVal.index + 1, position2Scratch)
    if (!Cesium.defined(position2)) {
      position2 = position1
      position1 = property.getValueByIndex(thisVal.index - 1, position2Scratch)
      if (!Cesium.defined(position1)) {
        return undefined
      }
    }

    if (Cesium.Cartesian3.equals(position1, position2)) {
      return undefined
    }

    position2 = mars3d.PointUtil.setPositionsHeight(position2, mars3d.Cesium.Cartographic.fromCartesian(position1).height)


    if (mars3d.Cesium.Cartesian3.distance(position1, position2) < 0.01) {
      return undefined
    }


    if (Cesium.defined(positionResult)) {
      position1.clone(positionResult)
    }

    const velocity = Cesium.Cartesian3.subtract(position2, position1, velocityResult)
    if (this._normalize) {
      return Cesium.Cartesian3.normalize(velocity, velocityResult)
    }

    return Cesium.Cartesian3.divideByScalar(velocity, 1, velocityResult)
  }

}
