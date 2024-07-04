import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

const ellipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400)
Cesium.Ellipsoid.default = ellipsoid

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 0.590681, lng: -105.909459, alt: 18992377.9, heading: 3.5, pitch: -89.9 },
    contextOptions: { webgl: { alpha: true } }, // 允许透明，只能Map初始化传入 [关键代码]
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    ellipsoid: ellipsoid,
    cameraController: {
      constrainedAxis: false
    }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "月球地图",
      icon: "img/basemaps/google_vec.png",
      type: "xyz",
      url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tiles/getTiles/MoonTile/2000/jpg/{z}/{reverseY}/{x}",
      crs: "EPSG:4326",
      show: true
    }
  ],
  terrain: {
    url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tilesets/MoonTerrain/2000/",
    show: true
  },
  control: {
    baseLayerPicker: false,
    locationBar: {
      fps: true,
      template:
        "<div>海拔：{alt}米</div> <div class='hide700'>层级：{level}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div><div class='hide700'>视高：{cameraHeight}米</div>"
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
