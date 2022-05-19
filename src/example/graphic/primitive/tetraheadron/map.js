import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.815928, lng: 117.21376, alt: 683, heading: 61, pitch: -24 }
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

  map.basemap = 2017 // 切换至蓝色底图

  // 添加参考三维模型;
  // const tiles3dLayer = new mars3d.layer.TilesetLayer({
  //   name: "合肥市建筑物",
  //   url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json"
  // })
  // map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphic1(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.222132, 31.822729, 250),
    style: {
      width: 25,
      height: 40,
      color: "rgba(200,200,0,0.7)",
      moveHeight: 50
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

export function addDemoGraphic2(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.227581, 31.821564, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      moveHeight: 40
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}

export function addDemoGraphic3(graphicLayer) {
  const tetrahedronPrimitive = new mars3d.graphic.Tetrahedron({
    position: Cesium.Cartesian3.fromDegrees(117.223923, 31.81897, 250),
    style: {
      width: 20,
      height: 30,
      color: new Cesium.Color(0.8, 0.8, 0, 0.8),
      animation: true,
      moveHeight: 30,
      moveDuration: 1,
      rotationAngle: 1
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(tetrahedronPrimitive)
}
