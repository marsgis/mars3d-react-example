import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 默认是无偏坐标系，内部已纠偏，当前示例演示偏移坐标系

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  method: {
    chinaCRS: mars3d.ChinaCRS.GCJ02 // 标识坐标系
  },
  scene: {
    center: { lat: 31.833439, lng: 117.212587, alt: 1237, heading: 0, pitch: -60 }
  },
  basemaps: [
    {
      name: "天地图影像",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d" },
        { name: "注记", type: "tdt", layer: "img_z" }
      ]
    },
    {
      name: "高德影像",
      type: "group",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/gaode_img.png",
      layers: [
        { name: "底图", type: "gaode", layer: "img_d" },
        { name: "注记", type: "gaode", layer: "img_z" }
      ],
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
  map = mapInstance // 记录首次创建的map
  map.hasTerrain = false

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 0 },
    maximumScreenSpaceError: 1,
    chinaCRS: mars3d.ChinaCRS.WGS84 // 标识坐标系，自动加偏
  })
  map.addLayer(tiles3dLayer)

  // 增加高德偏移坐标点，进行对比
  const graphic = new mars3d.graphic.PointEntity({
    position: [117.21343, 31.84052], // 从 https://lbs.amap.com/demo/jsapi-v2/example/geocoder/regeocoding 拾取
    style: {
      color: "#ff0000",
      pixelSize: 10,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      clampToGround: true,
      label: {
        text: "我是高德偏移坐标的点",
        font_size: 18,
        color: "#ff0000",
        pixelOffsetY: -30,
        clampToGround: true
      }
    },
    popup: `我是从 <a href="https://lbs.amap.com/demo/jsapi-v2/example/geocoder/regeocoding"  target="_black" >高德官网</a>拾取的高德原始偏移坐标`
  })
  map.graphicLayer.addGraphic(graphic)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
