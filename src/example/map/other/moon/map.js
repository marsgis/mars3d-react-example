import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

const ellipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400)
Cesium.Ellipsoid.default = ellipsoid

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 19.163909, lng: 140.299388, alt: 6005484, heading: 0, pitch: -90 },
    contextOptions: { webgl: { alpha: true } }, // 允许透明，只能Map初始化传入 [关键代码]
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    ellipsoid: ellipsoid,
    globe: {
      showGroundAtmosphere: false,
      enableLighting: false
    },
    cameraController: {
      constrainedAxis: false
    }
  },
  control: {
    locationBar: {
      fps: true,
      template:
        "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div class='hide700'>层级：{level}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div><div class='hide700'>视高：{cameraHeight}米</div>"
    }
  },
  terrain: {
    url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tilesets/MoonTerrain/2000/",
    show: true
  },
  basemaps: [
    {
      name: "嫦娥1号月球影像图",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "xyz",
      url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tiles/getTiles/MoonTile/2000/jpg/{z}/{reverseY}/{x}",
      crs: "EPSG:4326",
      show: true
    },
    {
      name: "嫦娥1号月球地形图",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_ter.png",
      type: "xyz",
      url: "https://moon.bao.ac.cn/gis3globleMarsMoon/tiles/getTiles/MoonDEM/2000/jpg/{z}/{reverseY}/{x}",
      crs: "EPSG:4326"
    }
  ],
  layers: [
    {
      name: "月球地名",
      type: "geojson",
      url: "//data.mars3d.cn/file/geojson/moon-name.json",
      crs: "EPSG:4326",
      symbol: {
        type: "labelP",
        styleOptions: {
          text: "{中文译名}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          scaleByDistance: true,
          scaleByDistance_near: 2000000,
          scaleByDistance_nearValue: 1,
          scaleByDistance_far: 15000000,
          scaleByDistance_farValue: 0.2,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 15000000,
          distanceDisplayCondition_near: 0
        }
      },
      popup: "all",
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

  // globalNotify("已知问题提示", `如图层未显示或服务URL访问超时，是因为数据来源方“中国科学院国家天文台”的服务存在异常。`)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
