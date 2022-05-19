import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetClip

export const mapOptions = {
  scene: {
    center: { lat: 31.826361, lng: 117.223374, alt: 805, heading: 206, pitch: -38 }
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

  // 加模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)
  // 模型开挖处理类
  tilesetClip = new mars3d.thing.TilesetClip({
    layer: tilesetLayer,
    positions: [
      [117.217219, 31.81957, 33.1],
      [117.220855, 31.818821, 31.8],
      [117.220938, 31.817249, 30.6],
      [117.21743, 31.816218, 31.7]
    ]
  })
  map.addThing(tilesetClip)

  // 模型加载完成方法一
  tilesetLayer.readyPromise.then((e) => {
    eventTarget.fire("dataLoaded", { list: tilesetClip.list })
  })

  // 模型加载完成方法二
  /* tilesetLayer.on(mars3d.EventType.load, function () {
    setTimeout(function () {
      eventTarget.fire("dataLoaded", { list: tilesetClip.list })
    }, 100)
  }) */

  // 会执行多次，重新加载一次完成后都会回调
  tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
    console.log("触发allTilesLoaded事件", event)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 绘制矩形
export function btnDrawExtent() {
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

      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标

      const item = tilesetClip.addArea(positions)
      addTableItem(item)
    }
  })
}
// 绘制裁剪区
export function btnDraw() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标

      const item = tilesetClip.addArea(positions)
      addTableItem(item)
    }
  })
}
// 清除
export function removeAll() {
  map.graphicLayer.clear()
  tilesetClip.clear()
}

// 触发自定义事件 addItem
function addTableItem(item) {
  eventTarget.fire("addItem", { item })
}

// 定位至模型
export function flyToGraphic(item) {
  const graphic = tilesetClip.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
export function deletedGraphic(item) {
  const graphic = tilesetClip.getAreaById(item)
  tilesetClip.removeArea(graphic)
}

export function showHideArea(id, selected) {
  if (selected) {
    tilesetClip.showArea(id)
  } else {
    tilesetClip.hideArea(id)
  }
}
