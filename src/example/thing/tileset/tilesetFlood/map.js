import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中
export const mapOptions = {
  scene: {
    center: { lat: 31.797067, lng: 117.21963, alt: 1512, heading: 360, pitch: -36 }
  }
}

export let tilesetLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify("已知问题提示", `(1) 目前不支持所有类型3dtile数据，请替换url进行自测 `)

  showDytDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// true:  精确模式, 直接存储范围,但传入的范围顶点数量多时，就会造成一定程度的卡顿；
// false: 掩膜模式，栅格化范围,效率与范围顶点数量无关,但放大后锯齿化严重
const precise = false

export function showDytDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1,
    flood: {
      precise,
      editHeight: -24, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 模型淹没处理类
  const tilesetFlood = tilesetLayer.flood
  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

export function showTehDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maxMemory: 2048, // 最大缓存内存大小(MB)
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,

    editHeight: -140.0, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    flood: {
      precise,
      enabled: true
    },

    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 会执行多次，重新加载一次完成后都会回调
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  //   console.log("触发allTilesLoaded事件", event)
  // })

  // 模型淹没处理类
  const tilesetFlood = tilesetLayer.flood

  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

export function showXianDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },

    editHeight: -18.0, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    flood: {
      precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 模型淹没处理类
  const tilesetFlood = tilesetLayer.flood
  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// 高度选择
export function onChangeHeight(height) {
  tilesetLayer.flood.height = height
}

// 修改分析方式
export function changeFloodType(val) {
  if (val === "1") {
    tilesetLayer.flood.floodAll = true
  } else {
    tilesetLayer.flood.floodAll = false
  }
}

// 绘制矩形
export async function btnDrawExtent() {
  stop()
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    }
  })
  const positions = graphic.getOutlinePositions(false)

  tilesetLayer.flood.addArea(positions)
}
// 绘制多边形
export async function btnDraw() {
  stop()
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    }
  })
  const positions = graphic.positionsShow

  tilesetLayer.flood.addArea(positions)

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标
}

// 开始分析
export function begin(data) {
  if (!tilesetLayer.flood.floodAll && tilesetLayer.flood.length === 0) {
    globalMsg("请首先绘制分析区域！")
    return false
  }
  map.graphicLayer.clear()

  const minValue = Number(data.minHeight)
  const maxValue = Number(data.maxHeight)
  const speed = Number(data.speed)
  if (minValue <= 27) {
    globalMsg("最低海拔过低，请耐心等候几秒")
  }
  if (minValue > maxValue) {
    globalMsg("当前最低海拔高于最高海拔")
    return false
  }

  console.log("当前参数", { minHeight: minValue, maxHeight: maxValue })

  tilesetLayer.flood.setOptions({
    minHeight: minValue,
    maxHeight: maxValue,
    speed
  })

  tilesetLayer.flood.start()
  return true
}

export function stop() {
  tilesetLayer.flood.clear()
}
