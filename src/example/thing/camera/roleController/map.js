import * as mars3d from "mars3d"
import { RunModelPrimitive } from "./RunModelPrimitive.js"

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.839441, lng: 117.153132, alt: 857.4, heading: 5, pitch: -28.3 }
  }
}

let runModel // 控制器

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  runModel = new RunModelPrimitive({
    position: [117.154908, 31.853166, 40.3],
    style: {
      url: "https://data.mars3d.cn/gltf/mars/man/running.glb",
      minimumPixelSize: 100,
      animation: "run"
    },
    speed: 2
  })
  graphicLayer.addGraphic(runModel)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function setEnabled(val) {
  runModel.show = val
}

export function drawPoint() {
  map.setCursor("crosshair")

  map.once("click", (event) => {
    map.setCursor("default")

    runModel.position = event.cartesian
  })
}
