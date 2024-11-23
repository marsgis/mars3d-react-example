import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.874029, lng: 119.185316, alt: 197.9, heading: 6.1, pitch: -34.2 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { bottom: "380px", left: "5px" }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到组件中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/uav-route.json" })
    .then(function (arr) {
      const arrNew = []
      for (let i = 0; i < arr.length; i++) {
        const point = arr[i]
        arrNew.push({
          lng: point.lng,
          lat: point.lat,
          alt: point.height,
          heading: point.aircraftYaw || 0,
          pitch: point.gimbalPitch || 0
        })
      }
      addGraphicLayer(arrNew)
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

export let fixedRoute

function addGraphicLayer(arr) {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arr.length; i++) {
    const graphic = new mars3d.graphic.LabelPrimitive({
      position: arr[i],
      style: {
        text: i,
        font_size: 14
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "飞机航线",
    speed: 50,
    positions: arr,
    model: {
      url: "//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
      scale: 1,
      minimumPixelSize: 100,
      pitch: 0 // 固定角度
    },
    path: {
      color: "rgba(255,255,0,0.5)",
      width: 1,
      leadTime: 0
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 绑定popup
  bindPopup(fixedRoute)

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, mars3d.Util.funThrottle((event) => {
    // 取实时信息，可以通过  fixedRoute.info
    eventTarget.fire("roamLineChange", event)
  }, 500))

  fixedRoute.start()

  // 修改控件对应的时间
  if (map.control.timeline) {
    map.control.timeline.zoomTo(fixedRoute.startTime, fixedRoute.stopTime)
  }

  const video2D = new mars3d.graphic.Video2D({
    position: new Cesium.CallbackProperty((time) => {
      return fixedRoute.position
    }, false),
    style: {
      url: "//data.mars3d.cn/file/video/lukou.mp4",
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
