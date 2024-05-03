import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },

    // 可传入TilesetPlanClip构造参数，下面是演示裁剪区域
    planClip: {
      positions: [
        [119.481231, 28.440357, 0],
        [119.481998, 28.441117, 0],
        [119.482421, 28.440803, 0],
        [119.481627, 28.439996, 0]
      ],
      edgeColor: Cesium.Color.GREY,
      edgeWidth: 2.0
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 也兼容原生cesium的tileset，按下面方式使用
  // let tilesetPlanClip = new mars3d.thing.TilesetPlanClip()
  // tilesetPlanClip.clipTarget = tileset
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export async function drawPoly() {
  tilesetLayer.planClip.clear()
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

  // 加入positions才能使3d裁剪确定位置，生效
  tilesetLayer.planClip.positions = positions
}

export async function drawPoly2() {
  tilesetLayer.planClip.clear()

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

export async function drawExtent() {
  tilesetLayer.planClip.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()
  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  tilesetLayer.planClip.positions = positions
}

export async function drawExtent2() {
  tilesetLayer.planClip.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
      // clampToGround: true
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()
  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  tilesetLayer.planClip.clipOutSide = true
  tilesetLayer.planClip.positions = positions
}

export function clear() {
  tilesetLayer.planClip.clear()
}
