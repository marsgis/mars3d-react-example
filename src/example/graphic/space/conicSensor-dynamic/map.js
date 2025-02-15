import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 53.285266, lng: 142.68078, alt: 17309707, heading: 45, pitch: -83 },
    clock: {
      currentTime: "2021-01-01T12:08:20Z",
      multiplier: 60 // 速度
    },
    cameraController: {
      maximumZoomDistance: 9000000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件,
    compass: { style: { top: "10px", right: "5px" } }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.control.toolbar.container.style.bottom = "55px" // 修改toolbar控件的样式

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该数据是由后端计算返回的轨道信息
  const wxkjx = [
    {
      time: "2021-01-01T12:08:20Z",
      x: -143.774623333805,
      y: 27.7998266828718,
      z: 1118477.29262629
    },
    {
      time: "2021-01-01T12:11:40Z",
      x: -146.56364947549,
      y: 38.8612791867078,
      z: 1121731.48352323
    },
    {
      time: "2021-01-01T12:15:00Z",
      x: -150.074587947037,
      y: 49.8538696199919,
      z: 1125266.75027392
    },
    {
      time: "2021-01-01T12:18:20Z",
      x: -155.164247872234,
      y: 60.7243205344318,
      z: 1128555.88185048
    },
    {
      time: "2021-01-01T12:21:40Z",
      x: -164.565295557077,
      y: 71.3021698947674,
      z: 1131111.78312013
    },
    {
      time: "2021-01-01T12:25:00Z",
      x: 168.08311253827,
      y: 80.6216347342535,
      z: 1132558.81749868
    }
  ]

  const list = []
  for (let z = 0; z < wxkjx.length; z++) {
    const item = wxkjx[z]
    // 添加每一个链接点的信息，到达的时间以及坐标位置
    const position = { lng: item.x, lat: item.y, alt: item.z, currTime: item.time }
    list.push(position)
  }

  // 视锥体 展示
  const conicSensor = new mars3d.graphic.ConicSensor({
    position: {
      type: "time", // 时序动态坐标
      list: list,
      timeField: "currTime",
      interpolation: true,
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
    },
    style: {
      angle: 15,
      length: 950000,
      color: "rgba(255,0,0,0.4)",
      outlineColor: "rgba(255,255,255,0.9)"
    }
  })
  graphicLayer.addGraphic(conicSensor)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
