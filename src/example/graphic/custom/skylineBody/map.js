import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 28.441881, lng: 119.482881, alt: 133, heading: 240, pitch: -2 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    brightness: 0.6
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  setTimeout(() => {
    // 加一些演示数据
    addDemoGraphic1()
  }, 5000)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const viewShed = new mars3d.graphic.SkylineBody({
    position: [119.481595, 28.440286, 134.2],
    style: {
      heading: 262,
      pitch: -9.3,
      color: "#00ffff",
      opacity: 0.4
    }
  })
  graphicLayer.addGraphic(viewShed)

  viewShed.flyTo({ pitch: -45 })
}

export function addGraphic() {
  const viewShed = new mars3d.graphic.SkylineBody({
    style: {
      color: "#00ffff",
      opacity: 0.4
    }
  })
  graphicLayer.addGraphic(viewShed)

  viewShed.flyTo({ pitch: -45 })
}

export function clear() {
  graphicLayer.clear()
}
