import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.scene.clock = {
    startTime: "2017/08/25 08:00:00",
    stopTime: "2017/08/25 08:05:30",
    clockRange: Cesium.ClockRange.LOOP_STOP
  }

  option.control = {
    timeline: { format: "duration" },
    clockAnimate: false,
    distanceLegend: { left: "100px", bottom: "27px" }
  }
  return option
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  addDemoData()

  // 时钟控制（可替代cesium本身的animation）
  const clockAnimate = new mars3d.control.ClockAnimate({
    // format: "yyyy-MM-dd HH:mm:ss"
    format: "duration", // 显示已过时长（相对于map.clock.startTime）和总时长（相对于map.clock.stopTime）
    speed: false
  })
  map.addControl(clockAnimate)

  clockAnimate.on(mars3d.EventType.click, function (event) {
    if (event.targetType === "label") {
      console.log("单击了时间文本区域", event)
      const startTime = Cesium.JulianDate.toDate(map.clock.startTime)
      const stopTime = Cesium.JulianDate.toDate(map.clock.stopTime)
      const currentTime = Cesium.JulianDate.toDate(map.clock.currentTime)

      eventTarget.fire("clickShowClockAnimate", { startTime, stopTime, currentTime })
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function setCurrentTime(currentTime) {
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date(currentTime))
}

export function setClockAnimateTime(startTimes, stopTimes) {
  const startTime = Cesium.JulianDate.fromDate(new Date(startTimes))
  const stopTime = Cesium.JulianDate.fromDate(new Date(stopTimes))

  if (map.control.timeline) {
    map.control.timeline.zoomTo(startTime, stopTime)
  }
}

function addDemoData() {
  // 字幕
  const subtitles = new mars3d.control.Subtitles({
    list: [
      { text: "我是第1句话，0-5，持续5秒钟", start: 0, duration: 5 },
      { text: "我是第2句话，8-11，持续3秒钟", start: 8, duration: 3 },
      { text: "我是第3句话，15-19，持续4秒钟", start: 15, duration: 4 },
      { text: "我是第4句话，25-35，持续10秒钟", start: 25, duration: 10 },
      { text: "我是第5句话，40-60，持续60秒钟", start: 40, stop: 60 } // 其中stop和duration二选一
    ],
    style: {
      // 可以传入任意css值
      left: "30px",
      right: "30px",
      bottom: "60px",
      fontSize: "30px",
      fontFamily: "微软雅黑"
    }
  })
  map.addControl(subtitles)


  // 矢量对象
  const graphic = new mars3d.graphic.BillboardEntity({
    position: [116.313736, 30.86082, 420],
    style: {
      image: "//data.mars3d.cn/img/marker/lace-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    availability: [{ start: 10, stop: 20 }]
  })
  map.graphicLayer.addGraphic(graphic)
  console.log(`1.测试矢量对象`, graphic)

  const graphic2 = new mars3d.graphic.DivGraphic({
    position: [116.960075, 31.19609, 237.4],
    style: {
      html: `<div class="marsGreenGradientPnl" >安徽欢迎您</div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM

      // 高亮时的样式
      // highlight: {
      //   type: mars3d.EventType.click,
      //   className: "marsGreenGradientPnl-highlight"
      // }
    },
    attr: { remark: "示例3" }
  })
  map.graphicLayer.addGraphic(graphic2)

  // 在指定时间范围显示对象 0-10，20-30,40-max
  const now = map.clock.currentTime
  graphic2.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
  console.log(`2.测试矢量对象2`, graphic2)

  // 图层
  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    name: "标绘示例数据",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    popup: "{type} {name}",
    availability: [
      { start: 0, stop: 10, isStartIncluded: true, isStopIncluded: false },
      { start: 30, duration: 10 } // 支持不配置stop，直接配置duration秒数时长
    ]
  })
  map.addLayer(graphicLayer)
  console.log(`3.测试图层`, graphicLayer)

  // 特效
  const rainEffect = new mars3d.effect.RainEffect({
    speed: 10,
    size: 20,
    direction: 10,
    availability: [
      { start: 20, stop: 30, isStartIncluded: true, isStopIncluded: false },
      { start: 40, duration: 10 } // 支持不配置stop，直接配置duration秒数时长
    ]
  })
  map.addEffect(rainEffect)
  console.log(`4.测试特效`, rainEffect)

  autoAddTimeControl()
}

function autoAddTimeControl() {
  const taskResult = map.getTimeTaskList()
  if (taskResult.duration > 0 && taskResult.list?.length > 0) {
    console.log(`当前地图所有时序相关任务清单`, taskResult)

    // 停止，手动开始
    // map.clock.shouldAnimate = false

    // 修改时间
    const startTime = map.clock.startTime
    map.clock.currentTime = map.clock.startTime // 设置当前时间 = 开始时间

    const stopTime = Cesium.JulianDate.addSeconds(startTime, taskResult.duration + 1, new Cesium.JulianDate())
    map.clock.stopTime = stopTime

    // 添加控件
    if (!map.control.timeline) {
      const clockAnimate = new mars3d.control.ClockAnimate({ format: "duration" })
      map.addControl(clockAnimate)
    }

    if (map.control.timeline) {
      map.control.timeline.zoomTo(startTime, stopTime)
    } else {
      const timeline = new mars3d.control.Timeline({ format: "duration" })
      map.addControl(timeline)
    }
  }
}
