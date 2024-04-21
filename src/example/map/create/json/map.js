import * as mars3d from "mars3d"
export let map

function initMap() {
  // 读取 config.json 配置文件
  return mars3d.Util.fetchJson({ url: "config/config.json" }).then(function (mapOptions) {
    if (mapOptions.map3d) {
      mapOptions = mapOptions.map3d
    }
    console.log("读取 config.json 配置文件完成", mapOptions) // 打印测试信息

    // 创建三维地球场景
    map = new mars3d.Map("mars3dContainer", mapOptions)

    // 打印测试信息
    console.log("mars3d的Map主对象构造完成", map)
    console.log("其中Cesium原生的Cesium.Viewer为", map.viewer)
    return map
  })
}
