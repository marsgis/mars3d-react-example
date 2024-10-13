import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let shadows

export const mapOptions = {
  scene: {
    center: { lat: 33.596051, lng: 119.031383, alt: 359, heading: 180, pitch: -43 },
    fxaa: true,
    globe: {
      baseColor: "#000"
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

  globalNotify("已知问题提示", `模型上日照阴影可能存在锯齿。`)

  // let imageryLayer = map.scene.imageryLayers.get(0)
  // imageryLayer.dayAlpha = 0.1  //白天图层透明值
  // imageryLayer.nightAlpha = 1.0 //夜晚图层透明值

  // 加个模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    shadows: Cesium.ShadowMode.ENABLED
  })
  map.addLayer(tilesetLayer)

  addTestGrraphic()

  shadows = new mars3d.thing.Shadows({
    darkness: 0.4, // 阴影透明度, 0-1，值越大越透明
    multiplier: 1600
    // terrain: false,
    // lighting: false
  })
  map.addThing(shadows)

  shadows.on(mars3d.EventType.change, function () {
    const shadowTime = shadows.time
    eventTarget.fire("changeShadows", { shadowTime })
  })
}

function addTestGrraphic() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const graphic = new mars3d.graphic.CircleEntity({
    position: [119.033025, 33.588439, 14.8],
    style: {
      radius: 5,
      diffHeight: 30,
      color: "#00ff00",
      hasShadows: true
    }
  })
  graphicLayer.addGraphic(graphic)

  const graphic2 = new mars3d.graphic.ModelEntity({
    position: [119.030328, 33.58953, 15.6],
    style: {
      url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
      scale: 20,
      hasShadows: true
    }
  })
  graphicLayer.addGraphic(graphic2)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function stopPlay() {
  if (shadows && shadows.isStart) {
    shadows.pause()
  }
}

/**
 * 开始播放
 *
 * @export
 * @param {*} date 年月日
 * @param {number} hours 小时
 * @param {number} minutes 分钟
 */
export function startPlay(date, hours, minutes) {
  const currentTime = setShadows(date, hours, minutes)
  const startDate = new Date(date + " 07:00:00")
  const endDate = new Date(date + " 18:00:00")

  shadows.multiplier = 1600
  shadows.start(startDate, endDate, currentTime)
}

/**
 * 修改shadows 当前时间
 *
 * @export
 * @param {*} date 年月日
 * @param {number} hours 小时
 * @param {number} minutes 分钟
 */
export function setShadows(date, hours, minutes) {
  const dateTime = new Date(`${date} ${hours}:${minutes}:00`)
  shadows.time = dateTime

  return dateTime
}

export function clearArea() {
  map.graphicLayer.clear()
  shadows.clear()
}

export async function drawArea(date) {
  globalNotify("已知问题提示", `(1) 不同视角下ShadowMap精度存在差异，分析结果会存在误差，尽量俯视整个区域进行分析。`)

  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  // 求最大、最小高度值
  shadows.multiplier = 14400
  const result = await shadows.startRate({
    startDate: new Date(date + " 07:30:00"),
    endDate: new Date(date + " 18:00:00"),
    positions,
    step: 3,
    minHeight: 20
    // maxHeight: 30 //可以多层
  })
  showRateResult(result)
}

const colorRamp = new mars3d.ColorRamp({
  steps: [5, 15, 25, 35, 50, 80],
  colors: ["rgb(0, 228, 0)", "rgb(256, 256, 0)", "rgb(256, 126, 0)", "rgb(256, 0, 0)", "rgb(153, 0, 76)", "rgb(126, 0, 35)"]
})

function showRateResult(result) {
  console.log("分析结果", result)

  map.graphicLayer.clear()

  result.positions.forEach((p, i) => {
    const rate = p.rate * 100 // 阴影率，取值范围是0到1，0代表一直有光照，1代表一直无光照
    const graphic = new mars3d.graphic.PointEntity({
      position: p,
      style: {
        pixelSize: 10,
        color: colorRamp.getColor(rate) // 计算颜色，色带颜色
      },
      popup: `阴影率: ${rate.toFixed(2)}%`
    })
    map.graphicLayer.addGraphic(graphic)
  })
}
