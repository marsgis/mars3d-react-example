import * as mars3d from "mars3d"

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.804378, lng: 117.139548, alt: 246.7, heading: 1.1, pitch: -78 }
  }
}

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数

let roaming

export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "https://data.mars3d.cn/3dtiles/max-ditiezhan/tileset.json",
    position: { lat: 31.80001, lng: 117.139776, alt: -69 }, // 原始的
    // position: { lng: 117.139776, lat: 31.80001, alt: -69 }, // 改为到合肥的
    maximumScreenSpaceError: 1,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)
  const viewPoints = [
    {
      id: 0,
      name: "地铁口",
      lat: 31.8043595,
      lng: 117.1390079,
      alt: 21.7,
      heading: 37.4,
      pitch: -7.1,
      duration: 2
    },
    {
      id: 1,
      name: "电梯口1",
      lat: 31.8043744,
      lng: 117.1390198,
      alt: 21.7,
      heading: 37.4,
      pitch: -5.3,
      duration: 2
    },
    {
      id: 2,
      name: "电梯口2",
      lat: 31.8044004,
      lng: 117.1390431,
      alt: 20.6,
      heading: 41.6,
      pitch: -30.5,
      duration: 5
    },
    {
      id: 3,
      name: "电梯底部",
      lat: 31.8044992,
      lng: 117.1391385,
      alt: 11.4,
      heading: 38.9,
      pitch: -34.6,
      duration: 2
    },
    {
      id: 4,
      name: "出电梯",
      lat: 31.8045325,
      lng: 117.1391576,
      alt: 11,
      heading: 38.3,
      pitch: -7.4,
      duration: 2
    },
    {
      id: 5,
      name: "拐角1",
      lat: 31.8045781,
      lng: 117.1391907,
      alt: 11,
      heading: 36.1,
      pitch: -2,
      duration: 1.8
    },
    {
      id: 6,
      name: "拐角2",
      lat: 31.8046152,
      lng: 117.1392294,
      alt: 11,
      heading: 67.4,
      pitch: 4.3,
      duration: 8.5
    },
    {
      id: 7,
      name: "拐角3",
      lat: 31.8047824,
      lng: 117.1398351,
      alt: 11,
      heading: 88.6,
      pitch: 7.5,
      duration: 2.6
    },
    {
      id: 8,
      name: "拐角4",
      lat: 31.8047829,
      lng: 117.1400084,
      alt: 11,
      heading: 0,
      pitch: 8.4,
      duration: 7.2
    },
    {
      id: 9,
      name: "拐角5",
      lat: 31.8049582,
      lng: 117.1400149,
      alt: 11,
      heading: 1.3,
      pitch: -0.8,
      duration: 4
    },
    {
      id: 10,
      name: "准备拐进电梯1",
      lat: 31.8050997,
      lng: 117.1399994,
      alt: 11,
      heading: 94.1,
      pitch: 5,
      duration: 3.5
    },
    {
      id: 11,
      name: "准备拐进电梯2",
      lat: 31.8051071,
      lng: 117.1400715,
      alt: 11,
      heading: 176.9,
      pitch: -1.4,
      duration: 3.6
    },
    {
      id: 12,
      name: "电梯口1",
      lat: 31.8050516,
      lng: 117.1400719,
      alt: 11,
      heading: 181.3,
      pitch: -1.8,
      duration: 2
    },
    {
      id: 13,
      name: "电梯口2",
      lat: 31.805033,
      lng: 117.1400721,
      alt: 10.7,
      heading: 176.9,
      pitch: -23.1,
      duration: 4
    },
    {
      id: 14,
      name: "电梯口3",
      lat: 31.8049681,
      lng: 117.1400714,
      alt: 6.7,
      heading: 180.8,
      pitch: -38,
      duration: 2
    },
    {
      id: 15,
      name: "出电梯",
      lat: 31.804955,
      lng: 117.1400711,
      alt: 5.9,
      heading: 177.7,
      pitch: 2.1,
      duration: 2.6
    },
    {
      id: 16,
      name: "进地铁1",
      lat: 31.8048798,
      lng: 117.140072,
      alt: 5.9,
      heading: 189,
      pitch: 1.6,
      duration: 2.6
    },
    {
      id: 17,
      name: "进地铁2",
      lat: 31.8048056,
      lng: 117.1400772,
      alt: 5.9,
      heading: 272.8,
      pitch: -4.8,
      duration: 2.6
    }
  ]

  // eslint-disable-next-line no-undef
  roaming = new TweensRoaming({
    points: viewPoints
  })
  map.addThing(roaming)

  showCameraRoute(viewPoints) // 显示相机点的位置方向和路线，便于对比查看
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function start() {
  console.log("开始")
  roaming.start()
}

export function pause() {
  console.log("暂停")
  roaming.pause()
}
export function resume() {
  console.log("继续")
  roaming.resume()
}
export function stop() {
  console.log("停止")
  roaming.stop()
}

// 显示相机点的位置方向和路线，便于对比查看
function showCameraRoute(viewPoints) {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const points = []
  for (let i = 0; i < viewPoints.length; i++) {
    const item = viewPoints[i]
    const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, item.alt)
    points.push(position)

    // 文本
    const graphic = new mars3d.graphic.LabelPrimitive({
      position,
      style: {
        text: i,
        font_size: 14
      }
    })
    graphicLayer.addGraphic(graphic)

    // 相机角度示意
    const camera = new Cesium.Camera(map.scene)
    camera.position = position
    camera.frustum.aspectRatio = 1
    camera.frustum.fov = Cesium.Math.toRadians(45)
    camera.frustum.near = 0.01
    camera.frustum.far = 1
    camera.setView({
      destination: position,
      orientation: { heading: Cesium.Math.toRadians(item.heading), pitch: Cesium.Math.toRadians(item.pitch) }
    })

    const frustumPrimitive = new mars3d.graphic.FrustumPrimitive({
      position,
      camera,
      style: {
        angle: 40,
        distance: 0.5,
        fill: false,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 1.0
      }
    })
    graphicLayer.addGraphic(frustumPrimitive)
  }

  // 线
  const graphicLine = new mars3d.graphic.PolylinePrimitive({
    positions: points,
    style: {
      width: 1,
      color: "rgba(200,200,200,0.3)"
    }
  })
  graphicLayer.addGraphic(graphicLine)
}
