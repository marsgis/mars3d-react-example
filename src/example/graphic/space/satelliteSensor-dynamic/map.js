import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 11.135847, lng: 127.745201, alt: 24250944, heading: 53, pitch: -90 },
    clock: {
      currentTime: "2021-01-01T11:55:00Z",
      multiplier: 150 // 速度
    },
    cameraController: {
      maximumZoomDistance: 9000000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { style: { top: "10px", right: "5px" } }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map  map.control.toolbar.container.style.bottom = "55px"// 修改toolbar控件的样式

  addGraphicLayer()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该数据是由后端计算返回的轨道信息
  const wxdata = [
    {
      time: "2021-01-01T11:55:00Z",
      lng: -134.648939681369,
      lat: -16.7002098082909,
      alt: 1116015.99646736
    },
    {
      time: "2021-01-01T11:58:20Z",
      lng: -136.899721614564,
      lat: -5.57109779324382,
      alt: 1114660.42260167
    },
    {
      time: "2021-01-01T12:01:40Z",
      lng: -139.097755346946,
      lat: 5.5661675014342,
      alt: 1114652.53771041
    },
    {
      time: "2021-01-01T12:05:00Z",
      lng: -141.348494748721,
      lat: 16.6953271278176,
      alt: 1115992.62270236
    },
    {
      time: "2021-01-01T12:08:20Z",
      lng: -143.774623333805,
      lat: 27.7998266828718,
      alt: 1118477.29262629
    },
    {
      time: "2021-01-01T12:11:40Z",
      lng: -146.56364947549,
      lat: 38.8612791867078,
      alt: 1121731.48352323
    },
    {
      time: "2021-01-01T12:15:00Z",
      lng: -150.074587947037,
      lat: 49.8538696199919,
      alt: 1125266.75027392
    },
    {
      time: "2021-01-01T12:18:20Z",
      lng: -155.164247872234,
      lat: 60.7243205344318,
      alt: 1128555.88185048
    },
    {
      time: "2021-01-01T12:21:40Z",
      lng: -164.565295557077,
      lat: 71.3021698947674,
      alt: 1131111.78312013
    },
    {
      time: "2021-01-01T12:25:00Z",
      lng: 168.08311253827,
      lat: 80.6216347342535,
      alt: 1132558.81749868
    },
    {
      time: "2021-01-01T12:28:20Z",
      lng: 90.2490230895946,
      lat: 81.5572161531476,
      alt: 1132686.79200749
    },
    {
      time: "2021-01-01T12:31:40Z",
      lng: 57.1447486006726,
      lat: 72.6931112200722,
      alt: 1131480.71852334
    },
    {
      time: "2021-01-01T12:35:00Z",
      lng: 46.6265974503472,
      lat: 62.1897990251119,
      alt: 1129122.78290078
    },
    {
      time: "2021-01-01T12:38:20Z",
      lng: 41.1892143509244,
      lat: 51.3446936437554,
      alt: 1125966.29999715
    },
    {
      time: "2021-01-01T12:41:40Z",
      lng: 37.5323471372029,
      lat: 40.3652635518961,
      alt: 1122484.77649625
    }
  ]

  // 绘制轨道
  const graphic = new mars3d.graphic.PathEntity({
    position: {
      type: "time", // 时序动态坐标
      list: wxdata,
      timeField: "time",
      interpolation: true,
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
    },
    style: {
      leadTime: 0,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      },
      width: 10
    },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    }
  })
  graphicLayer.addGraphic(graphic)

  // 视锥体 展示
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: graphic.property,
    orientation: graphic.orientation,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      pitch: 0,
      roll: 0,
      color: "rgba(110,245,0,0.5)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor)
}
