import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象,用于graphic绑定展示
let tilesetFlat

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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addLayer() {
  // 加模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tilesetLayer)

  // 模型压平处理类
  tilesetFlat = new mars3d.thing.TilesetFlat({
    layer: tilesetLayer,
    positions: [
      [108.959062, 34.220134, 397.3],
      [108.959802, 34.220147, 397.6],
      [108.959779, 34.219506, 398.7],
      [108.959106, 34.21953, 398.1]
    ],
    height: 0
  })
  map.addThing(tilesetFlat)

  // 模型加载完成方法一
  tilesetLayer.readyPromise.then((e) => {
    eventTarget.fire("dataLoaded", { list: tilesetFlat.list })
  })

  // 模型加载完成方法二
  // tilesetLayer.on(mars3d.EventType.load, function () {
  //   setTimeout(() => {
  //     eventTarget.fire("dataLoaded", { list: tilesetFlat.list })
  //   }, 10)
  // })
}

// 添加矩形
export function btnDrawExtent(chkShowLine) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      const id = addTestLine(chkShowLine, positions)
      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标

      const item = tilesetFlat.addArea(positions)

      addTableItem({ id: id, item: item })
    }
  })
}
// 绘制多边形
export function btnDraw(chkShowLine) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      const id = addTestLine(chkShowLine, positions)
      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标

      const item = tilesetFlat.addArea(positions)

      addTableItem({ id: id, item: item })
    }
  })
}
// 清除
export function removeAll() {
  tilesetFlat.clear()
  map.graphicLayer.clear()
  graphicLayer.eachGraphic((graphic) => {
    graphicLayer.removeGraphic(graphic)
  })
}

// 改变压平的高度
export function changeFlatHeight(val) {
  tilesetFlat.height = val
}

// 是否显示测试边界线
export function chkShowLine(val) {
  graphicLayer.eachGraphic((graphic) => {
    graphic.show = val
  })
}

function addTestLine(chkShowLine, positions) {
  console.log("外框")
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    },
    show: chkShowLine
  })
  graphicLayer.addGraphic(graphic)

  return graphic.id
}

// 触发自定义事件 addItem
function addTableItem(data) {
  eventTarget.fire("addItem", { data })
}

export function showHideArea(id, selected) {
  if (selected) {
    tilesetFlat.showArea(id)
  } else {
    tilesetFlat.hideArea(id)
  }
}

// 定位至模型
export function flyToGraphic(item) {
  const graphic = tilesetFlat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
export function deletedGraphic(key, id) {
  const graphic = tilesetFlat.getAreaById(key)
  tilesetFlat.removeArea(graphic)
  const graphicLine = graphicLayer.getGraphicById(id)
  graphicLayer.removeGraphic(graphicLine)
}
