import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let terrainFlat

export const mapOptions = {
  scene: {
    center: { lat: 30.827414, lng: 116.378229, alt: 16933, heading: 0, pitch: -56 }
  }
}

let lineLayer // 矢量图层对象,用于graphic绑定展示

export const eventTabel = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addTerrainClip() {
  terrainFlat = new mars3d.thing.TerrainFlat()
  map.addThing(terrainFlat)

  // terrainFlat.on(mars3d.EventType.addItem, onAddFlatArea)

  const areaItem = terrainFlat.addArea(
    [
      [116.334222, 30.899171, 645.46],
      [116.370874, 30.899171, 645.46],
      [116.370874, 30.944509, 645.46],
      [116.334222, 30.944509, 645.46]
    ],
    { height: 900 }
  )
  addTableItem(areaItem)

  const areaItem2 = terrainFlat.addArea(
    [
      [116.416497, 30.934256, 775.89],
      [116.427392, 30.962941, 1084.88],
      [116.434838, 30.932608, 900.43],
      [116.462994, 30.923081, 771.42],
      [116.437571, 30.916044, 906.39],
      [116.44977, 30.894487, 776.06],
      [116.424183, 30.908752, 727.02],
      [116.402218, 30.898406, 593.08],
      [116.414309, 30.918806, 588.78],
      [116.387022, 30.933539, 700.65]
    ],
    { height: 200 }
  )
  addTableItem(areaItem2)
}

// 添加矩形
export async function btnDrawExtent(height) {
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()

  console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 打印下边界

  // 挖地区域
  const areaItem = terrainFlat.addArea(positions, { height })
  addTableItem(areaItem)
}
// 添加多边形
export async function btnDraw(height) {
  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()

  console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 打印下边界

  const areaItem = terrainFlat.addArea(positions, { height })
  addTableItem(areaItem)
}

// 清除
export function removeAll() {
  terrainFlat.clear() // 清除挖地区域
  lineLayer.clear()
}

// 改变切割的深度
export function changeClipHeight(val) {
  terrainFlat.height = val
}

// 是否挖地
export function chkClippingPlanes(val) {
  terrainFlat.enabled = val
}

// 区域表格添加一行记录
function addTableItem(item) {
  item.lineId = addTestLine(item.positions)

  eventTabel.fire("tableObject", { tableItem: { key: item.id, name: "压平区域" + item.id, lineId: item.lineId, show: item.show } })
}
// 表格操作
export function flyToGraphic(item) {
  const graphic = terrainFlat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

export function deletedGraphic(areaId, lineId) {
  const graphic = terrainFlat.getAreaById(areaId)
  terrainFlat.removeArea(graphic)

  if (lineId) {
    const graphicLine = lineLayer.getGraphicById(lineId)
    lineLayer.removeGraphic(graphicLine)
  }
}

export function showHideArea(id, selected) {
  if (selected) {
    terrainFlat.showArea(id)
  } else {
    terrainFlat.hideArea(id)
  }
}

// 是否显示测试边界线
export function chkShowLine(val) {
  lineLayer.show = val
}

function addTestLine(positions) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    }
  })
  lineLayer.addGraphic(graphic)

  // const graphic = new mars3d.graphic.PolygonEntity({
  //   positions: positions,
  //   style: {
  //     materialType: mars3d.MaterialType.Image,
  //     materialOptions: {
  //       image: "//data.mars3d.cn/img/textures/poly-soil.jpg",
  //       opacity: 0.8 // 透明度
  //     },
  //     clampToGround: true
  //   }
  // })
  // lineLayer.addGraphic(graphic)

  return graphic.id
}
