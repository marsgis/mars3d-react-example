import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象
let shortestPathLayer

let polygonZAM
let pointQD
let pointZD

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 34.008117, lng: 109.009385, alt: 1809.8, heading: 224.5, pitch: -45.8 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  shortestPathLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(shortestPathLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
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

let computePolygon

// 绘制需要计算路径的面
export async function drawComputePolygon() {
  if (computePolygon) {
    computePolygon.remove()
    computePolygon = null
  }

  computePolygon = await graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ffff",
      opacity: 0.4,
      outline: true,
      clampToGround: true,
      outlineWidth: 1
    }
  })

  gridSize = 0.03
  if (computePolygon.area > 20104752) {
    gridSize = gridSize + Math.ceil(computePolygon.area / 20104752) * 0.03
  }

  eventTarget.fire("changeGridSize", { gridSize })
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
      clampToGround: true,
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
      clampToGround: true,
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
  const startPoint = pointQD.coord // 起点
  const endPoint = pointZD.coord // 终点

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

let gridSize = 0.03
let maxSlope = 20
let splitCount = 12

export async function shortPathByTerrain(gridSizeValue, maxSlopeValue, splitCountValue) {
  if (!pointQD || !pointZD) {
    globalMsg("请绘制点")
    return
  }
  if (!computePolygon) {
    globalMsg("请绘制面")
    return
  }
  if (!mars3d.PolyUtil.isInPoly(pointQD?.point, computePolygon.points) || !mars3d.PolyUtil.isInPoly(pointZD?.point, computePolygon.points)) {
    globalMsg("标绘的起点或终点不在计算面内，请重新绘制")
    return
  }

  globalMsg("正在计算路径")

  gridSize = gridSizeValue
  maxSlope = maxSlopeValue
  splitCount = splitCountValue

  const lineData = await analysisByTerrain([pointQD?.point.lng, pointQD?.point.lat], [pointZD?.point.lng, pointZD?.point.lat])
  if (lineData) {
    const lineByTerrain = new mars3d.graphic.PolylineEntity({
      positions: Cesium.Cartesian3.fromDegreesArray(lineData.flat()),
      style: {
        color: " #55ff33",
        clampToGround: true
      }
    })
    await graphicLayer.addGraphic(lineByTerrain)
    globalMsg("路径计算完成")
  }
}

export function clearLayer() {
  polygonZAM = null
  pointQD = null
  pointZD = null

  graphicLayer.clear()
  shortestPathLayer.clear()
}

// 根据地形分析最短路径算法，
function analysisByTerrain(start, end) {
  const points = computePolygon.points
  const scaledPoly = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [points[0].lng, points[0].lat],
          [points[1].lng, points[1].lat],
          [points[2].lng, points[2].lat],
          [points[3].lng, points[3].lat],
          [points[0].lng, points[0].lat]
        ]
      ]
    },
    properties: {}
  }

  //  计算扩大后的边界
  const enveloped = turf.envelope(scaledPoly).bbox

  //  划分为网格
  const squareGrid = turf.squareGrid(enveloped, gridSize)
  const interpolatingPoints = []
  const line = turf.lineString(squareGrid.features[0].geometry.coordinates[0])
  const lineLength = turf.length(line)
  squareGrid.features.forEach((item, index) => {
    const positions = item.geometry.coordinates[0]
    const line = turf.lineString(positions)
    //  在每个网格轮廓上进行插值
    for (let j = 1; j <= splitCount; j++) {
      const along = turf.along(line, lineLength * (j / splitCount)).geometry.coordinates
      interpolatingPoints.push(Cesium.Cartographic.fromDegrees(...along))
    }
  })

  // console.log("----interpolatingPoints-", interpolatingPoints)

  let startXy = [] //  起点所在的网格序号
  let endXy = [] //  终点所在的网格序号
  return Cesium.sampleTerrainMostDetailed(map.viewer.scene.terrainProvider, interpolatingPoints).then((updatePositions) => {
    //  计算每列有多少个网格（为了计算每个网格在整体网格中的序号（供A*算法使用））
    const columnCount = Math.floor(turf.distance(turf.point([enveloped[0], enveloped[1]]), turf.point([enveloped[0], enveloped[3]])) / gridSize)

    let count = 0
    // 为每个网格添加序号、坡角、中心点属性，并找出起点和终点的网格序号
    for (let i = 0; i < updatePositions.length; i += splitCount) {
      const group = updatePositions.slice(i, i + splitCount)
      const sort = group.sort((a, b) => a.height - b.height)
      const [minHeightPos, maxHeigthPos] = [sort.at(0), sort.at(-1)]
      // 获取中心点
      const polygon = squareGrid.features[count]
      const center = turf.centroid(polygon)
      // 计算斜坡角度
      const line = turf.lineString([
        [Cesium.Math.toDegrees(maxHeigthPos.longitude), Cesium.Math.toDegrees(maxHeigthPos.latitude)],
        [Cesium.Math.toDegrees(minHeightPos.longitude), Cesium.Math.toDegrees(minHeightPos.latitude)]
      ])
      const edge1 = turf.length(line)
      const edge2 = (maxHeigthPos.height - minHeightPos.height) / 1000
      // 根据两条直角边的反正切值计算坡度
      const slope = Cesium.Math.toDegrees(Math.atan(edge2 / edge1))
      // 计算每个网格的横纵向序号（供A*算法使用）
      const x = Math.floor(count / columnCount)
      const y = (x + 1) * columnCount - count - 1
      const currentGrid = squareGrid.features[count]
      currentGrid.properties = {
        slope: slope, // 坡角
        center: center.geometry.coordinates, // 中心点
        id: `${x}-${y}`,
        x: x, // 横向序号
        y: y // 纵向序号
      }
      // 计算起点和终点的二维xy坐标(turf.booleanPointInPolygon计算点是否在多边形内)
      if (!startXy.length && turf.booleanPointInPolygon(turf.point(start), polygon)) {
        startXy = { x, y }
      }
      if (!endXy.length && turf.booleanPointInPolygon(turf.point(end), polygon)) {
        endXy = { x, y }
      }
      count += 1 // count+1开始计算下一个网格的相关属性
    }

    const allList = [] // 所有网格
    const openList = [] // 待计算的网格
    squareGrid.features.forEach(({ geometry: { coordinates }, properties }) => {
      const obj = {
        x: properties.x,
        y: properties.y,
        id: properties.id,
        center: properties.center,
        slope: properties.slope,
        h: Math.sqrt(Math.pow(properties.x - endXy.x, 2) + Math.pow(properties.y - endXy.y, 2)), // 当前网格和终点距为未来预期代价
        g: null, // 当前网格和起点距离为历史代价
        f: null,
        parentId: null,
        coordinates: coordinates[0].map((item) => [item[0], item[1]])
      }

      if (properties.slope > maxSlope) {
        obj.isInCloseList = 1 // 障碍物就关闭，后面不再对该网格进行计算
      } else {
        obj.isInOpenList = 0 // 该网格为待计算网格
      }
      allList.push(obj)
    })
    const startNode = allList.find((item) => item.x === startXy.x && item.y === startXy.y)
    startNode.g = 0
    startNode.isInOpenList = 1
    // 计算好起点的代价后将它插入到openList中
    openList.push(startNode)
    let endNode = {}

    while (openList.length) {
      // 根据代价逆序排序，从openList中获取到代价最小的网格（如果有多个代价相同的点，优先选择 g 值（历史代价）较小的网格，因为这更有可能导向最短路径。）
      const sortedByF = openList.sort((a, b) => a.f - b.f)
      const minFNodes = sortedByF.filter((item) => item.f === sortedByF[0].f)
      const nodeCurrent = minFNodes.sort((a, b) => a.g - b.g)[0]
      // 获取代价最小的网格周围的网格
      const childUp = allList.find((item) => item.x === nodeCurrent.x && item.y === nodeCurrent.y - 1)
      const childRight = allList.find((item) => item.x === nodeCurrent.x + 1 && item.y === nodeCurrent.y)
      const childDown = allList.find((item) => item.x === nodeCurrent.x && item.y === nodeCurrent.y + 1)
      const childLeft = allList.find((item) => item.x === nodeCurrent.x - 1 && item.y === nodeCurrent.y)
      const childList = [childUp, childRight, childDown, childLeft]
      // 只有当左边和上边不全是障碍物，才能走左上的网格
      if (!childUp?.isInCloseList || !childLeft?.isInCloseList) {
        const childLeftUp = allList.find((item) => item.x === nodeCurrent.x - 1 && item.y === nodeCurrent.y - 1)
        childList.push(childLeftUp)
      }
      // 只有当右边和上边不全是障碍物，才能走右上的网格
      if (!childUp?.isInCloseList || !childRight?.isInCloseList) {
        const childRightUp = allList.find((item) => item.x === nodeCurrent.x + 1 && item.y === nodeCurrent.y - 1)
        childList.push(childRightUp)
      }
      // 只有当右边和下边不全是障碍物，才能走右下的网格
      if (!childDown?.isInCloseList || !childRight?.isInCloseList) {
        const childRightDown = allList.find((item) => item.x === nodeCurrent.x + 1 && item.y === nodeCurrent.y + 1)
        childList.push(childRightDown)
      }
      // 只有当左边和下边不全是障碍物，才能走左下的网格
      if (!childDown?.isInCloseList || !childLeft?.isInCloseList) {
        const childLeftDown = allList.find((item) => item.x === nodeCurrent.x - 1 && item.y === nodeCurrent.y + 1)
        childList.push(childLeftDown)
      }
      // 遍历周围网格
      for (let i = 0; i < childList.length; i++) {
        const child = childList[i]
        if (!child || child.isInCloseList === 1) {
          // 已经关闭，后面不再计算
          continue
        }
        // 计算当前网格到它子网格的距离
        const currentToChild = Math.sqrt(Math.pow(nodeCurrent.x - child.x, 2) + Math.pow(nodeCurrent.y - child.y, 2))
        if (child.isInOpenList === 0) {
          // 从来没有被计算过，现在计算它的代价
          child.parentId = nodeCurrent.id
          // 子网格的历史代价是当前网格历史代价加上当前网格到子网格的距离
          child.g = nodeCurrent.g + currentToChild
          // 子网格的未来期望代价是子网格到终点的距离
          child.h = Math.sqrt(Math.pow(child.x - endXy.x, 2) + Math.pow(child.y - endXy.y, 2))
          // 得出最终代价
          child.f = child.g + child.h
          // 设置标记，表明这个子网格已经被计算过至少一次了
          child.isInOpenList = 1
          openList.push(child) // 将这个子网格加入到待计算列表中
        } else if (child.isInOpenList === 1) {
          // 这个子网格被计算过
          //  将子网格的父级替换为当前网格重新计算代价
          const g = nodeCurrent.g + currentToChild
          // 如果更换为新父级后代价比以前小，就更新一下
          if (g < child.g) {
            child.g = g
            child.f = child.g + child.h
            child.parentId = nodeCurrent.id
          }
        }
        // 找到终点了，赋值后直接跳出
        if (child.x === endXy.x && child.y === endXy.y) {
          endNode = child

          const roadPath = []
          // 溯源出路线
          let currentNode = endNode
          while (currentNode) {
            roadPath.push(currentNode.center)
            currentNode = allList.find(({ id }) => id === currentNode.parentId)
          }
          const line = turf.lineString(roadPath)
          return roadPath
        }
      }
      if (endNode.id) {
        break
      }

      // 将当前网格从待计算列表中移除并将它关闭
      const index = openList.findIndex(({ x, y }) => x === nodeCurrent.x && y === nodeCurrent.y)
      openList[index].isInCloseList = 1
      openList.splice(index, 1)
    }
    if (!openList.length && !endNode.id) {
      globalMsg("无路可走")
    }
  })
}
