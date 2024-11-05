import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let terrainPlanClip
let tilesetLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map


  // 地形开挖
  terrainPlanClip = new mars3d.thing.TerrainPlanClip({
    diffHeight: 1000, // 井的深度
    image: "//data.mars3d.cn/img/textures/poly-stone.jpg", // 边界墙材质
    imageBottom: "//data.mars3d.cn/img/textures/poly-soil.jpg", // 底部区域材质
    splitNum: 50 // 井边界插值数
  })
  map.addThing(terrainPlanClip)


  // 模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,

    // 可传入TilesetPlanClip构造参数，下面是演示裁剪区域
    planClip: {
      positions: [
        [117.251193, 31.843689, 47.7],
        [117.251384, 31.843689, 47.7],
        [117.251384, 31.843746, 47.7],
        [117.251193, 31.843746, 47.7]
      ],
      edgeColor: Cesium.Color.GREY,
      edgeWidth: 2.0
      // showPlane: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  clear()
  map = null
}

// 绘制线
export async function drawLine() {
  clear()

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
  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  tilesetLayer.planClip.positions = positions
  terrainPlanClip.positions = positions // 同时切地形
}

// 绘制矩形
export async function drawExtent() {
  clear()

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

  tilesetLayer.planClip.positions = positions
  // terrainPlanClip.positions = positions // 同时切地形
}

// 绘制面
export async function drawPoly() {
  clear()

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

  tilesetLayer.planClip.positions = positions
}

// 绘制面(外切)
export async function drawPoly2() {
  clear()

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

  tilesetLayer.planClip.clipOutSide = true
  tilesetLayer.planClip.positions = positions
}

// 更改切换方向
export function clippingType(type) {
  tilesetLayer.planClip.clipType = mars3d.ClipType[type]
}

// 距离
export function rangeDistance(value) {
  tilesetLayer.planClip.distance = value
}

export function rangeAngle1(value) {
  tilesetLayer.planClip.angle1 = value
}
export function rangeAngle2(value) {
  tilesetLayer.planClip.angle2 = value
}


export function clear() {
  tilesetLayer.planClip.clear()
  terrainPlanClip.clear()
}
