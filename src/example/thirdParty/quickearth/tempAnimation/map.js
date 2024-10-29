import * as mars3d from "mars3d"

const { consts, DataAnimationService, getBinary, GridDataGLFillMode, QEGridDataProvider, resourceService } = window.QE // quickearth.core.js
const { CPixelLayer } = window.QEC // quickearth.cesium.js

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90 }
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

async function initDemoData() {
  globalMsg("数据加载中...")
  showLoading()

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  // consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  await createTempAnimation()

  globalMsg("数据加载完成")
  hideLoading()
}

async function createTempAnimation() {
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/year.ano.zip")
  const provider = new QEGridDataProvider(buffers[0])
  const layer = new CPixelLayer({
    interpFromPreSource: true
  })
    .setDrawOptions({
      fillColor: "color-temp-ano#res",
      fillMode: GridDataGLFillMode.pixel1,
      fillModeForLine: GridDataGLFillMode.shaded2,
      lineColor: "white",
      showLine: true
    })
    .setDataSource(provider)
  map.scene.primitives.add(layer)

  const aniService = new DataAnimationService(provider, {
    layer: layer,
    all: provider.allGrids().length
  })
  aniService.start()
}
