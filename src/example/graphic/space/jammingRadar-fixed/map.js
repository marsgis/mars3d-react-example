import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.586463, lng: 117.640209, alt: 178487.6, heading: 356.2, pitch: -52.2 }
  }
}

export let graphicLayer
export let radarJamming

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addDemoGraphic1(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // eslint-disable-next-line no-undef
  radarJamming = new mars3d.graphic.FixedJammingRadar({
    position: [117.271756, 31.863786, 16.6],
    vertexs: [],
    style: {
      // color: new mars3d.Cesium.Color(1, 0, 0, 1.0), // 设置雷达颜色，默认是过渡色
      outline: true // 是否显示线框
      // outlineColor: new mars3d.Cesium.Color(1, 1, 0, 1.0), // 设置线框颜色，默认是过渡色
    },
    jammers: [
      // 内置的默认干扰机
      {
        id: "固定干扰机",
        position: [116.98875, 32.634335, 40000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.682362975434472
      }
    ]
  })
  graphicLayer.addGraphic(radarJamming)

  // 构造雷达后添加干扰机
  const jammer = radarJamming.addJammer({
    id: "动态干扰机",
    position: [116.387754, 31.292601, 50000],
    bji: 2000000,
    yji: 0.5,
    pitch: 9.68
  })

  // 测试动态更新位置
  const dsq = setInterval(() => {
    jammer.position[0] += 0.05
    if (radarJamming.isDestroy || jammer.position[0] > 119) {
      clearInterval(dsq)
      return
    }
    radarJamming.addJammer(jammer)
  }, 100)

  // 显示干扰机位置，方便对比
  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return radarJamming && radarJamming.getJammer("固定干扰机")?._position
    }, false),
    point: {
      pixelSize: 10,
      color: mars3d.Cesium.Color.RED,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })

  // 显示干扰机位置，方便对比
  map.viewer.entities.add({
    position: new Cesium.CallbackProperty(() => {
      return radarJamming && radarJamming.getJammer("动态干扰机")?._position
    }, false),
    point: {
      pixelSize: 10,
      color: mars3d.Cesium.Color.BLUE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.FixedJammingRadar({
      position: position,
      style: {
        scale: 0.6,
        color: "#ff0000",
        opacity: 0.3,
        outline: true,
        outlineColor: "#ffffff"
      },
      attr: { index: index },
      jammers: [
        // 内置的默认干扰机
        {
          id: "干扰机1",
          position: [116.98875, 32.634335, 40000],
          bji: 2000000,
          yji: 0.5,
          pitch: 9.682362975434472
        },
        {
          id: "干扰机2",
          position: [117.506527, 31.515046, 50000],
          bji: 2000000,
          yji: 0.5,
          pitch: 9.68
        }
      ]
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "fixedJammingRadar",
    style: {
      outline: true
    },
    jammers: [
      // 内置的默认干扰机
      {
        id: "干扰机1",
        position: [116.98875, 32.634335, 40000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.682362975434472
      },
      {
        id: "干扰机2",
        position: [117.506527, 31.515046, 50000],
        bji: 2000000,
        yji: 0.5,
        pitch: 9.68
      }
    ]
  })
}
