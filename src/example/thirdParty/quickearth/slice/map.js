import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.533638, lng: 116.580224, alt: 194274.9, heading: 31.1, pitch: -31.4 }
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

let collection
async function initDemoData() {
  const { consts, getBinary, resourceService, BinaryGridDataProvider, MemoryGridDataProvider } = window.QE // quickearth.core.js
  const { CPixelLayer } = window.QEC // quickearth.cesium.js

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  // consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  globalMsg("数据加载中...")

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/hefei.zip")
  const provider = new BinaryGridDataProvider(buffers[0])

  const style = {
    fillColor: "color-cr#res",
    zScale: 10,
    fillMode: 1,
    optimizedInterp: false
  }

  collection = new Cesium.PrimitiveCollection()
  for (let i = 0; i < provider.gridOptions.zValues.length; i++) {
    const gridOptions = {
      ...provider.gridOptions,
      zValues: [provider.gridOptions.zValues[i]]
    }
    const grid = provider.getGrid(0, i)
    const currentProvider = new MemoryGridDataProvider([[grid]], { gridOptions })

    // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
    // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
    const layer = new CPixelLayer({ cull: false })
      .setDrawOptions({
        ...style
      })
      .setDataSource(currentProvider)
    collection.add(layer)
  }
  map.scene.primitives.add(collection)

  globalMsg("数据加载完成")
  hideLoading()
}

export function changeScale(scale) {
  for (let index = 0; index < collection?.length; index++) {
    const item = collection.get(index)
    item.setDrawOptions({
      zScale: scale
    })
  }
}
