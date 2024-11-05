import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let tilesetPlanClip // 模型裁剪事件
let underground
let terrainClip

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.8503, lng: 117.101008, alt: 308, heading: 291, pitch: -30 },
    baseColor: "rgba(0,0,0.0,0.5)",
    globe: {
      depthTestAgainstTerrain: true
    },
    highDynamicRange: true
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 加个模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    id: 1987,
    name: "桥梁",
    url: "//data.mars3d.cn/3dtiles/bim-qiaoliang/tileset.json",
    maximumScreenSpaceError: 16,
    cullWithChildrenBounds: false,

    position: { lng: 117.096906, lat: 31.851564, alt: 45 },
    rotation: { z: 17.5 },
    // 高亮时的样式
    highlight: {
      // all: true, //全部整体高亮，false时是构件高亮
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      color: "#00FF00"
    },
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了3dtiles图层", event)
  })

  addPlanClipThing(tiles3dLayer)

  terrainClips(30)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addPlanClipThing(tiles3dLayer) {
  // 模型裁剪
  tilesetPlanClip = new mars3d.thing.TilesetPlanClip({
    positions: [
      [117.096786, 31.851355, 0],
      [117.096834, 31.851464, 0],
      [117.09691, 31.851375, 0]
    ],
    layer: tiles3dLayer,
    clipOutSide: false,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0
  })
  map.addThing(tilesetPlanClip)
}

// 是否开启地下模式
export function chkUnderground(val, alphaVal) {
  // 地下模式
  if (!underground) {
    underground = new mars3d.thing.Underground({
      alpha: alphaVal,
      enabled: val
    })
    map.addThing(underground)
  }

  underground.enabled = val
}

// 透明度发生改变
export function alphaChange(value) {
  if (underground) {
    underground.alpha = value
  }
}

// ==========================================
// 是否开挖
export function chkClippingPlanes(val) {
  terrainClip.enabled = val
}

export function terrainClips(heightVal) {
  // 挖地区域
  terrainClip = new mars3d.thing.TerrainClip({
    positions: [
      [117.096176, 31.851189, 42.56],
      [117.097776, 31.851189, 42.56],
      [117.097776, 31.853494, 42.56],
      [117.096176, 31.853494, 42.56]
    ],
    exact: true,
    diffHeight: heightVal, // 高度
    image: "//data.mars3d.cn/img/textures/poly-stone.jpg",
    imageBottom: "//data.mars3d.cn/img/textures/poly-soil.jpg",
    splitNum: 80 // 井边界插值数
  })
  map.addThing(terrainClip)
}

export function heightChange(num) {
  terrainClip.diffHeight = num
}

// 绘制矩形
export async function drawExtent() {
  terrainClip.clear() // 清除挖地区域

  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  // 挖地区域
  terrainClip.positions = positions
}

// 绘制多边形
export async function drawPolygon() {
  terrainClip.clear() // 清除挖地区域

  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      clampToGround: true
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  // 挖地区域
  terrainClip.positions = positions
}

export function clearWJ() {
  terrainClip.clear() // 清除挖地区域
}

//= ========================================
export function distanceChange(value) {
  tilesetPlanClip.distance = value
}

// 切顶
export function clipTop() {
  tilesetPlanClip.clipType = mars3d.ClipType.ZR
}
// 起点
export function clipBottom() {
  tilesetPlanClip.clipType = mars3d.ClipType.Z
}
// 切线
export async function clipLine() {
  tilesetPlanClip.clear()

  const graphic = await map.graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()

  tilesetPlanClip.positions = positions
}

// 内切
export async function clipPoly() {
  tilesetPlanClip.clear()

  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()

  tilesetPlanClip.positions = positions
}

// 外切
export async function clipPoly2() {
  tilesetPlanClip.clear()

  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()

  tilesetPlanClip.clipOutSide = true
  tilesetPlanClip.positions = positions
}

export function clearClip() {
  tilesetPlanClip.clear()
}
