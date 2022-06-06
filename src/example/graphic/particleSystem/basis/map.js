import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.817534, lng: 117.219389, alt: 308, heading: 110, pitch: -24 }
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

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 喷泉效果
function addDemoGraphic1(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.224855, 31.815135, 28.05), // 位置
    style: {
      image: "./img/particle/penquan.png",
      startColor: new Cesium.Color(1, 1, 1, 0.6), // 粒子出生时的颜色
      endColor: new Cesium.Color(0.8, 0.86, 1, 0.4), // 当粒子死亡时的颜色

      particleSize: 4, // 粒子图片的Size大小（单位：像素）
      startScale: 1.0, // 粒子在出生时的比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 粒子在死亡时的比例（单位：相对于imageSize大小的倍数）

      minimumParticleLife: 6, // 粒子可能存在的最短寿命时间，实际寿命将随机生成（单位：秒）
      maximumParticleLife: 7, // 粒子可能存在的最长寿命时间，实际寿命将随机生成（单位：秒）

      minimumSpeed: 9.0, // 粒子初速度的最小界限，超过该最小界限，随机选择粒子的实际速度。（单位：米/秒） ？？？
      maximumSpeed: 9.5, // 粒子初速度的最大界限，超过该最大界限，随机选择粒子的实际速度。（单位：米/秒）

      emissionRate: 40 // 粒子发射器的发射速率 （单位：次/秒）
      // lifetime: 16, //粒子的一个生命周期长度（单位：秒） ？？？
    },
    transZ: 5, // 离地高度
    gravity: -3.5, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
    maxHeight: 5000, // 超出该高度后不显示粒子效果
    attr: { remark: "示例1" }
  })

  graphicLayer.addGraphic(particleSystem)
}

// 火炬效果
function addDemoGraphic2(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.225518, 31.815549, 28.28), // 位置
    style: {
      image: "./img/particle/fire2.png",
      startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
      endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
      // sizeInMeters: true,

      particleSize: 5, // 粒子图片的Size大小（单位：像素）
      startScale: 3.0, // 粒子在出生时的比例（单位：相对于imageSize大小的倍数）
      endScale: 1.5, // 粒子在死亡时的比例（单位：相对于imageSize大小的倍数）

      minimumParticleLife: 1.5, // 粒子可能存在的最短寿命时间，实际寿命将随机生成（单位：秒）
      maximumParticleLife: 1.8, // 粒子可能存在的最长寿命时间，实际寿命将随机生成（单位：秒）

      minimumSpeed: 7.0, // 粒子初速度的最小界限，超过该最小界限，随机选择粒子的实际速度。（单位：米/秒） ？？？
      maximumSpeed: 9.0, // 粒子初速度的最大界限，超过该最大界限，随机选择粒子的实际速度。（单位：米/秒）

      emissionRate: 200 // 粒子发射器的发射速率 （单位：次/秒）
      // lifetime: 16, //粒子的一个生命周期长度（单位：秒） ？？？
    },
    transZ: 5, // 离地高度
    gravity: 0.0, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
    maxHeight: 5000, // 超出该高度后不显示粒子效果
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// 动态运行车辆的尾气粒子效果
function addDemoGraphic3(graphicLayer) {
  const roamLine = new mars3d.graphic.RoamLine({
    positions: [
      [117.226585, 31.818437, 32.41],
      [117.226838, 31.811681, 28.23]
    ],
    speed: 120,
    model: {
      show: true,
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.2
    },
    clockLoop: true // 是否循环播放
  })
  graphicLayer.addGraphic(roamLine)

  // 启动漫游
  roamLine.start()

  const particleSystem = new mars3d.graphic.ParticleSystem({
    modelMatrix: (time) => {
      return roamLine.modelMatrix
    },
    style: {
      image: "./img/particle/smoke.png",
      startColor: Cesium.Color.GREY.withAlpha(0.7), // 粒子出生时的颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 当粒子死亡时的颜色
      startScale: 1.0, // 粒子出生时的比例，相对于原始大小
      endScale: 5.0, // 粒子在死亡时的比例
      minimumParticleLife: 1.2, // 设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随机生成
      maximumParticleLife: 1.2, // 设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随机生成
      minimumSpeed: 1.0, // 设置以米/秒为单位的最小界限，超过该最小界限，随机选择粒子的实际速度。
      maximumSpeed: 4.0, // 设置以米/秒为单位的最大界限，超过该最大界限，随机选择粒子的实际速度。
      emissionRate: 20.0, // 每秒要发射的粒子数。
      lifetime: 16.0 // 粒子的生命周期为（以秒为单位）。
    },
    transX: -4.0,
    transZ: 1.4,
    maxHeight: 1000, // 超出该高度后不显示粒子效果
    attr: { remark: "示例3" }
  })
  map.graphicLayer.addGraphic(particleSystem)
}
