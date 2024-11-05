import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.73204, lng: 117.286568, alt: 50785, heading: 359, pitch: -76 }
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

  // 构造鹰眼地图
  const overviewMap = new mars3d.control.OverviewMap({
    basemap: {
      name: "天地图电子",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d" },
        { name: "注记", type: "tdt", layer: "vec_z" }
      ]
    },
    scene: {
      sceneMode: Cesium.SceneMode.SCENE3D
    },
    flyToOptions: {
      scale: 2.5
    },
    polygon: {
      color: "#fecd78",
      opacity: 0.2,
      outline: 1,
      outlineColor: "#ff7800"
    },
    style: {
      right: "5px",
      top: "5px",
      width: "200px",
      height: "150px"
    }
  })
  map.addControl(overviewMap)

  // 给鹰眼小地图添加一个矢量对象
  addGraphicToOverviewMap(overviewMap)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addGraphicToOverviewMap(overviewMap) {
  const mapEx = overviewMap.smallMap // 也是 mars3d.Map 对象

  const graphic = new mars3d.graphic.BillboardEntity({
    position: new Cesium.CallbackProperty(() => {
      return overviewMap.center
    }, false),
    style: {
      image: "//data.mars3d.cn/img/marker/street2.png",
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      rotation: new Cesium.CallbackProperty(() => {
        return Cesium.Math.toRadians(360 - Cesium.Math.toDegrees(map.camera.heading))
      }, false)
    }
  })
  mapEx.graphicLayer.addGraphic(graphic)
}
