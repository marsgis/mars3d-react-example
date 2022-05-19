import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let brightnessEffect

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.841018, lng: 117.252932, alt: 1346, heading: 38, pitch: -26 }
  },
  layers: [
    {
      type: "geojson",
      name: "道路线",
      url: "//data.mars3d.cn/file/geojson/hefei-road.json",
      symbol: {
        styleOptions: {
          materialType: "PolylineGlow",
          glowPower: 0.2,
          color: "#FF4500",
          width: 12,
          opacity: 0.8
        }
      },
      popup: "{name}",
      show: true
    },
    {
      type: "geojson",
      name: "河流(面状)",
      url: "//data.mars3d.cn/file/geojson/hefei-water.json",
      symbol: {
        type: "waterCombine",
        styleOptions: {
          normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
          frequency: 5000.0, // 控制波数的数字。
          animationSpeed: 0.05, // 控制水的动画速度的数字。
          amplitude: 9.0, // 控制水波振幅的数字。
          specularIntensity: 0.8, // 控制镜面反射强度的数字。
          baseWaterColor: "#00baff", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
          blendColor: "#00baff" // 从水中混合到非水域时使用的rgba颜色对象。
          // clampToGround: true,
        }
      },
      popup: "{name}",
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.basemap = 2017 // 切换至蓝色底图

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024,
    marsJzwStyle: true, // 打开建筑物特效（内置Shader代码）
    highlight: { type: "click", color: "#FFFF00" },
    popup: [
      { field: "objectid", name: "编号" },
      { field: "name", name: "名称" },
      { field: "height", name: "楼高", unit: "米" }
    ]
  })
  map.addLayer(tiles3dLayer)

  // 构造效果
  brightnessEffect = new mars3d.effect.BrightnessEffect()
  map.addEffect(brightnessEffect)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 亮度发生改变
export function setBrightness(value) {
  brightnessEffect.brightness = value
}

export function setBrightnessEffect(val) {
  brightnessEffect.enabled = val
}
