import * as mars3d from "mars3d"
// import { FeRadarJamming } from "./FeRadarJamming"

export let map // mars3d.Map三维地图对象

export let graphicLayer
export let radarJamming // 雷达primitive

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.27994, lng: 117.241137, alt: 92227, heading: 0, pitch: -53 }
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

  // 创建矢量数据图层
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
  radarJamming = new mars3d.graphic.JammingRadar({
    position: [117.271756, 31.863786, 16.6],
    vertexs: getVertexs(),
    style: {
      // color: new mars3d.Cesium.Color(1, 0, 0, 1.0), // 设置雷达颜色，默认是过渡色
      outline: true // 是否显示线框
      // outlineColor: new mars3d.Cesium.Color(1, 1, 0, 1.0), // 设置线框颜色，默认是过渡色
    }
  })
  graphicLayer.addGraphic(radarJamming)
}

function getVertexs() {
  const vertexs = [] // 二维数组，第1层为平面一圈，第2层为竖直方向各圈
  for (let pitch = 0; pitch <= 90; pitch += 10) {
    const arrHeadingPt = []
    let radius = 0
    if (pitch === 0) {
      radius = 0
    } else if (pitch === 10) {
      radius = 1562
    } else if (pitch === 20) {
      radius = 5989
    } else if (pitch === 30) {
      radius = 12541
    } else if (pitch === 40) {
      radius = 20100
    } else if (pitch === 50) {
      radius = 27323
    } else if (pitch === 60) {
      radius = 32796
    } else if (pitch === 70) {
      radius = 35115
    } else if (pitch === 80) {
      radius = 32556
    } else if (pitch === 90) {
      radius = 0
    }
    for (let horizontal = 0; horizontal <= 360; horizontal += 10) {
      arrHeadingPt.push({
        heading: horizontal, // 平面上的方向，角度值
        pitch: pitch, // 垂直上的方向，角度值
        radius: radius // 半径
      })
    }
    vertexs.push(arrHeadingPt)
  }
  return vertexs
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

    const graphic = new mars3d.graphic.JammingRadar({
      position: position,
      vertexs: getVertexs(),
      style: {
        scale: 0.4,
        color: "#ff0000",
        opacity: 0.3,
        outline: true,
        outlineColor: "#ffffff"
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "jammingRadar",
    vertexs: getVertexs(),
    style: {
      outline: true
    }
  })
}
