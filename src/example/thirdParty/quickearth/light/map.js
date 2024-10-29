import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 4.100163, lng: 118.461259, alt: 2436721.2, heading: 356, pitch: -52.5 }
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

  initDemoData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let layer
async function initDemoData() {
  globalMsg("数据加载中...")
  showLoading()

  const { consts, ensureGridDataOptions, resourceService, GrayImageGridDataProvider, GridDataType, GridDataGLFillMode } = window.QE // quickearth.core.js
  const { CPixelLayer } = window.QEC // quickearth.cesium.js

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const gridOptions = {
    xStart: 0,
    // xDelta: 0.25,
    xDelta: 0.5,
    // xSize: 1440,
    xSize: 720,
    yStart: 90,
    // yDelta: -0.25,
    yDelta: -0.5,
    // ySize: 721
    ySize: 361
  }
  ensureGridDataOptions(gridOptions)
  const provider = await GrayImageGridDataProvider.fromURL(
    "http://data.mars3d.cn/file/qe/data/GFS0P50_20220411020000_precp_single_33300.mqe",
    false,
    {
      gridOptions,
      scale: 0.1,
      offset: 0,
      dataType: GridDataType.UInt16,
      algo: 1,
      autoLoadToMemory: true
    }
  )

  const style = {
    fillColor: "color-precp#res",
    fillMode: GridDataGLFillMode.pixel1,
    extrudeScale: 5000,
    opaque: true,
    flat: false
    // specular:0.5
  }

  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  layer = new CPixelLayer({
    debugShowPerformance: true,
    name: "格点降水渐变填色"
  })
    .setDrawOptions(style)
    .setDataSource(provider)
  map.scene.primitives.add(layer)

  globalMsg("数据加载完成")
  hideLoading()
}

export function changeScale(scale) {
  layer?.setDrawOptions({
    extrudeScale: scale
  })
}
