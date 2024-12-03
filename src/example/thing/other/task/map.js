import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.093038, lng: 108.804459, alt: 23321232.7, heading: 0, pitch: -90 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:20",
      clockRange: Cesium.ClockRange.CLAMPED,
      shouldAnimate: false
    }
  },
  control: {
    timeline: { format: "duration" },
    clockAnimate: { format: "duration" }
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

  // 演示数据
  const graphicLayer = new mars3d.layer.GeoJsonLayer({
    id: "20241101",
    url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
    popup: "all"
  })
  map.addLayer(graphicLayer)
  graphicLayer.readyPromise.then(() => {
    graphicLayer.show = false
  })

  // 时序任务
  const task = new mars3d.thing.Task({
    list: [
      { type: "mapRotate", name: "地球自旋转", start: 0, duration: 8, speed: 0.01 }, // 时长秒数，当没有配置stop时，内部自动算：stop= start + duration
      {
        type: "camera",
        name: "单个视角定位",
        start: 8,
        duration: 3,
        center: { lat: 30.461755, lng: 116.280775, alt: 36600.2, heading: 0.8, pitch: -39.7 }
      },
      {
        type: "flickerEntity",
        name: "高亮矢量对象",
        start: 12,
        duration: 6,
        layerId: "20241101",
        graphicId: "M-4492C7B1-F860-4F4B-A30D-3863A83F99C5",
        color: "#ffff00"
      },
      {
        type: "camera",
        name: "单个视角定位",
        start: 18,
        duration: 3,
        center: { lat: 31.822251, lng: 117.170363, alt: 2225.3, heading: 0.7, pitch: -46 }
      },
      { type: "zoomIn", name: "放大地图", start: 22, duration: 2 },
      { type: "zoomOut", name: "缩小地图", start: 24, duration: 2 },
      {
        type: "pointRotate",
        name: "绕内旋转",
        start: 26,
        duration: 8,
        isRotateOut: false,
        point: {
          lng: 117.170949,
          lat: 31.840785,
          alt: 268.9
        },
        time: 8
      },
      {
        type: "camera",
        name: "单个视角定位",
        start: 35,
        duration: 2,
        center: { lat: 31.844062, lng: 117.171172, alt: 227.9, heading: 4, pitch: 0 }
      },
      { type: "pointRotate", name: "绕外旋转", start: 38, duration: 8, isRotateOut: true, time: 6 },
      {
        type: "routeLine",
        name: "按路线漫游",
        start: 47,
        duration: 15,
        route: {
          speed: 60,
          positions: [
            [117.220356, 31.833959, 43.67],
            [117.220361, 31.835111, 44.36],
            [117.213242, 31.835863, 42.31],
            [117.211926, 31.835738, 42.14],
            [117.183103, 31.833906, 47.17]
          ],
          pauseTime: 0.5,
          camera: {
            type: "gs",
            radius: 300
          },
          polyline: {
            color: "#ffff00",
            width: 3
          },
          model: {
            url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
            scale: 5,
            minimumPixelSize: 50,
            clampToGround: true
          }
        }
      },
      {
        type: "cameraList",
        name: "视角列表播放",
        delay: 2, // 延迟执行秒数，当没有配置start时，内部自动算：start=前一个的stop + delay
        duration: 11,
        list: [
          { lat: 31.813938, lng: 117.240085, alt: 3243, heading: 357, pitch: -52 },
          { lat: 31.821728, lng: 117.253605, alt: 1702, heading: 319, pitch: -37 },
          { lat: 31.836674, lng: 117.260762, alt: 1779, heading: 269, pitch: -37 }
        ]
      }
    ]
  })
  task.on(mars3d.EventType.startItem, function (event) {
    const item = event.sourceTarget
    console.log(`第${event.index + 1}个任务开始执行`, item)

    eventTarget.fire("changeIndex", { index: event.index, name: item.options.name })
  })
  task.on(mars3d.EventType.endItem, function (event) {
    const item = event.sourceTarget
    console.log(`第${event.index + 1}个任务完成释放`, item)
  })
  map.addThing(task)

  // 打印日志
  console.log(`当前共${task.count}个任务需要执行,总时长${task.duration}秒`, task)

  eventTarget.fire("getTableData", { list: task.listDX, allDuration: task.duration })

  autoAddTimeControl()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startPlay() {
  map.clock.currentTime = map.clock.startTime // 设置当前时间 = 开始时间
  map.clock.shouldAnimate = true
}

export function updateShouldAnimate(value) {
   map.clock.shouldAnimate = value
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
