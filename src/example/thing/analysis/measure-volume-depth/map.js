import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let measure
export let measureVolume

export const mapOptions = {
  scene: {
    center: { lat: 30.883785, lng: 116.230883, alt: 8121, heading: 266, pitch: -62 },
    globe: { depthTestAgainstTerrain: true }
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

  // 基于深度图的方量分析 需要注意：
  // 1. 需要地形和模型等需要分析区域对应的数据加载完成后才能分析。
  // 2. 如果有遮挡了分析区域的任何矢量对象，都需要分析前隐藏下，分析结束后再改回显示。

  addMeasure()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addMeasure() {
  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measure)

  // 直接传入坐标分析
  setTimeout(() => {
    measure
      .volume({
        positions: mars3d.PointTrans.lonlats2cartesians([
          [116.191817, 30.864845, 309.3],
          [116.192869, 30.8757, 521.81],
          [116.190478, 30.886266, 672.79],
          [116.19247, 30.893748, 448.91],
          [116.200836, 30.889954, 379.92],
          [116.204063, 30.882578, 532.5],
          [116.203027, 30.873828, 498.8],
          [116.201795, 30.865941, 443.06]
        ]),
        height: 450,
        depth: true, // 使用离屏渲染深度图的方式
        offsetHeight: 500 // 偏移高度来展示
      })
      .then((e) => {
        measureVolume = e
        showHeightVal()
      })
  }, 3000)

  // 有模型时
  // tiles3dLayer.readyPromise.then((layer) => {
  //   // 关键代码,等模型readyPromise加载后执行volume
  //   measureVolume = measure.volume({
  //     positions: mars3d.PointTrans.lonlats2cartesians([
  //       [119.033856, 33.591473, 14.5],
  //       [119.033098, 33.591836, 13.2],
  //       [119.033936, 33.592146, 16.9]
  //     ]),
  //     depth: true, // 使用离屏渲染深度图的方式
  //     height: 150
  //   })
  // })

  measure.on(mars3d.EventType.start, function (event) {
    console.log("开始分析", event)
    showLoading()
    console.log("坐标为", JSON.stringify(mars3d.LngLatArray.toArray(event.positions))) // 方便测试拷贝坐标
  })

  measure.on(mars3d.EventType.end, function (event) {
    console.log("分析完成", event)
    hideLoading()
  })
}

// 点选高度
function showHeightVal() {
  const baseHeight = measureVolume.height.toFixed(1)
  const minHeight = measureVolume.minHeight.toFixed(1)
  const maxHeight = getFixedNum(measureVolume.maxHeight)

  // 触发自定义事件 heightVal ，改变组件面板中的值
  eventTarget.fire("heightVal", { baseHeight, minHeight, maxHeight })
}

function getFixedNum(val) {
  return Math.ceil(val * 10) / 10
}

// 方量分析
export function analysisMeasure() {
  // 手动绘制的方式分析
  measure
    .volume({
      depth: true // 使用离屏渲染深度图的方式
      // minHeight: 50 , //可以设置一个固定的最低高度
    })
    .then((e) => {
      measureVolume = e
      showHeightVal()
    })
}

// 清除
export function clear() {
  measure.clear()
  measureVolume = null
}

// 修改基础高度
export function baseHeight(num) {
  measureVolume.height = num
  showHeightVal()
}

// 修改底高
export function txtMinHeight(num) {
  if (num > measureVolume.height) {
    globalMsg("墙底部高度不能高于基准面高")
    return
  }
  measureVolume.minHeight = num
}

// 修改顶高
export function txtMaxHeight(num) {
  const maxHeight = getFixedNum(measureVolume.polygonMaxHeight)
  if (num < maxHeight) {
    globalMsg("墙顶部高度不能低于区域内的地表高" + maxHeight)
    measureVolume.maxHeight = Number(maxHeight)
    return
  }
  if (num < measureVolume.height) {
    globalMsg("墙顶部高度不能低于基准面高")
    return
  }
  measureVolume.maxHeight = num
}

export function selHeight() {
  if (!measureVolume || !measure) {
    globalMsg("请先开始方量分析")
    return
  }

  // 拾取高度
  map.graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#00fff2"
    },
    success: (graphic) => {
      const height = graphic.point?.alt
      map.graphicLayer.removeGraphic(graphic)

      if (!height) {
        return
      }

      measureVolume.height = height

      showHeightVal(height)
    }
  })
}
