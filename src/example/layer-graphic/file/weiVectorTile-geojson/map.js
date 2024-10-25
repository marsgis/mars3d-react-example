import * as mars3d from "mars3d"
import { WeiVectorTileLayer } from "../../../../../public/lib/mars3d/thirdParty/weiVectorTile/WeiVectorTileLayer.js"


export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.689337, lng: 118.112448, alt: 762174, heading: 358, pitch: -62 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // turf v6.5升级到v7.1的使用到的API方法名称变更
  turf.polygonToLineString = turf.polygonToLine
  turf.within = turf.pointsWithinPolygon

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340000_full.json" })
    .then(function (geojson) {
      showBJXLine(geojson.features[0])
    })
    .catch(function () {
      globalAlert("showBJXLine：Json文件加载失败！")
    })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340000_full.json" })
    .then(function (geojson) {
      showGeoJsonVectorTile(geojson)
    })
    .catch(function () {
      globalAlert("showGeoJsonVectorTile：Json文件加载失败！")
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

/**
 * API文档，参考public\lib\mars3d\thirdParty\weiVectorTile\README.md
 *
 * @param {Array} geojson 获取得到的数据 数组对象
 * @returns {void} 无
 */
function showGeoJsonVectorTile(geojson) {
  const tileLayer = new WeiVectorTileLayer({
    source: geojson,
    zIndex: 20,
    removeDuplicate: false,
    allowPick: true, // 允许单击
    defaultStyle: {
      // 参考api文档的Cesium.VectorStyle类
      tileCacheSize: 200,

      fill: true, // 是否填充，仅面数据有效。
      fillColor: "rgba(0,255,255,0.1)",

      outline: true, // 是否显示边，仅面数据有效。
      outlineColor: "rgba(138,138,138,1)",
      lineWidth: 2,

      showMaker: false,

      showCenterLabel: true, // 是否显示文本，仅对线和面数据有效
      centerLabelPropertyName: "name",
      fontColor: "rgba(255,255,255,1)",
      fontSize: 23,
      fontFamily: "楷体",
      labelOffsetX: -10,
      labelOffsetY: -5
    },
    minimumLevel: 1,
    maximumLevel: 20,
    simplify: false,
    styleFilter: function (feature, style, x, y, level) {
      if (level < 6) {
        style.fontSize = level * 2
      } else {
        style.fontSize = 23
      }

      if (feature.properties && feature.properties.name && feature.properties.name === "合肥市") {
        style.fillColor = Cesium.Color.YELLOW.withAlpha(0.2)
      }
      return style
    },
    // 以下为mars3d参数,API参考http://mars3d.cn/api/BaseTileLayer.html#.ConstructorOptions
    hasToGraphic: true,
    highlight: {
      crs: mars3d.CRS.EPSG4326, // 数据坐标系与图层坐标系不一致时，可以这样额外指定
      clampToGround: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9"
    },
    popup: "all"
  })
  map.addLayer(tileLayer)

  // 如果图层加 clampToTileset: true 参数存在底图异常时加下面代码
  // map.basemap.reload()

  tileLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

function showBJXLine(feature) {
  // 缓冲区
  let bufferedOuter = turf.buffer(feature, 2000, {
    units: "meters"
  })
  let bufferedInner = turf.buffer(feature, 1000, {
    units: "meters"
  })

  bufferedInner = turf.difference(turf.featureCollection([bufferedInner, feature]))
  bufferedOuter = turf.difference(turf.featureCollection([bufferedOuter, bufferedInner]))

  bufferedInner = turf.featureCollection([bufferedInner]) // turf v7.1
  bufferedOuter = turf.featureCollection([bufferedOuter])

  const tileLayer = new WeiVectorTileLayer({
    source: bufferedOuter,
    zIndex: 99,
    removeDuplicate: false,
    defaultStyle: {
      outlineColor: "rgba(209,204,226,1)",
      lineWidth: 2,
      outline: true,
      fill: true,
      fillColor: "rgba(209,204,226,1)",
      tileCacheSize: 200,
      showMaker: false,
      showCenterLabel: false
    },
    maximumLevel: 20,
    minimumLevel: 5,
    simplify: false
  })
  map.addLayer(tileLayer)

  const tileLayer2 = new WeiVectorTileLayer({
    source: bufferedInner,
    zIndex: 99,
    removeDuplicate: false,
    defaultStyle: {
      outlineColor: "rgba(185,169,199,1)",
      lineWidth: 2,
      outline: true,
      fill: true,
      fillColor: "rgba(185,169,199,1)",
      tileCacheSize: 200,
      showMaker: false,
      showCenterLabel: false
    },
    maximumLevel: 20,
    minimumLevel: 5,
    simplify: false
  })
  map.addLayer(tileLayer2)
}
