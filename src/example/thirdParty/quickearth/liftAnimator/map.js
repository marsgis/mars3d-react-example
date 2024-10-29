import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 23.238632, lng: 105.710856, alt: 510314.9, heading: 359.5, pitch: -41.4 }
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

let animator
async function initDemoData() {
  const { consts, getBinary, resourceService, MicapsDiamond131GridDataProvider, DataAnimationService, DataAnimationType } = window.QE // quickearth.core.js
  const { CPixelLayer } = window.QEC // quickearth.cesium.js

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  // consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  globalMsg("数据加载中...")
  showLoading()

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/Z_OTHE_RADAMOSAIC_20220412000000.bin.zip")
  const provider = new MicapsDiamond131GridDataProvider(buffers[0])

  const style = {
    fillColor: "color-cr#res",
    zScale: 5
  }
  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  const layer = new CPixelLayer({ interpFromPreSource: true }).setDrawOptions(style).setDataSource(provider)
  map.scene.primitives.add(layer)

  animator = new DataAnimationService(provider, {
    type: DataAnimationType.Level,
    layer,
    all: provider.gridOptions.zValues.length,
    delta: 0.2
  })
  animator.start()

  globalMsg("数据加载完成")
  hideLoading()
}

export function start() {
  animator?.start()
}
export function stop() {
  animator?.stop()
}

export function changeChangeDelta(delta) {
  animator?.setDelta(delta)
}
