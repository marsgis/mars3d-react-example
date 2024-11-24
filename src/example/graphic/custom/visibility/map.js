import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 28.438455, lng: 119.479268, alt: 435.3, heading: 30.3, pitch: -53.6 },
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

  globalNotify("已知问题提示", `(1) 目前会存在锯齿。(2) 视角变化时可能有锯齿抖动。`)

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
  const pointLight = new mars3d.graphic.PointVisibility({
    position: [119.481049, 28.440174, 145],
    style: {
      radius: 100,
      visibleAreaColor: "#00ff00", // 可视颜色
      hiddenAreaColor: "#ff0000", // 不可视颜色
      opacity: 0.5
    },
    depthBiasStep: 100 // 控制准确度和锯齿的参数，如需更精确可以传0.1、如需更平滑传100优化锯齿感（牺牲了一点精度）
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic2() {
  const pointLight = new mars3d.graphic.ConeVisibility({
    position: [119.481236, 28.439863, 142],
    targetPosition: [119.482314, 28.441137, 129.5],
    style: {
      // visibleAreaColor: "#00ff00", // 可视颜色
      // hiddenAreaColor: "#ff0000", // 不可视颜色
      // opacity: 0.6
    }
  })
  graphicLayer.addGraphic(pointLight)
}

function addDemoGraphic3() {
  const pointLight = new mars3d.graphic.PointVisibility({
    position: [119.48157, 28.440346, 150],
    style: {
      radius: 100
    },
    depthBiasStep: 100 // 控制准确度和锯齿的参数，如需更精确可以传0.1、如需更平滑传100优化锯齿感（牺牲了一点精度）
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
      pointLight.position = mars3d.PointUtil.addPositionsHeight(event.cartesian, 10)
    }
  })
}

// 添加
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "coneVisibility",
    style: {
      radius: 200,
      addHeight: 1
    }
  })
}

export function startDrawGraphic2() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "pointVisibility",
    style: {
      radius: 200,
      addHeight: 1
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [119.474745, 28.436478, 119.484204, 28.444144]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 140)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.PointVisibility({
      position,
      style: {
        radius: 100
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)

    // 测试位置的
    map.viewer.entities.add({
      position: new Cesium.CallbackProperty(() => {
        return graphic.position
      }, false),
      point: {
        pixelSize: 10
      }
    })
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}
export function getGraphic(graphicId) {
  return graphicLayer.getGraphicById(graphicId)
}
