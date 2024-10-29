import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

export const mapOptions = {
  scene: {
    center: { lat: 31.794547, lng: 117.21215, alt: 1672, heading: 18, pitch: -33 }
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // Cesium 对资源访问的做了统一的接口，全局无论加载影像、矢量、地形、模型都是 需要通过 Cesium.Resource 模块进行统一请求。 这里通过插件的方式实现了资源请求期间，存取 indexDB 缓存的判断。
  // eslint-disable-next-line no-undef
  const OfflineCache = CesiumNetworkPlug.OfflineCacheController

  // ① 全局缓存
  // OfflineCache.ruleList.add("*")
  // ② 对指定地址的 瓦片图层 缓存
  OfflineCache.ruleList.add("http://data.mars3d.cn/")
  OfflineCache.ruleList.add("https://gac-geo.googlecnapps.cn/")

  // CesiumNetworkPlug插件内的数据加密功能 请参考：https://github.com/WangShan010/CesiumNetworkPlug

  globalMsg("请 F12 查看 network 请求情况")


  // 加模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 1,
    maxMemory: 2048, // 最大缓存内存大小(MB)
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
