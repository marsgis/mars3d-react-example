import * as mars3d from "mars3d"

const { consts, getBinary, resourceService, MicapsDiamond131GridDataProvider, getCR, GridDataGLFillMode } = window.QE // quickearth.core.js
const { CPixelLayer, CSectionLayer, CFixedPlane } = window.QEC // quickearth.cesium.js

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

let sectionLayer
async function initDemoData() {
  globalMsg("数据加载中...")
  showLoading()

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/Z_OTHE_RADAMOSAIC_20220412000000.bin.zip")
  const provider = new MicapsDiamond131GridDataProvider(buffers[0])

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
      zScale: 2
    })
  map.scene.primitives.add(sectionLayer)

  const cr = getCR(provider, 0, true, false).upper

  const pixelStyle = {
    fillColor: "color-cr#res",
    fillMode: GridDataGLFillMode.bitmap,
    opaque: true
    // discardColor: "rgba(200,200,200,0.6)",
  }
  const pixelLayer = new CPixelLayer().setDataSource(cr).setDrawOptions(pixelStyle)
  map.scene.primitives.add(pixelLayer)

  globalMsg("数据加载完成")
  hideLoading()
}

export async function drawLine() {
  const graphic = await map.graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ff0000",
      width: 2
    },
    addHeight: 1000
    // maxPointNum: 2
  })
  sectionLayer?.setSectionPath(graphic.coordinates, CFixedPlane.lonLat, true, graphic.id)
  map.graphicLayer.removeGraphic(graphic)
}

export async function drawCircle() {
  const graphic = await map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ff0000",
      opacity: 0.6
    },
    addHeight: 1000
  })
  const coordinates = graphic.getOutlineCoordinates()

  sectionLayer?.setSectionPath(coordinates, CFixedPlane.lonLat, true, graphic.id)

  map.graphicLayer.removeGraphic(graphic)
}

export async function drawRectangle() {
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ff0000",
      opacity: 0.6
    },
    addHeight: 1000
  })
  const coordinates = graphic.getOutlineCoordinates(true)
  sectionLayer?.setSectionPath(coordinates, CFixedPlane.lonLat, true, graphic.id)

  map.graphicLayer.removeGraphic(graphic)
}

export async function removeSectionPath() {
  sectionLayer?.removeSectionPath()
}
