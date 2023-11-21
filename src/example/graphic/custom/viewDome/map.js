import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 28.437359, lng: 119.478919, alt: 350.5, heading: 26.3, pitch: -21.6 },
    globe: {
      depthTestAgainstTerrain: true // 不加无法投射到地形上
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

  map.scene.globe.shadows = Cesium.ShadowMode.CAST_ONLY // 地形上分析时，需要加这行代码

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    maximumScreenSpaceError: 1,
    position: { alt: 148.2 }
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const pointLight = new mars3d.graphic.ViewDome({
    position: [119.480936, 28.44019, 131],
    style: {
      radius: 90,
      visibleColor: "rgba(0,183,239, 0.5)",
      hiddenColor: "rgba(227,108,9, 0.5)"
    }
  })
  graphicLayer.addGraphic(pointLight)
}

// 添加
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "viewDome",
    style: {
      radius: 50
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [119.474985, 28.436963, 119.483563, 28.442804]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 140)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ViewDome({
      position,
      style: {
        radius: 30
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}
export function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
