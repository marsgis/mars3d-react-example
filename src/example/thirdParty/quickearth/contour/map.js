import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
const { consts, getBinary, resourceService, BinaryGridDataProvider, getCR, mcb, GridDataGLFillMode } = window.QE // quickearth.core.js
const { CPixelLayer, CSectionLayer, CFixedPlane, mcbLayerCreator } = window.QEC // quickearth.cesium.js

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

  globalMsg("数据加载中...")
  showLoading()

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
      layer.isQuickearth = true
      map.scene.primitives.add(layer)

      globalMsg("数据加载完成")
      hideLoading()
    }
  })

  // 下面用于剖面的
  addSectionLayer()
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
  if (provider) {
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
        layer.isQuickearth = true
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
}

export function clearDraw() {
  for (let index = map.scene.primitives.length - 1; index >= 0; index--) {
    const layer = map.scene.primitives.get(index)
    if (layer.isQuickearth) {
      map.scene.primitives.remove(layer)
    }
  }
}

// 剖面
let sectionLayer
function addSectionLayer() {
  sectionLayer = new CSectionLayer({
    fixedPlane: CFixedPlane.lonLat,
    sectionMode: "multiple"
  })
    .setDataSource(provider)
    .setDrawOptions({
      fillColor: "color-radar-section#res",
      fillMode: GridDataGLFillMode.bitmap,
      opaque: false,
      discardColor: "rgba(200,200,200,0.6)",
      zScale: 1
    })
  map.scene.primitives.add(sectionLayer)
}
export async function drawLine() {
  const graphic = await map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ff0000",
      width: 2
    },
    addHeight: 1000,
    maxPointNum: 2
  })
  sectionLayer?.setSectionPath(graphic.coordinates, CFixedPlane.lonLat, true, graphic.id)

  map.graphicLayer.removeGraphic(graphic)
}
export async function removeSectionPath() {
  sectionLayer?.removeSectionPath()
}
