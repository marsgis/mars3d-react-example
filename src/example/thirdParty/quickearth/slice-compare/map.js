import * as mars3d from "mars3d"

const { consts, getBinary, resourceService, BinaryGridDataProvider, MemoryGridDataProvider } = window.QE // quickearth.core.js
const { CPixelLayer } = window.QEC // quickearth.cesium.js

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass()

export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 26.658143, lng: 119.039029, alt: 489487, heading: 351.2, pitch: -39.3 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  createControl()

  initDemoData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const style = {
  fillColor: "color-cr#res",
  zScale: 10,
  fillMode: 1,
  optimizedInterp: false
}
let provider
let activeHighIdx = 0

async function initDemoData() {
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
  provider = new BinaryGridDataProvider(buffers[0])

  const collection = new Cesium.PrimitiveCollection()
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

  eventTarget.fire("dataLoaded", { zValues: provider.gridOptions.zValues })

  addGraphics(provider.gridOptions)

  // 对比的地图加图层
  addOnePixelLayerToExMap()
}

function addGraphics(gridOptions) {
  // 添加 三维中的高度线
  gridOptions.zValues.forEach((zValue) => {
    const scaledZValue = zValue * style.zScale

    const graphicLine1 = new mars3d.graphic.PolylinePrimitive({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        gridOptions.xStart,
        gridOptions.yStart,
        scaledZValue,
        gridOptions.xEnd,
        gridOptions.yStart,
        scaledZValue
      ]),
      style: {
        width: 2,
        color: "#FFFF00"
      }
    })
    graphicLayer.addGraphic(graphicLine1)

    const graphicLabel1 = new mars3d.graphic.LabelPrimitive({
      position: Cesium.Cartesian3.fromDegrees(gridOptions.xEnd, gridOptions.yStart, scaledZValue),
      style: {
        text: `${zValue}m`,
        font: "14px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(30, 0)
      }
    })
    graphicLayer.addGraphic(graphicLabel1)

    const graphicLine2 = new mars3d.graphic.PolylinePrimitive({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        gridOptions.xStart,
        gridOptions.yStart,
        zValue * style.zScale,
        gridOptions.xStart,
        gridOptions.yEnd,
        zValue * style.zScale
      ]),
      style: {
        width: 2,
        color: "#FFFF00"
      }
    })
    graphicLayer.addGraphic(graphicLine2)

    const graphicLabel2 = new mars3d.graphic.LabelPrimitive({
      position: Cesium.Cartesian3.fromDegrees(gridOptions.xStart, gridOptions.yEnd, scaledZValue),
      style: {
        text: `${zValue}m`,
        font: "14px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(-30, 0)
      }
    })
    graphicLayer.addGraphic(graphicLabel2)
  })

  // 添加 红色矩形范围
  const xStart = gridOptions.xStart
  const xEnd = gridOptions.xEnd
  const yStart = gridOptions.yStart
  const yEnd = gridOptions.yEnd
  const zValue = gridOptions.zValues[activeHighIdx] * style.zScale

  const graphicRectangle = new mars3d.graphic.RectangleEntity({
    id: "redRectangle",
    rectangle: Cesium.Rectangle.fromDegrees(xStart, yEnd, xEnd, yStart),
    style: {
      color: Cesium.Color.RED.withAlpha(0.3),
      height: zValue
    },
    attr: { remark: "覆盖的范围" }
  })
  graphicLayer.addGraphic(graphicRectangle)

  // 添加 三维对象的单击点
  const graphicBillboard = new mars3d.graphic.BillboardEntity({
    position: new Cesium.CallbackProperty((time) => {
      return selPoint
    }, false),
    style: {
      image: "//data.mars3d.cn/img/marker/lace-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    },
    attr: { remark: "单击选中的坐标" }
  })
  graphicLayer.addGraphic(graphicBillboard)
}

let mapEx // 对比的地图
let selPoint // 单击选中的坐标
export function createControl() {
  // 修改已有地图为50%
  const mapOld = document.getElementById("centerDiv3D")
  mapOld.style.width = "50%"

  // 获取原来地图的参数
  const mapOptions2 = map.toJSON()
  mapOptions2.control.baseLayerPicker = true // basemaps底图切换按钮
  mapOptions2.control.sceneModePicker = false
  // mapOptions2.scene.sceneMode = 2

  // 用于双屏同图层，不同配置展示
  for (let i = 0, len = mapOptions2.layers.length; i < len; i++) {
    const item = mapOptions2.layers[i]
    if (item.compare) {
      for (const key in item.compare) {
        item[key] = item.compare[key] // 存在compare属性时
      }
    }
  }
  console.log("分屏地图配置", mars3d.Util.clone(mapOptions2))

  const mapSplit = new mars3d.control.MapCompare({
    ...mapOptions2,
    parentContainer: document.body
  })
  map.addControl(mapSplit)

  mapEx = mapSplit.mapEx

  // 修改对比地图
  mapEx.basemap = "高德电子"

  mapEx.on(mars3d.EventType.click, (event) => {
    const pos = mars3d.LngLatPoint.fromCartesian(event.cartesian)
    if (
      pos.lng < provider.gridOptions.xStart ||
      pos.lng > provider.gridOptions.xEnd ||
      pos.lat < provider.gridOptions.yEnd ||
      pos.lat > provider.gridOptions.yStart
    ) {
      mapEx.closePopup()
      selPoint = undefined
      return // 单击在范围外直接跳出
    }

    const value = layer2D.dataSource.pickValue(pos.lng, pos.lat)
    mapEx.openPopup(pos, value + "dbz", {
      closeButton: false
    })

    // 左侧图标对应的坐标
    const height = provider.gridOptions.zValues[activeHighIdx] * style.zScale // 根据层级算高度值
    selPoint = Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, height)
  })
}

// 对比地图加单个图层
let layer2D
function addOnePixelLayerToExMap() {
  if (layer2D) {
    mapEx.scene.primitives.remove(layer2D)
  }

  const gridOptions = {
    ...provider.gridOptions,
    zValues: 0 // [provider.gridOptions.zValues[activeHighIdx]]
  }
  const grid = provider.getGrid(0, activeHighIdx)
  const currentProvider = new MemoryGridDataProvider([[grid]], { gridOptions })

  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  layer2D = new CPixelLayer({ cull: false })
    .setDrawOptions({
      ...style
    })
    .setDataSource(currentProvider)

  mapEx.scene.primitives.add(layer2D)
}

export function setActiveHighIdx(idx) {
  activeHighIdx = idx

  const rectangleEntity = graphicLayer.getGraphicById("redRectangle")
  if (rectangleEntity) {
    rectangleEntity.setStyle({ height: provider.gridOptions.zValues[activeHighIdx] * style.zScale })
  }
  selPoint = undefined

  addOnePixelLayerToExMap()
  mapEx.closePopup()
}
