import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.scene.center = { lat: 31.265081, lng: 116.103599, alt: 6178, heading: 348, pitch: -54 }
  delete option.terrain
  return option
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  addEntity()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addEntity() {
  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 飞行区域边界线
  const graphic = new mars3d.graphic.PolygonEntity({
    positions: [
      [116.069898, 31.303655],
      [116.098708, 31.322126],
      [116.108063, 31.311256],
      [116.079317, 31.292959],
      [116.069898, 31.303655]
    ],
    style: {
      color: "#ffff00",
      outline: true,
      outlineWidth: 3,
      outlineColor: "#00ff00"
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.startFlicker({
    time: 3, // 闪烁时长（秒）
    onEnd: function () {
      // 结束后自动移除
      graphic.style = { fill: false }

      workPlane.activate() // 闪烁结束后开始飞行
    }
  })
}

const workPlane = {
  flySpeed: 600, // 飞行速度
  psNum: 400, // 投射间隔路程
  frameNum: 0,
  arr4LinePrimitive: [],
  arrColor: [new Cesium.Color(1.0, 0.0, 0.0, 0.3), new Cesium.Color(0.0, 1.0, 0, 0.3), new Cesium.Color(0.0, 0.0, 1, 0.3)],
  // 激活功能
  activate() {
    // 飞行路线
    this.roamLine = new mars3d.graphic.RoamLine({
      name: "无人机航拍",
      speed: this.flySpeed,
      positions: [
        [116.077374, 31.294215, 1000],
        [116.107153, 31.312963, 1000],
        [116.103816, 31.316868, 1000],
        [116.074092, 31.297972, 1000],
        [116.07068, 31.301908, 1000],
        [116.100465, 31.320893, 1000]
      ],
      model: {
        url: "//data.mars3d.cn/gltf/mars/wrj.glb",
        scale: 0.02,
        minimumPixelSize: 50,
        show: true
      },
      path: {
        color: "#ffff00",
        width: 3,
        isAll: false,
        show: true
      },
      clockLoop: false // 是否循环播放
    })
    graphicLayer.addGraphic(this.roamLine)

    this.roamLine.start()
    this.roamLine.on(mars3d.EventType.end, this.disable, this)

    // 视角切换（分步执行）
    map.setCameraViewList([
      {
        lat: 31.261244,
        lng: 116.087805,
        alt: 4571.19,
        heading: 2.3,
        pitch: -45.4,
        roll: 357.6,
        stop: 4
      },
      {
        lat: 31.299649,
        lng: 116.129938,
        alt: 2725.83,
        heading: 290.2,
        pitch: -34,
        roll: 358.1,
        stop: 4
      },
      {
        lat: 31.288891,
        lng: 116.106146,
        alt: 4268.26,
        heading: 325.4,
        pitch: -55.7,
        roll: 357.5
      }
    ])

    this.stepNum = Math.floor(this.psNum / (this.flySpeed / 100)) // 时间 = 路程 / 速度
    map.on(mars3d.EventType.clockTick, this.clock_onTick, this) // 时钟跳动 每秒钟执行一次函数 场景事件
  },
  clock_onTick(e) {
    if (!map.clock.shouldAnimate) {
      return
    }
    this.frameNum++

    // 当前的路线中的点位
    const currIndex = this.roamLine.currIndex // 当前飞行的线路,共五条线，从零开始

    if (currIndex % 2 === 0) {
      if (this.frameNum % this.stepNum === 0) {
        // 计算方向
        let p1, p2
        if (currIndex === 0 || !currIndex) {
          p1 = this.roamLine.positions[0]
          p2 = this.roamLine.positions[1]
        } else {
          p1 = this.roamLine.positions[currIndex + 1]
          p2 = this.roamLine.positions[currIndex]
        }
        if (!p1 || !p2) {
          return
        }
        // 获取起点坐标到终点坐标的 Heading Pitch Roll方向角度值
        const hpr = mars3d.PointUtil.getHeadingPitchRollForLine(p1, p2)
        // 将弧度转换为度
        const heading = Cesium.Math.toDegrees(hpr.heading)

        // 添加四棱锥体线
        const graphicFrustum = new mars3d.graphic.FrustumPrimitive({
          position: this.roamLine.position,
          style: {
            angle: 15,
            angle2: 12,
            heading: heading,
            length: Cesium.Cartographic.fromCartesian(this.roamLine.position).height,
            fill: false,
            outline: true,
            outlineColor: "#ffffff",
            outlineOpacity: 1.0
          },
          asynchronous: false,
          flat: true
        })
        graphicLayer.addGraphic(graphicFrustum)
        this.arr4LinePrimitive.push(graphicFrustum)
      }
      if (this.frameNum % this.stepNum === 10) {
        // 移除四棱锥体线 保持只有一个椎体线
        if (this.arr4LinePrimitive.length > 0) {
          graphicLayer.removeGraphic(this.arr4LinePrimitive.shift())
        }
      }
    }

    if (this.frameNum % this.stepNum === 0 && currIndex % 2 === 0) {
      if (this.arr4LinePrimitive.length > 0) {
        const graphicFrustum = this.arr4LinePrimitive[this.arr4LinePrimitive.length - 1]
        // 地面的4个顶点坐标
        const positions = graphicFrustum.getRayEarthPositions()
        // 添加地面矩形
        const primitive = new mars3d.graphic.PolygonPrimitive({
          positions: positions,
          style: {
            color: this.arrColor[graphicLayer.length % this.arrColor.length],
            zIndex: graphicLayer.length
          }
        })
        graphicLayer.addGraphic(primitive)
      }
    }
  },
  // 释放功能
  disable() {
    map.off(mars3d.EventType.clockTick, this.clock_onTick, this) // 时钟跳动 每秒钟执行一次函数 场景事件
    this.roamLine.stop()

    this.arr4LinePrimitive = []
    this.frameNum = 0
  }
}
