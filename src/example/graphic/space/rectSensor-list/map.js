import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 12.845055, lng: 112.931363, alt: 24286797, heading: 3, pitch: -90 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    globe: { enableLighting: true },
    clock: {
      multiplier: 1 // 速度
    }
  },
  terrain: false,
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { style: { top: "10px", right: "5px" } }
  },
  layers: [
    {
      name: "夜晚图片",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_night.png",
      type: "image",
      url: "https://data.mars3d.cn/img/map/world/night2.jpg",
      dayAlpha: 0.0,
      nightAlpha: 1.0,
      brightness: 3.5,
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.control.toolbar.container.style.bottom = "55px" // 修改toolbar控件的样式

  const tle_arr = [
    "COSMOS 33918U",
    "1 33918U 93036DX  21197.87508339  .00001232  00000-0  17625-3 0  9990",
    "2 33918  74.0595 343.7064 0054912  74.2148  45.2906 14.76790626663155",
    "COSMOS 33919U",
    "1 33919U 93036DY  21197.91197918  .00000904  00000-0  20362-3 0  9990",
    "2 33919  74.0505 161.6299 0033213 276.5546  83.1838 14.57578432657116",
    "COSMOS 33920U",
    "1 33920U 93036DZ  21197.66738688  .00000502  00000-0  17722-3 0  9999",
    "2 33920  74.0698  46.6248 0055820 106.9911 253.7370 14.36347026649192",
    "COSMOS 33921U",
    "1 33921U 93036EA  21197.38565197  .00009006  00000-0  82577-3 0  9990",
    "2 33921  74.0006 290.6759 0010303  43.2289 316.9701 14.94971510663519",
    "COSMOS 33922U",
    "1 33922U 93036EB  21197.56502581  .00000274  00000-0  89558-4 0  9994",
    "2 33922  74.0508 266.4243 0024779  54.6361  12.2512 14.42936298653573",
    "COSMOS 33924U",
    "1 33924U 93036ED  21197.52273790  .00000077  00000-0  98248-4 0  9996",
    "2 33924  73.9172 330.8929 0412462 300.5791  55.5226 13.47506448610712",
    "COSMOS 33928U",
    "1 33928U 93036EH  21197.42931451  .00000092  00000-0  35017-4 0  9996",
    "2 33928  73.9247 191.2154 0063743 117.8632 242.9002 14.43123719653944",
    "COSMOS 33929U",
    "1 33929U 93036EJ  21198.19991980  .00001910  00000-0  36273-3 0  9999",
    "2 33929  74.0305 128.7466 0003289 114.3771 359.7968 14.64926844657886",
    "COSMOS 33930U",
    "1 33930U 93036EK  21198.38692156  .00000817  00000-0  22790-3 0  9999",
    "2 33930  74.0285 287.1899 0028219 336.8694  92.7860 14.47667592652647"
  ]
  createSatelliteList(tle_arr)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

/**
 *
 * @param {Array} arr 卫星数据集合
 * @returns {void}
 */
function createSatelliteList(arr) {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
    // 监听鼠标单击事件,并尝试隐藏其他矢量数据
    // const gs = graphicLayer.getGraphicsByAttr("satellite", "type")
    // for (let i = 0; i < gs.length; i++) {
    //   if (gs[i] === event.graphic) {
    //     continue
    //   } else {
    //     gs[i].show = false
    //   }
    // }
  })
  map.on(mars3d.EventType.clickMap, function (event) {
    console.log("单击地图空白处", event)
    // 单击地图时，显示所有矢量数据
    // const gs = graphicLayer.getGraphicsByAttr("satellite", "type")
    // for (let i = 0; i < gs.length; i++) {
    //   gs[i].show = true
    // }
  })

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "卫星图层", template: "all", attr })
  })

  for (let i = 0; i < arr.length; i += 3) {
    const weixin = new mars3d.graphic.Satellite({
      name: arr[i],
      tle1: arr[i + 1],
      tle2: arr[i + 2],
      model: {
        url: "https://data.mars3d.cn/gltf/mars/weixin.gltf",
        scale: 1,
        minimumPixelSize: 60
      },
      label: {
        text: arr[i],
        color: "#ffffff",
        opacity: 1,
        font_family: "楷体",
        font_size: 30,
        outline: true,
        outlineColor: "#000000",
        outlineWidth: 3,
        background: true,
        backgroundColor: "#000000",
        backgroundOpacity: 0.5,
        font_weight: "normal",
        font_style: "normal",
        pixelOffsetX: 0,
        pixelOffsetY: -20,
        scaleByDistance: true,
        scaleByDistance_far: 10000000,
        scaleByDistance_farValue: 0.4,
        scaleByDistance_near: 100000,
        scaleByDistance_nearValue: 1
      },
      path: {
        color: "#e2e2e2",
        opacity: 0.5,
        width: 1
      },
      highlight: {
        path: {
          opacity: 1,
          width: 2
        }
      }
    })
    graphicLayer.addGraphic(weixin)

    // RectSensor锥体（比Satellite内置的cone效率略高）
    const rectSensor = new mars3d.graphic.RectSensor({
      position: new Cesium.CallbackProperty(function (time) {
        return weixin.position
      }, false),
      style: {
        angle1: 30,
        angle2: 15,
        length: 90000,
        color: "rgba(0,255,0,0.4)",
        outline: true,
        topShow: true,
        topSteps: 2,
        rayEllipsoid: true,
        slices: 1,
        heading: new Cesium.CallbackProperty(function (time) {
          return weixin.heading
        }, false)
      },
      reverse: true
    })
    graphicLayer.addGraphic(rectSensor)
  }
}
