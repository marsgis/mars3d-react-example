import * as mars3d from "mars3d"
import { Shp2JsonLayer } from "./Shp2JsonLayer.js"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.614035, lng: 117.292184, alt: 25686, heading: 0, pitch: -44 }
  }
  // layers: [
  //   {
  //     name: "高程点",
  //     type: "geojson_shp",
  //     url: "http://data.mars3d.cn/file/shp/yuexi_point.zip",
  //     symbol: {
  //       type: "pointP",
  //       merge: true,
  //       styleOptions: {
  //         color: "#ff0000",
  //         pixelSize: 6,
  //         addHeight: 500
  //       }
  //     },
  //     popup: "all"
  //   }
  // ]
}

export const treeEvent = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  shoXZM()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// flyTo至目标
export function flyToEntity(entity) {
  map.flyTo(entity)
}

function removeLayer() {
  map.trackedEntity = null
  if (graphicLayer) {
    map.removeLayer(graphicLayer, true)
    graphicLayer = null
  }
}

// 示例：乡镇面
export function shoXZM() {
  removeLayer()

  graphicLayer = new Shp2JsonLayer({
    url: "http://data.mars3d.cn/file/shp/hefei_xz.zip",
    encoding: "utf-8",
    simplify: { tolerance: 0.0001 },
    symbol: {
      type: "polygon",
      styleOptions: {
        fill: true,
        randomColor: true, // 随机色
        opacity: 0.3,
        clampToGround: false,
        outline: true,
        outlineStyle: {
          width: 3,
          color: "#FED976"
        },
        // 高亮时的样式
        highlight: {
          opacity: 0.6,
          outline: true,
          outlineStyle: {
            width: 10,
            color: "#08F3FE",
            addHeight: 10
          }
        }
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
    treeEvent.fire("refTree")
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}

// 示例：高程点
export function shoGCD() {
  removeLayer()

  graphicLayer = new Shp2JsonLayer({
    url: "http://data.mars3d.cn/file/shp/yuexi_point.zip",
    symbol: {
      type: "pointP",
      merge: true,
      styleOptions: {
        color: "#ff0000",
        pixelSize: 6,
        addHeight: 500
      }
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(graphicLayer)

  // 绑定事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
    treeEvent.fire("refTree")
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了图层", event)
  })
}



export function getGraphicsTree(options) {
  return graphicLayer.getGraphicsTree(options)
}

export function getGraphicById(id) {
  return graphicLayer.getGraphicById(id)
}
