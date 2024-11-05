import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 图层

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 41.065687, lng: 123.791582, alt: 5276.9, heading: 207.3, pitch: -22.5 },
    globe: {
      depthTestAgainstTerrain: true
    }
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

  bindLayerPopup()

  // 加一些演示数据
  addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let polygonGraphic
function addDemoGraphic1() {
  const waterJson = window.waterJson // 在 ./water-data.js

  const arrData = []

  for (let index = 1, len = waterJson.length; index < len; index++) {
    const item1 = waterJson[index - 1]
    const item2 = waterJson[index]

    const arrPoints = []

    const height1 = item1.height + 15
    for (let j = 0; j < item1.points.length; j++) {
      const point = item1.points[j]
      arrPoints.push([...point, height1])
    }

    const height2 = item2.height + 15
    for (let j = item2.points.length - 1; j >= 0; j--) {
      const point = item2.points[j]
      arrPoints.push([...point, height2])
    }

    arrData.push({
      positions: arrPoints,
      style: {
        normalMap: "//data.mars3d.cn/img/textures/waterNormals.jpg", // 水正常扰动的法线图
        frequency: 8000.0, // 控制波数的数字。
        animationSpeed: 0.02, // 控制水的动画速度的数字。
        amplitude: 5.0, // 控制水波振幅的数字。
        specularIntensity: 0.8, // 控制镜面反射强度的数字。
        baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
        opacity: 0.6, // 透明度

        offsetAttribute: Cesium.GeometryOffsetAttribute.ALL, // 需要有
        offsetHeight: 0
      },
      attr: { index, height1, height2 }
    })
  }

  // 多个面对象的合并渲染。
  polygonGraphic = new mars3d.graphic.WaterCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(polygonGraphic)

  globalMsg(`共加载了${arrData.length}条断面数据`)

  setInterval(() => {
    if (polygonGraphic.isDestroy) {
      return
    }
    polygonGraphic.eachInstances((item, index) => {
      item.style.offsetHeight += 0.1
    })
    polygonGraphic.setOffsetHeight()
  }, 10)
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}
