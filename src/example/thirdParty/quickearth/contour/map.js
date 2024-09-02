import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
const { consts, getBinary, resourceService, BinaryGridDataProvider, getCR, mcb } = window.QE // quickearth.core.js
const { CPixelLayer, mcbLayerCreator } = window.QEC // quickearth.cesium.js

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.131549, lng: 116.779484, alt: 30738.7, heading: 49.3, pitch: -21.5 }
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

let provider
async function initDemoData() {
  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/hefei.zip")
  provider = new BinaryGridDataProvider(buffers[0])
  const crProvider = getCR(provider, 0, true, false).upper

  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  const layer = new CPixelLayer().setDrawOptions({ fillColor: "color-cr#res" }).setDataSource(crProvider)
  map.scene.primitives.add(layer)

  await mcb({
    dataSource: provider,
    analysisValues: [40, 50],
    layerCreator: (dataSource) => {
      return mcbLayerCreator(
        {
          color: "color-cr#res",
          zScale: 2
        },
        dataSource
      )
    },
    completeOne: (layer) => {
      map.scene.primitives.add(layer)
    }
  })
}

export async function drawRectangle(value) {
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      width: 10
    }
  })

  const extent = graphic.getRectangle({ isFormat: true })
  map.graphicLayer.removeGraphic(graphic)

  await mcb({
    dataSource: provider,
    analysisValues: [value],
    layerCreator: (dataSource) => {
      return mcbLayerCreator(
        {
          color: "color-cr#res",
          zScale: 2,
          opaque: false
        },
        dataSource
      )
    },
    completeOne: (layer) => {
      map.scene.primitives.add(layer)
    },
    visibleExtent: {
      minLon: extent.xmin,
      maxLon: extent.xmax,
      minLat: extent.ymin,
      maxLat: extent.ymax
    }
  })
}
