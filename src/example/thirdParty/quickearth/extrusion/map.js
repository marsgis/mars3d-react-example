import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.148458, lng: 104.934276, alt: 238162.1, heading: 359.5, pitch: -41.4 }
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

let pixelLayer
async function initDemoData() {
  const { consts, getBinary, resourceService, MicapsDiamond131GridDataProvider, getCR } = window.QE // quickearth.core.js
  const { CPixelLayer } = window.QEC // quickearth.cesium.js

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"

  globalMsg("数据加载中...")
  showLoading()

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/Z_OTHE_RADAMOSAIC_20220412000000.bin.zip")
  const provider = new MicapsDiamond131GridDataProvider(buffers[0])
  // 实时计算组合反射率底面（业务上建议单独输出组合反射率，减少前端计算）
  const cr = getCR(provider, 0, true, false).upper
  const pixelStyle = {
    fillColor: "color-cr#res",
    zScale: 5,
    opaque: true,
    extrudeScale: 500
  }
  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  pixelLayer = new CPixelLayer().setDataSource(cr).setDrawOptions(pixelStyle)
  map.scene.primitives.add(pixelLayer)

  globalMsg("数据加载完成")
  hideLoading()
}

export function changeScale(scale) {
  pixelLayer?.setDrawOptions({
    extrudeScale: scale
  })
}
