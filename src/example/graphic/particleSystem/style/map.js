import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let particleGraphic
let particlePosition

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.806029, lng: 117.222082, alt: 275, heading: 1, pitch: -12 }
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

  // 创建Graphic图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听layer，鼠标移入了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听layer，鼠标移出了矢量对象", event)
  })

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindPopup("我是layer上绑定的Popup")

  // 可在图层上绑定tooltip,对所有加到这个图层的矢量数据都生效
  // graphicLayer.bindTooltip('我是layer上绑定的Tooltip')

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const primitive = e.graphic
        if (primitive) {
          graphicLayer.removeGraphic(primitive)
        }
      }
    }
  ])

  addDemoGraphics(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphics(graphicLayer) {
  particlePosition = Cesium.Cartesian3.fromDegrees(117.221844, 31.813857, 28.5)

  particleGraphic = new mars3d.graphic.ParticleSystem({
    position: particlePosition, // 位置
    style: {
      image: "./img/particle/smoke.png",
      startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // 粒子出生时的颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 当粒子死亡时的颜色

      particleSize: 20, // 粒子图片的Size大小（单位：像素）
      startScale: 2.0, // 粒子在出生时的比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 粒子在死亡时的比例（单位：相对于imageSize大小的倍数）

      minimumParticleLife: 1.0, // 粒子可能存在的最短寿命时间，实际寿命将随机生成（单位：秒）
      maximumParticleLife: 3.0, // 粒子可能存在的最长寿命时间，实际寿命将随机生成（单位：秒）

      // minimumSpeed: 1.0,  //粒子初速度的最小界限，超过该最小界限，随机选择粒子的实际速度。（单位：米/秒） ？？？
      // maximumSpeed: 2.0,  //粒子初速度的最大界限，超过该最大界限，随机选择粒子的实际速度。（单位：米/秒）

      emissionRate: 200 // 粒子发射器的发射速率 （单位：次/秒）
      // lifetime: 5, //粒子的一个生命周期长度（单位：秒） ？？？
    },
    gravity: -11, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
    target: new Cesium.Cartesian3(-0.151, 0.294, 0.225), // 粒子的方向
    maxHeight: 5000 // 超出该高度后不显示粒子效果
  })
  graphicLayer.addGraphic(particleGraphic)
}

// 发射的目标点
let targetPosition
export function txtTargetHeight(val) {
  if (targetPosition) {
    updateTarget(targetPosition, val)
  }
}

export function btnSelectTarget(val) {
  map.graphicLayer.startDraw({
    type: "point",
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      targetPosition = positions[0]
      map.graphicLayer.clear()

      updateTarget(targetPosition, val)
    }
  })
}

// 图上选点
export function btnSelectPosition() {
  map.graphicLayer.startDraw({
    type: "point",
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      particlePosition = positions[0]
      map.graphicLayer.clear()

      particleGraphic.position = particlePosition
    }
  })
}

// UI绑定数据 处理
export function initParamView(data) {
  // 绑定事件
  if (data.emissionRate) {
    particleGraphic.czmObject.emissionRate = parseFloat(data.emissionRate)
  }
  if (data.slideMinLife) {
    particleGraphic.czmObject.minimumParticleLife = parseFloat(data.slideMinLife)
  }
  if (data.slideMaxLife) {
    particleGraphic.czmObject.maximumParticleLife = parseFloat(data.slideMaxLife)
  }
  if (data.slideMinSpeed) {
    particleGraphic.czmObject.minimumSpeed = parseFloat(data.slideMinSpeed)
  }
  if (data.slideMaxSpeed) {
    particleGraphic.czmObject.maximumSpeed = parseFloat(data.slideMaxSpeed)
  }
  if (data.slideStart) {
    particleGraphic.czmObject.startScale = parseFloat(data.slideStart)
  }
  if (data.slideStop) {
    particleGraphic.czmObject.endScale = parseFloat(data.slideStop)
  }
  if (data.sliderParticleSize) {
    particleGraphic.particleSize = parseFloat(data.sliderParticleSize)
  }
  if (data.slideGravity) {
    particleGraphic.gravity = parseFloat(data.slideGravity)
  }
}

function updateTarget(position, val) {
  position = mars3d.PointUtil.addPositionsHeight(position, val)

  const target = Cesium.Cartesian3.subtract(position, particlePosition, new Cesium.Cartesian3())
  Cesium.Cartesian3.multiplyByScalar(target, 0.01, target)

  console.log(`${target.x},${target.y},${target.z}`)
  particleGraphic.target = target
}
