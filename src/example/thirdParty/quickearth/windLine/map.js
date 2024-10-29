import * as mars3d from "mars3d"

const {
  bufferExtent,
  consts,
  DAPService,
  getGridPosIndex,
  GridDataGLFillMode,
  MemoryWindDataProvider,
  p2h,
  resourceService,
  getPos2DFrom1D,
  randomPointInGrid
} = window.QE // quickearth.core.js

const { CGeometryLayer, CTracingService } = window.QEC // quickearth.cesium.js

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 19.372083, lng: 130.582538, alt: 957153.2, heading: 358.5, pitch: -47.7 }
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
const uiConfig = {
  shininess: 0,
  specular: 0,
  transparent: false,
  lineCount: 50,
  emission: { r: 0, g: 0, b: 0 },
  range: 5,
  useW: false,
  shapeScale: 2,
  vDataScale: 2
}

async function initDemoData() {
  globalMsg("数据加载中...")
  showLoading()

  // public静态资源的路径
  consts.resourcePath = "//data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "//data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  await load(uiConfig)

  globalMsg("数据加载完成")
  hideLoading()
}

const loadPressureLevelData = async (varName, dapService, xIdx1, xIdx2, yIdx1, yIdx2, zValues) => {
  const vLevelsData = await dapService.loadDataByFullFilter({
    varName: varName,
    xFilter: `[${Math.min(xIdx1, xIdx2)}:1:${Math.max(xIdx1, xIdx2)}]`,
    yFilter: `[${Math.min(yIdx1, yIdx2)}:1:${Math.max(yIdx1, yIdx2)}]`,
    zFilter: "[21:1:40]"
  })
  const vProvider = (await dapService.dapResultToProvider(vLevelsData, varName)).provider
  vProvider.allGrids()[0].reverse()
  vProvider.gridOptions.zValues = zValues || vProvider.gridOptions.zValues.map((p) => p2h(p / 100)).reverse()
  return vProvider
}

let windProvider
const center = [132, 27.5]

const load = async (uiConfig, reloadData = false) => {
  map.scene.primitives.removeAll()

  if (reloadData) {
    windProvider = undefined
  }
  if (!windProvider) {
    globalMsg("Data加载中...")

    const dataUrl = "https://serv.91weather.com/thredds/dodsC/gfs/gfs.20220917/06/gfs.t06z.pgrb2.0p25.f003"
    const dapService = new DAPService(dataUrl)
    await dapService.loadDataInfo()
    const gridOptions = await dapService.getFullGridOptions("u-component_of_wind_isobaric")
    const rect = bufferExtent(center[1], center[0], uiConfig.range, uiConfig.range)
    const xIdx1 = getGridPosIndex(gridOptions.xStart, gridOptions.xDelta, rect.minLon)
    const xIdx2 = getGridPosIndex(gridOptions.xStart, gridOptions.xDelta, rect.maxLon)
    const yIdx1 = getGridPosIndex(gridOptions.yStart, gridOptions.yDelta, rect.maxLat)
    const yIdx2 = getGridPosIndex(gridOptions.yStart, gridOptions.yDelta, rect.minLat)
    const uProvider = await loadPressureLevelData("u-component_of_wind_isobaric", dapService, xIdx1, xIdx2, yIdx1, yIdx2)
    const vProvider = await loadPressureLevelData(
      "v-component_of_wind_isobaric",
      dapService,
      xIdx1,
      xIdx2,
      yIdx1,
      yIdx2,
      uProvider.gridOptions.zValues
    )
    if (uiConfig.useW) {
      const wProvider = await loadPressureLevelData(
        "Vertical_velocity_pressure_isobaric",
        dapService,
        xIdx1,
        xIdx2,
        yIdx1,
        yIdx2,
        uProvider.gridOptions.zValues
      )
      windProvider = new MemoryWindDataProvider(uProvider, vProvider, { gridOptions: uProvider.gridOptions, lazyCalc: true, isUV: true, wProvider })
    } else {
      windProvider = new MemoryWindDataProvider(uProvider, vProvider, { gridOptions: uProvider.gridOptions, lazyCalc: true, isUV: true })
    }

    globalMsg("Data加载完成")
  }
  const zScale = 15
  const tracingOptions = {
    dataSource: windProvider,
    zIdx: -1,
    vReso: 1000,
    hReso: 0.2,
    lineCount: uiConfig.lineCount,
    zScale,
    // stayLoop: 5,
    needVolume: true,
    disableDensityControl: !uiConfig.density
  }
  const planeSize = windProvider.gridOptions.xSize * windProvider.gridOptions.ySize
  if (windProvider.wProvider && uiConfig.lineCount >= planeSize) {
    // 使用自定的种子生成器
    tracingOptions.seedGenerator = (i) => {
      if (i < planeSize) {
        const pos = getPos2DFrom1D(i, windProvider.gridOptions.xSize)
        console.log(pos)
        const lon = windProvider.gridOptions.xStart + windProvider.gridOptions.xDelta * pos.x
        const lat = windProvider.gridOptions.yStart + windProvider.gridOptions.yDelta * pos.y
        const height = windProvider.gridOptions.zValues[10]
        return [lon, lat, height]
      }
      return randomPointInGrid(windProvider.gridOptions, true)
    }
  }
  const layerInfo = await new CTracingService().tracingStreamLinesAsync(tracingOptions)
  const primitive = new CGeometryLayer(layerInfo)
  primitive?.setDataSource(windProvider)
  primitive?.setDrawOptions({
    fillColor: "color-wind#res",
    fillMode: GridDataGLFillMode.pixel1,
    zScale: zScale,
    shininess: uiConfig.shininess,
    specular: uiConfig.specular,
    emission: uiConfig.emission,
    opaque: !uiConfig.transparent
  })
  map.scene.primitives.add(primitive)
  layer = primitive
}

export const changeLineCount = (lineCount) => {
  uiConfig.lineCount = lineCount
  load(uiConfig)
}

export const changeTransparent = (transparent) => {
  uiConfig.transparent = transparent
  load(uiConfig)
}

export const changeRange = (range) => {
  uiConfig.range = range
  load(uiConfig, true)
}

export const changeUseW = (useW) => {
  uiConfig.useW = useW
  uiConfig.lineCount = Math.max(uiConfig.lineCount, 200)
  uiConfig.density = false
  load(uiConfig, true)
}

export const changeShininess = (shininess) => {
  uiConfig.shininess = shininess
  layer?.setDrawOptions({
    shininess
  })
}
export const changeSpecular = (specular) => {
  uiConfig.specular = specular
  layer?.setDrawOptions({
    specular
  })
}
export const changeColor = (emission) => {
  uiConfig.emission = emission
  layer?.setDrawOptions({
    emission
  })
}
