import * as mars3d from "mars3d"

const { consts, getBinary, resourceService, MicapsDiamond131GridDataProvider, getCR, GridDataGLFillMode } = window.QE // quickearth.core.js
const { CPixelLayer, CSectionLayer, CFixedPlane } = window.QEC // quickearth.cesium.js

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 22.971408, lng: 107.530316, alt: 727504.3, heading: 349.2, pitch: -48.1 }
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
    sectionMode: "single" // "multiple"
  })
    .setDataSource(provider)
    .setDrawOptions({
      fillColor: "color-radar-section#res",
      fillMode: GridDataGLFillMode.bitmap,
      opaque: false,
      discardColor: "rgba(200,200,200,0.6)",
      zScale: 3
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

  updateSectionPath()

  setGradations(50)
}

const radius = 380000 // 半径：单位：米
let thisAngle = 180 // 当前角度 0-360

function updateSectionPath() {
  let center = sectionLayer.dataSource.center()
  center = [center.lon, center.lat]

  const point = mars3d.PointUtil.getPositionByDirectionAndLen(center, thisAngle, radius)
  sectionLayer.setSectionPath([center, mars3d.LngLatPoint.toArray(point)], CFixedPlane.lonLat, false)
}

let timeTik
let enabled = true
export function setEnabled(val) {
  enabled = val
}

export function setGradations(value) {
  clearInterval(timeTik)
  timeTik = setInterval(() => {
    if (!enabled) {
      return
    }

    thisAngle += 0.5
    updateSectionPath()
  }, value)
}
