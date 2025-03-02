import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 34.213866, lng: 108.956499, alt: 832, heading: 22, pitch: -35 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:00",
      clockRange: Cesium.ClockRange.LOOP_STOP
    }
  },
  control: {
    timeline: { format: "duration" },
    clockAnimate: { format: "duration" }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

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
  subtitles.on(mars3d.EventType.startItem, function (event) {
    const item = event.sourceTarget
    console.log(`第${event.index + 1}个任务开始执行`, item)

    eventTarget.fire("changeIndex", { index: event.index, name: item.options.name })
  })
  subtitles.on(mars3d.EventType.endItem, function (event) {
    const item = event.sourceTarget
    console.log(`第${event.index + 1}个任务完成释放`, item)
  })
  map.addControl(subtitles)

  // 打印日志
  console.log(`当前共${subtitles.count}个任务需要执行,总时长${subtitles.duration}秒`, subtitles)

  eventTarget.fire("getTableData", { list: subtitles.listRun, allDuration: subtitles.duration })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
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
