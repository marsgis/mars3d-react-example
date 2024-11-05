import * as mars3d from "mars3d"

export const mapOptions = {
  scene: {
    center: { lat: 31.967015, lng: 117.316406, alt: 9150, heading: 206, pitch: -42 },
    fxaa: true
  }
}

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let pointLayer

const pointStyle = {
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  scale: 1,
  scaleByDistance: true,
  scaleByDistance_far: 20000,
  scaleByDistance_farValue: 0.7,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  clampToGround: true
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  pointLayer = new mars3d.layer.GeoJsonLayer({
    name: "体育设施点",
    url: "//data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        ...pointStyle,
        image: "//data.mars3d.cn/img/marker/mark-blue.png"
      }
    },
    popup: "{项目名称}",
    zIndex: 10
  })
  map.addLayer(pointLayer)

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    updateBuffer(e.graphic)
  })

  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    updateBuffer(e.graphic)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function drawPoint() {
  deleteAll()

  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#ffff00"
    }
  })
}

export function drawPolyline() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#ffff00",
      width: 3,
      clampToGround: true
    }
  })
}

export function drawPolygon() {
  deleteAll()

  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      outline: true,
      outlineColor: "#f0ce22",
      outlineWidth: 4,
      opacity: 0.5,
      clampToGround: true
    }
  })
}

export function deleteAll() {
  graphicLayer.clear()
  map.graphicLayer.clear()
  lastgeojson = null
  removeSelect()
}

let width
export function radiusChange(val) {
  width = val * 1000 // km
  if (lastgeojson) {
    updateBuffer()
  }
}

let lastgeojson
function updateBuffer(graphic) {
  let buffere
  try {
    const geojson = graphic ? graphic.toGeoJSON() : lastgeojson
    geojson.properties = {}

    buffere = mars3d.PolyUtil.buffer(geojson, width)

    lastgeojson = geojson
  } catch (e) {
    console.log("缓冲分析异常", e)
  }
  if (!buffere) {
    return
  }

  const graphicsOptions = mars3d.Util.geoJsonToGraphics(buffere, {
    type: "polygon",
    style: {
      color: "rgba(255,0,0,0.4)",
      clampToGround: true
    }
  })[0]

  map.graphicLayer.clear()

  const drawGraphic = map.graphicLayer.addGraphic(graphicsOptions)
  updateSelect(drawGraphic)
}

let selectGraphic = []
function updateSelect(drawGraphic) {
  removeSelect()
  if (!drawGraphic) {
    return
  }

  pointLayer.eachGraphic((graphic) => {
    const position = graphic.positionShow

    const isInArea = drawGraphic.isInPoly(position)
    if (isInArea) {
      graphic.setStyle({
        image: "//data.mars3d.cn/img/marker/mark-red.png"
      })
      selectGraphic.push(graphic)
    }
  })
}

export function removeSelect() {
  for (let i = 0; i < selectGraphic.length; i++) {
    const graphic = selectGraphic[i]
    graphic.setStyle({
      image: "//data.mars3d.cn/img/marker/mark-blue.png"
    })
  }
  selectGraphic = []
}
