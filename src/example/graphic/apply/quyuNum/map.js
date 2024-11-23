import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 21.748008, lng: 113.230533, alt: 699712.9, heading: 350.3, pitch: -52 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: " #120f44", // 天空背景色
    globe: {
      baseColor: "#120f44", // 地球地面背景色
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: false
  },
  basemaps: [],
  layers: []
}

// 行政区划编码(全国统一，可以按需修改其他省市县编码)
const xzqhCode = "430000"

const wallHeight = 40000 // 墙高

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const borderWall = new mars3d.layer.GeoJsonLayer({
    name: "边界墙",
    url: `//data.mars3d.cn/file/geojson/areas/${xzqhCode}.json`,
    symbol: {
      type: "wallP",
      styleOptions: {
        setHeight: -wallHeight,
        diffHeight: wallHeight, // 墙高
        materialType: mars3d.MaterialType.Image2,
        materialOptions: {
          image: "//data.mars3d.cn/img/textures/fence-top.png",
          color: "#4881A7"
        }
      }
    }
  })
  map.addLayer(borderWall)

  addGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

/**
 * 添加矢量数据
 *polygon面 PolylineEntity线  光锥体  和 LED数字显示
 * @returns {void} 无
 */
async function addGraphics() {
  const url = `//data.mars3d.cn/file/geojson/areas/${xzqhCode}_full.json`
  const geojson = await mars3d.Util.fetchJson({ url: url })

  const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!item.isMultiMax) {
      continue
    }
    // polygon面
    const polygonEntity = new mars3d.graphic.PolygonEntity({
      positions: item.positions,
      style: {
        fill: true,
        color: "#4881a7",
        opacity: 0.5,
        outline: true,
        outlineStyle: {
          color: "rgba(255,255,255,0.5)",
          width: 1
        },
        // 高亮时的样式
        highlight: {
          opacity: 0.9,
          outlineStyle: {
            width: 2
          }
        }
      }
    })
    graphicLayer.addGraphic(polygonEntity)

    // 中心点
    const center = item.attr.centroid

    // 光锥体
    const coneGlow = new mars3d.graphic.LightCone({
      position: center,
      style: {
        radius: wallHeight * 0.1,
        height: wallHeight
      }
    })
    graphicLayer.addGraphic(coneGlow)

    // LED数字显示
    const number = Math.floor(Math.random() * (400 - 300 + 1) + 300) // 随机数字
    const graphic = new mars3d.graphic.DivGraphic({
      position: [center[0], center[1], wallHeight],
      style: {
        html: `<div class ="coneNum">${item.attr.name}:${number}</div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000),
        scaleByDistance: new Cesium.NearFarScalar(500000, 1.0, 1000000, 0.5)
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}
