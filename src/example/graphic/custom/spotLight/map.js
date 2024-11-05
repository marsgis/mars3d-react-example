import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 28.44134, lng: 119.482389, alt: 265, heading: 231.5, pitch: -46.7 },
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

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  const pointLight = new mars3d.graphic.SpotLight({
    position: [119.482041, 28.440257, 133],
    style: {
      color: "#e3e238",
      intensity: 200,
      radius: 1000,
      heading: 309
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic2() {
  const pointLight = new mars3d.graphic.SpotLight({
    position: [119.481047, 28.440191, 143],
    style: {
      color: "#e33838",
      intensity: 400,
      radius: 2000
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic3() {
  const pointLight = new mars3d.graphic.SpotLight({
    position: [119.48157, 28.440346, 150],
    style: {
      intensity: 200,
      heading: 180
    }
  })
  graphicLayer.addGraphic(pointLight)

  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return pointLight.position
    }, false),
    point: {
      pixelSize: 10
    }
  })

  map.on(mars3d.EventType.mouseMove, function (event) {
    if (event.cartesian && pointLight.isAdded) {
      pointLight.position = mars3d.PointUtil.addPositionsHeight(event.cartesian, 1)
    }
  })
}

// 添加
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "spotLight",
    style: {
      intensity: 500,
      radius: 3000,
      addHeight: 1
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [119.474745, 28.436478, 119.484204, 28.444144]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 160)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.SpotLight({
      position,
      style: {
        intensity: 3000,
        radius: 2000,
        pitch: -20
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)

    // 测试位置的
    // map.viewer.entities.add({
    //   position: graphic.position,
    //   point: {
    //     pixelSize: 10
    //   }
    // })
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

export function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
