import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 35.511619, lng: 118.029094, alt: 3260.1, heading: 356.1, pitch: -87.2 },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#363635", // 天空背景色
    contextOptions: { webgl: { antialias: mars3d.Util.isPCBroswer() } },
    logarithmicDepthBuffer: false, // 对数深度缓冲区[当热力图出现阴影体或遮挡时设置下]
    globe: {
      baseColor: "#363635", // 地球地面背景色
      showGroundAtmosphere: false,
      enableLighting: false
    },
    cameraController: {
      zoomFactor: 1.5,
      minimumZoomDistance: 0.1,
      maximumZoomDistance: 200000,
      enableCollisionDetection: false // 允许进入地下
    }
  },
  terrain: false
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const arrPoints = [
    { lat: 35.516916, lng: 118.025565, value: 1 },
    { lat: 35.511452, lng: 118.032109, value: 1 },
    { lat: 35.519563, lng: 118.032213, value: 1 },
    { lat: 35.519591, lng: 118.028906, value: 1 },
    { lat: 35.514156, lng: 118.032144, value: 1 },
    { lat: 35.508777, lng: 118.028768, value: 1 },
    { lat: 35.511509, lng: 118.025496, value: 1 },
    { lat: 35.508749, lng: 118.032075, value: 1 },
    { lat: 35.519619, lng: 118.025599, value: 1 },
    { lat: 35.516859, lng: 118.032178, value: 1 },
    { lat: 35.508805, lng: 118.025462, value: 1 },
    { lat: 35.514184, lng: 118.028837, value: 2 },
    { lat: 35.514212, lng: 118.025531, value: 2 },
    { lat: 35.511481, lng: 118.028803, value: 2 },
    { lat: 35.516888, lng: 118.028872, value: 2 }
  ]
  showHeatMap(arrPoints)

  // 显示地面对应的点，测试渲染结果的正确性
  for (let i = 0; i < arrPoints.length; i++) {
    const item = arrPoints[i]

    const graphic = new mars3d.graphic.PointPrimitive({
      position: [item.lng, item.lat, 90],
      style: {
        color: "#ffff00",
        pixelSize: 7
      }
    })
    map.graphicLayer.addGraphic(graphic)
  }
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

function showHeatMap(arrPoints) {
  // 热力图 图层
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    rectanglePadding: 2, // radius设置较大时，改下这个调大
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    min: 0,
    max: 3,
    heatStyle: {
      radius: 200, // 每个数据点的半径
      blur: 0.5, // 模糊因子,模糊系数越高，渐变就越平滑。
      minOpacity: 0.0,
      maxOpacity: 0.8, // 最大不透明度，即热图中的最高值。
      gradient: {
        0.33: "rgb(255,242,12,1)",
        0.66: "rgb(219,35,63,1)",
        1.0: "rgb(0,0,0,1)"
      }
    },
    redrawZoom: true, // 视角缩放时是否进行按新的raduis进行渲染。
    flyTo: true
  })
  map.addLayer(heatLayer)
}
