import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象
let shortestPathLayer

let polygonZAM
let pointQD
let pointZD

export const mapOptions = {
  scene: {
    center: { lat: 31.871794, lng: 116.800468, alt: 57020, heading: 0, pitch: -90 }
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

  shortestPathLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(shortestPathLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 绘制障碍面
export async function drawPolygon() {
  if (polygonZAM) {
    polygonZAM.remove()
    polygonZAM = null
  }
  polygonZAM = await graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ffff",
      opacity: 0.4,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff"
    }
  })
}
// 绘制起点
export async function startPoint() {
  if (pointQD) {
    pointQD.remove()
    pointQD = null
  }
  pointQD = await graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "起点",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
}

// 绘制终点
export async function endPoint() {
  if (pointZD) {
    pointZD.remove()
    pointZD = null
  }
  pointZD = await graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red",
      label: {
        text: "终点",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
}

// 计算最短路径
export function shortestPath() {
  if (!polygonZAM) {
    globalMsg("请绘制障碍面")
    return
  }
  if (!pointQD) {
    globalMsg("请绘制起点")
    return
  }
  if (!pointZD) {
    globalMsg("请绘制终点")
    return
  }

  shortestPathLayer.clear()

  const polygon = polygonZAM.toGeoJSON({ closure: true }) // 障碍面
  const startPoint = pointQD.coordinate // 起点
  const endPoint = pointZD.coordinate // 终点

  const options = {
    obstacles: polygon.geometry,
    units: "meters",
    resolution: 100
  }
  const path = turf.shortestPath(startPoint, endPoint, options)

  const positions = path.geometry.coordinates
  const polyonLine = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      color: " #55ff33"
    }
  })
  shortestPathLayer.addGraphic(polyonLine)
}

export function clearLayer() {
  polygonZAM = null
  pointQD = null
  pointZD = null

  graphicLayer.clear()
  shortestPathLayer.clear()
}
