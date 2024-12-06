import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 23.816631, lng: 111.688366, alt: 4605984, heading: 355, pitch: -80 }
  },
  // basemaps: [
  //   {
  //     name: "天地图影像",
  //     icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
  //     type: "group",
  //     layers: [
  //       { name: "底图", type: "tdt", layer: "img_d" },
  //       { name: "注记", type: "tdt", layer: "img_z" }
  //     ],
  //     show: true
  //   },
  //   {
  //     name: "三维地名",
  //     icon: "//data.mars3d.cn/img/thumbnail/basemap/bd-img.png",
  //     type: "group",
  //     layers: [
  //       { name: "底图", type: "tdt", layer: "img_d", crs: "EPSG:3857" },
  //       { name: "注记", type: "tdt_dm", label: { pixelOffsetY: -20, visibleDepth: false } }
  //     ]
  //   }
  // ],
  // 方式1：在创建地球前的传参中配置 terrain 参数[目前1个球只支持1个地形服务]
  terrain: {
    type: "tdt",
    url: "https://t{s}.tianditu.gov.cn/mapservice/swdx",
    key: mars3d.Token.tianditu,
    subdomains: "01234567",
    show: true
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  globalNotify("已知问题提示", `(1) 使用国家测绘局天地图在线地名服务。(2) 如未显示地名，可能是服务不稳定造成`)

  // 天地图 三维地名服务图层
  const tdtDmLayer = new mars3d.layer.TdtDmLayer({
    key: mars3d.Token.tianditu,
    label: {
      pixelOffsetY: -20,
      visibleDepth: false
    }
  })
  map.addLayer(tdtDmLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
