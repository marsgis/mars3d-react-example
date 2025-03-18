import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -7.606383, lng: 119.069383, alt: 10521145, heading: 0, pitch: -82 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1000,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    clock: {
      multiplier: 5 // 速度
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

  globalMsg("非实际卫星轨道，随机模拟的坐标，只是为了演示追踪！")

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

  // ===========================================================
  // 取数据
  const arr = dataWork.getTestData(map.clock.currentTime, 5 * 60)

  const graphic = new mars3d.graphic.PathEntity({
    position: {
      type: "time", // 时序动态坐标
      list: arr,
      timeField: "time",
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
    },
    style: {
      leadTime: 0,
      trailTime: 2800,
      resolution: 1,
      materialType: mars3d.MaterialType.PolylineGlow,
      materialOptions: {
        glowPower: 0.1,
        color: Cesium.Color.YELLOW
      },
      width: 10
    },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 150
    }
  })
  graphicLayer.addGraphic(graphic)

  // ===========================================================

  // 视锥体 展示
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: graphic.property,
    orientation: new Cesium.VelocityOrientationProperty(graphic.property),
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      color: "rgba(110,245,0,0.5)"
    }
  })
  graphicLayer.addGraphic(satelliteSensor)

  // 地面站 展示
  const localStart = Cesium.Cartesian3.fromDegrees(109.51856, 18.258736, 2000)
  const conicSensor = new mars3d.graphic.ConicSensor({
    position: localStart,
    style: {
      angle: 5, // 雷达最小扫描仰角
      length: 2500000,
      color: Cesium.Color.fromBytes(255, 0, 0, 85),
      rayEllipsoid: true
    }
  })
  graphicLayer.addGraphic(conicSensor)

  conicSensor.lookAt = graphic.property // 追踪卫星

  // 测试连接线
  const testLine = new mars3d.graphic.PolylineEntity({
    positions: new Cesium.CallbackProperty(function (time) {
      const localEnd = conicSensor.rayPosition
      if (!localEnd) {
        return []
      }
      return [localStart, localEnd]
    }, false),
    style: {
      arcType: Cesium.ArcType.NONE,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: "#ff0000"
      },
      width: 1
    }
  })
  graphicLayer.addGraphic(testLine)
}

// 模拟数据生产类
const dataWork = {
  thisPoint: {
    x: 100.245989,
    y: 0,
    z: 1000000
  },
  // data开始时间，seconds 秒数
  getTestData: function (startTime, seconds) {
    const arr = []

    let thisTime
    for (let i = 0; i <= seconds; i += 5) {
      thisTime = Cesium.JulianDate.addSeconds(startTime, i, new Cesium.JulianDate())

      // 生成随机的坐标
      this.thisPoint.x += i * 0.01
      this.thisPoint.y += i * 0.01

      arr.push({
        time: Cesium.JulianDate.toIso8601(thisTime),
        lng: this.thisPoint.x,
        lat: this.thisPoint.y,
        alt: this.thisPoint.z
      })
    }
    return arr
  }
}
