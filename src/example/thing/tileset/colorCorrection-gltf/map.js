import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.857767, lng: 116.347782, alt: 769.8, heading: 355, pitch: -37.1 }
  }
}

let graphic

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  graphic = new mars3d.graphic.ModelPrimitive({
    name: "警车",
    position: [116.346929, 30.861947, 401.34],
    style: {
      url: "https://data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      scale: 20,
      minimumPixelSize: 50,
      heading: 90
    },
    colorCorrection: {
      brightness: 1.0
    },
    attr: { remark: "示例1" }
  })
  map.graphicLayer.addGraphic(graphic)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 是否开启特效
export function setDepthOfField(val) {
  graphic.colorCorrection.enabled = val
}
// 修改对应参数
export function setBrightness(val) {
  graphic.colorCorrection.brightness = val
}

export function setContrast(val) {
  graphic.colorCorrection.contrast = val
}

export function setHue(val) {
  graphic.colorCorrection.hue = val
}

export function setSaturation(val) {
  graphic.colorCorrection.saturation = val
}
