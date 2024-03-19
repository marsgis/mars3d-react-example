import * as mars3d from "mars3d"

export let map

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 50.096737, lng: 8.670794, alt: 1148.6, heading: 28.9, pitch: -44.9 }
  },
  terrain: false
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
  // map.basemap = "ArcGIS影像"

  globalNotify(
    "已知问题提示",
    `如图层未显示或服务URL访问超时，是因为目前国家测绘主管部门对未经审核批准的国外地图服务做了屏蔽封锁。
     您可以需翻墙使用 或 参考示例代码替换本地服务地址使用。`
  )

  showNewYorkDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  removeLayer()
  map = null
}
let i3sLayer

function removeLayer() {
  if (i3sLayer) {
    map.removeLayer(i3sLayer, true)
    i3sLayer = null
  }
}

// 示例：
export function showNewYorkDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "New York",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/NYC_Attributed_v17/SceneServer",
    geoidTiledTerrainProvider: {
      url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer"
    },
    traceFetches: false, // for tracing I3S fetches
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    center: { lat: 40.710975, lng: -74.023923, alt: 768.9, heading: 93.3, pitch: -23.3 },
    popup: "all",
    flyTo: true
  })
  map.addLayer(i3sLayer)

  i3sLayer.on(mars3d.EventType.load, function (event) {
    console.log("I3S图层加载完成", event)
  })

  // 单击事件
  i3sLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了I3S图层", event)
  })
}

export function showSanFranciscoDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "旧金山",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
    // geoidTiledTerrainProvider: {
    //   url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer"
    // },
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    flyTo: true
  })
  map.addLayer(i3sLayer)
}

export function showFrankfurtDemo() {
  removeLayer()

  i3sLayer = new mars3d.layer.I3SLayer({
    name: "法兰克福",
    url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Frankfurt2017_vi3s_18/SceneServer/layers/0",
    skipLevelOfDetail: false,
    debugShowBoundingVolume: false,
    flyTo: true
  })
  map.addLayer(i3sLayer)
}
