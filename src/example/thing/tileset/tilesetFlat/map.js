import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let lineLayer // 矢量图层对象,用于graphic绑定展示
let tilesetLayer // 3dtiles模型；添加模型选择

export const mapOptions = {
  scene: {
    center: { lat: 34.215539, lng: 108.959582, alt: 817, heading: 2, pitch: -46 }
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify("已知问题提示", `(1) 目前不支持所有类型3dtile数据，请替换url进行自测`)

  // 创建矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  showDytDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// true:  精确模式, 直接存储范围,但传入的范围顶点数量多时，就会造成一定程度的卡顿；
// false: 掩膜模式，栅格化范围,效率与范围顶点数量无关,但放大后锯齿化严重
const precise = false

export function showDytDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1,

    // 可传入TilesetFlat构造参数，下面是演示压平区域
    flat: {
      precise,
      area: [
        {
          positions: [
            [108.959054, 34.219449, 405],
            [108.959821, 34.219449, 405],
            [108.959821, 34.220165, 405],
            [108.959054, 34.220165, 405]
          ]
        }
      ],
      editHeight: -24, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

export function showTehDemo() {
  removeLayer()

  // 以下数据为cesiumlab v3处理，目前其材质有做偏移处理，不知道内部逻辑及具体值，无法平整压平。
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maxMemory: 2048, // 最大缓存内存大小(MB)
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 31.795308, lng: 117.21948, alt: 1820, heading: 0, pitch: -39 },

    editHeight: -140.0, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    flat: {
      precise,
      enabled: true
    },

    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}
export function showXianDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },

    editHeight: -18.0, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    flat: {
      precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

// 添加了压平区域后的回调事件
function onAddFlatArea(event) {
  const areaObj = event.area
  areaObj.lineId = addTestLine(areaObj.positions)

  // 触发自定义事件 addItem
  eventTarget.fire("addItem", event)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// 添加矩形
export async function btnDrawExtent(height) {
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    }
  })
  const positions = graphic.getOutlinePositions(false)
  map.graphicLayer.clear()

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  tilesetLayer.flat.addArea(positions, { height })
}
// 绘制多边形
export async function btnDraw(height) {
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()

  console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

  tilesetLayer.flat.addArea(positions, { height })
}
// 清除
export function removeAll() {
  tilesetLayer.flat.clear()

  map.graphicLayer.clear()
  lineLayer.clear()
}

// 改变压平的高度
export function changeFlatHeight(val) {
  tilesetLayer.flat.updateHeight(val)
}

// 是否显示测试边界线
export function chkShowLine(val) {
  lineLayer.show = val
}

export function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.flat.showArea(id)
  } else {
    tilesetLayer.flat.hideArea(id)
  }
}

// 定位至模型
export function flyToGraphic(item) {
  const graphic = tilesetLayer.flat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
export function deletedGraphic(areaId, lineId) {
  tilesetLayer.flat.removeArea(areaId)

  const graphicLine = lineLayer.getGraphicById(lineId)
  lineLayer.removeGraphic(graphicLine)
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
