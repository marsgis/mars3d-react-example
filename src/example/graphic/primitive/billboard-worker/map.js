// AQI来源：https://aqicn.org

import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

let lastExtent = null
let bWorking = false
let currentData

let startTimestamp, endTimestamp
let timeout = 1000
let worker

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.251743, lng: 107.045599, alt: 553192, heading: 0, pitch: -51 }
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

  globalNotify("已知问题提示", `(1) AQI来源于第三方服务，目前已无法访问`)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定Popup单击弹窗
  graphicLayer.bindPopup(function (event, callback) {
    const item = event.graphic.attr
    if (!item) {
      return false
    }
    return mars3d.Util.getTemplateHtml({
      title: "AQI",
      template: [
        { field: "city", name: "城市" },
        { field: "utime", name: "时间" },
        { field: "aqi", name: "AQI" },
        { field: "level", name: "质量" },
        { field: "influence", name: "影响" },
        { field: "suggestion", name: "建议" }
      ],
      attr: item
    })
  })

  map.on(mars3d.EventType.cameraChanged, onMap_cameraChanged)
  onMap_cameraChanged()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function onMap_cameraChanged() {
  endTimestamp = new Date().getTime()
  if (bWorking === false) {
    const extent = map.getExtent()
    const bbox = extent.ymin + "," + extent.xmin + "," + extent.ymax + "," + extent.xmax
    if (bbox !== lastExtent) {
      startWorker(bbox)
      lastExtent = bbox
    }
  } else if (endTimestamp - startTimestamp > timeout) {
    bWorking = false
    timeout += 1000
    worker.terminate() // 终止 web worker
  }
}

function startWorker(strBounds) {
  startTimestamp = endTimestamp = new Date().getTime()
  worker = new Worker(window.currentPath + `aqiWorker.js`) // currentPath为当前目录，内置在示例框架中

  // 主线程调用worker.postMessage()方法，向 Worker 发消息。
  worker.postMessage({
    bounds: strBounds
  })
  bWorking = true

  worker.onmessage = function (event) {
    // Worker返回的结果。
    currentData = event.data.entityTable
    const currTime = event.data.currTime
    if (currentData.length !== 0 && currTime > startTimestamp) {
      createGraphics(currentData)
    }

    bWorking = false
    worker.terminate() // 终止 web worker
  }
}

const colorRamp = new mars3d.ColorRamp({
  steps: [25, 75, 125, 175, 250, 400],
  colors: ["rgb(0, 228, 0)", "rgb(256, 256, 0)", "rgb(256, 126, 0)", "rgb(256, 0, 0)", "rgb(153, 0, 76)", "rgb(126, 0, 35)"]
})

function createGraphics(currentData) {
  graphicLayer.clear()
  console.log("加载数据", currentData)

  for (let i = currentData.length - 1; i >= 0; i--) {
    const item = currentData[i]

    const graphic = new mars3d.graphic.BillboardPrimitive({
      id: item.x,
      name: item.city,
      position: [item.lon, item.lat],
      style: {
        image: mars3d.Util.getCircleImage(item.aqi, {
          color: colorRamp.getColor(item.aqi),
          radius: 25
        }),
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 900000, 0.3)
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)
  }
}
