import * as mars3d from "mars3d"

export let map
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并)
export const mapOptions = {
  scene: {
    center: { lat: 10.127557, lng: 111.279453, alt: 8584956, heading: 0, pitch: -74.7 },
    showSkyAtmosphere: false, // 关闭球周边的白色轮廓 map.scene.skyAtmosphere = false
    fog: false,
    fxaa: false,
    globe: {
      showGroundAtmosphere: false // 关闭大气（球表面白蒙蒙的效果）
    }
  },
  terrain: {
    show: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 添加矢量图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addControlCenter()
}

function addControlCenter() {
  const controlCenters = [
    { position: [116.10981, 39.020859], label: "控制中心1" },
    { position: [106.79559, 29.68831], label: "控制中心2" }
  ]
  for (let index = 0; index < controlCenters.length; index++) {
    const controlCenterItem = controlCenters[index]
    const model = new mars3d.graphic.BillboardPrimitive({
      position: controlCenterItem.position,
      style: {
        image: "https://data.mars3d.cn/img/marker/oc-center.png",
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        label: {
          text: controlCenterItem.label,
          color: "#fff",
          pixelOffsetX: 0,
          pixelOffsetY: 20,
          font: "bold 16px MicroSoft YaHei"
        }
      }
    })
    graphicLayer.addGraphic(model)

    const messageStations = [
      { position: [130.403, 46.772], label: "信号站1" },
      { position: [108.898, 34.932], label: "信号站2" },
      { position: [86.232, 41.552], label: "信号站3" },
      { position: [109.796, 19.599], label: "信号站4" },
      { position: [75.98976, 39.47042], label: "信号站5" }
    ]
    for (let i = 0; i < messageStations.length; i++) {
      const messageStationItem = messageStations[i]
      const startPoint = Cesium.Cartesian3.fromDegrees(...controlCenterItem.position)
      const endPoint = Cesium.Cartesian3.fromDegrees(...messageStationItem.position)
      const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

      const messageLine = new mars3d.graphic.PolylinePrimitive({
        positions,
        style: {
          width: 2,
          materialType: mars3d.MaterialType.LineFlow,
          materialOptions: {
            image: "https://data.mars3d.cn/img/textures/line-gradient.png",
            speed: 20
          }
        }
      })
      graphicLayer.addGraphic(messageLine)

      const model = new mars3d.graphic.BillboardPrimitive({
        position: messageStationItem.position,
        style: {
          image: "https://data.mars3d.cn/img/marker/receiver.png",
          scale: 0.8,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          label: {
            text: messageStationItem.label,
            font: "bold 16px MicroSoft YaHei",
            color: "#fff",
            pixelOffsetX: 0,
            pixelOffsetY: 20
          }
        }
      })
      graphicLayer.addGraphic(model)
    }
  }
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
