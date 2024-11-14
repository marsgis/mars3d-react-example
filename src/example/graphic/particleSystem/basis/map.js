import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.81456, lng: 117.231868, alt: 275.7, heading: 268.2, pitch: -12.5 }
  }
}

export let graphicLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
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
      image: "//data.mars3d.cn/img/particle/penquan.png",
      particleSize: 8, // 粒子大小（单位：像素）
      emissionRate: 100.0, // 发射速率 （单位：次/秒）
      heading: 290, // 方向角
      pitch: 40, // 俯仰角
      gravity: -3.5, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      transZ: 5, // 离地高度（单位：米）
      maxHeight: 5000, // 超出该高度后不显示粒子效果

      startColor: "rgba(255,255,255,0.6)", //  开始颜色
      endColor: "rgba(204,220,255,0.4)", // 结束颜色
      startScale: 1.0, //  开始比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 6, // 最小寿命时间（秒）
      maximumParticleLife: 7, // 最大寿命时间（秒）
      minimumSpeed: 9.0, // 最小速度(米/秒)
      maximumSpeed: 9.5 // 最大速度(米/秒)
    },
    attr: { remark: "水柱粒子效果" }
  })

  graphicLayer.addGraphic(particleSystem)
}

// 火炬效果
function addDemoGraphic2(graphicLayer) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: Cesium.Cartesian3.fromDegrees(117.225518, 31.815549, 28.28), // 位置
    style: {
      image: "//data.mars3d.cn/img/particle/fire2.png",
      particleSize: 5, // 粒子大小（单位：像素）
      emissionRate: 100, // 发射速率 （单位：次/秒）
      maxHeight: 5000, // 超出该高度后不显示粒子效果

      startColor: "rgb(255,255,255)", // 开始颜色
      endColor: "rgba(128,0,0,0)", // 结束颜色
      startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumSpeed: 7.0, // 最小速度（单位：米/秒）
      maximumSpeed: 9.0 // 最大速度（单位：米/秒）
    },
    attr: { remark: "火焰粒子效果" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// 烟花效果
function addDemoGraphic3(graphicLayer) {
  Cesium.Math.setRandomNumberSeed(315)

  const xMin = -100.0
  const xMax = 100.0
  const yMin = -80.0
  const yMax = 100.0
  const zMin = -50.0
  const zMax = 50.0
  const numberOfFireworks = 20.0
  const burstSize = 400.0
  const lifetime = 10.0

  const colorOptions = [
    { minimumRed: 0.75, green: 0.0, minimumBlue: 0.8, alpha: 1.0 },
    { red: 0.0, minimumGreen: 0.75, minimumBlue: 0.8, alpha: 1.0 },
    { red: 0.0, green: 0.0, minimumBlue: 0.8, alpha: 1.0 },
    { minimumRed: 0.75, minimumGreen: 0.75, blue: 0.0, alpha: 1.0 }
  ]
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(117.22104, 31.813759, 80))

  for (let i = 0; i < numberOfFireworks; ++i) {
    const offset = new Cesium.Cartesian3(
      Cesium.Math.randomBetween(xMin, xMax),
      Cesium.Math.randomBetween(yMin, yMax),
      Cesium.Math.randomBetween(zMin, zMax)
    )
    const color = Cesium.Color.fromRandom(colorOptions[i % colorOptions.length])

    const bursts = []
    for (let j = 0; j < 3; ++j) {
      bursts.push(new Cesium.ParticleBurst({ time: Cesium.Math.nextRandomNumber() * lifetime, minimum: burstSize, maximum: burstSize }))
    }

    createFirework(graphicLayer, modelMatrix, offset, color, bursts, lifetime)
  }
}

function createFirework(graphicLayer, modelMatrix, offset, color, bursts, lifetime) {
  const minimumExplosionSize = 30.0
  const maximumExplosionSize = 100.0
  const particlePixelSize = new Cesium.Cartesian2(7.0, 7.0)
  const emitterModelMatrixScratch = new Cesium.Matrix4()
  const emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 100.0)
  const position = Cesium.Cartesian3.add(emitterInitialLocation, offset, new Cesium.Cartesian3())
  const emitterModelMatrix = Cesium.Matrix4.fromTranslation(position, emitterModelMatrixScratch)
  const particleToWorld = Cesium.Matrix4.multiply(modelMatrix, emitterModelMatrix, new Cesium.Matrix4())
  const worldToParticle = Cesium.Matrix4.inverseTransformation(particleToWorld, particleToWorld)

  const size = Cesium.Math.randomBetween(minimumExplosionSize, maximumExplosionSize)
  const particlePositionScratch = new Cesium.Cartesian3()
  const force = function (particle) {
    const position = Cesium.Matrix4.multiplyByPoint(worldToParticle, particle.position, particlePositionScratch)
    if (Cesium.Cartesian3.magnitudeSquared(position) >= size * size) {
      Cesium.Cartesian3.clone(Cesium.Cartesian3.ZERO, particle.velocity)
    }
  }

  const normalSize = (size - minimumExplosionSize) / (maximumExplosionSize - minimumExplosionSize)
  const minLife = 0.3
  const maxLife = 1.0
  const life = normalSize * (maxLife - minLife) + minLife

  const particleSystem = new mars3d.graphic.ParticleSystem({
    modelMatrix,
    emitterModelMatrix,
    updateCallback: force,
    style: {
      image: getImage(),
      startColor: color,
      endColor: color.withAlpha(0.0),
      particleLife: life,
      speed: 100.0,
      imageSize: particlePixelSize,
      emissionRate: 0,
      emitter: new Cesium.SphereEmitter(0.1),
      bursts,
      lifetime
    },
    attr: { remark: "烟花粒子效果" }
  })
  graphicLayer.addGraphic(particleSystem)
}

let particleCanvas
function getImage() {
  if (!Cesium.defined(particleCanvas)) {
    particleCanvas = document.createElement("canvas")
    particleCanvas.width = 20
    particleCanvas.height = 20
    const context2D = particleCanvas.getContext("2d")
    context2D.beginPath()
    context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true)
    context2D.closePath()
    context2D.fillStyle = "rgb(255, 255, 255)"
    context2D.fill()
  }
  return particleCanvas
}

// 动态运行车辆的尾气粒子效果
function addDemoGraphic4(graphicLayer) {
  const fixedRoute = new mars3d.graphic.FixedRoute({
    speed: 120,
    positions: [
      [117.226414, 31.823551, 34.3],
      [117.227084, 31.8003, 30.1]
    ],
    clockLoop: true, // 是否循环播放
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  fixedRoute.start() // 启动漫游

  const particleSystem = new mars3d.graphic.ParticleSystem({
    position: fixedRoute.property,
    style: {
      image: "//data.mars3d.cn/img/particle/smoke.png",
      particleSize: 12, // 粒子大小（单位：像素）
      emissionRate: 30.0, // 发射速率 （单位：次/秒）
      pitch: 40, // 俯仰角
      gravity: -1, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      // maxHeight: 1000, // 超出该高度后不显示粒子效果

      startColor: "rgba(128,128,128,0.7)", // 开始颜色
      endColor: "rgba(255,255,255,0)", // 结束颜色
      startScale: 1.0, //  开始比例（单位：相对于imageSize大小的倍数）
      endScale: 8.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumSpeed: 1.0, // 最小速度(米/秒)
      maximumSpeed: 6.0, // 最大速度(米/秒)
      minimumParticleLife: 2,
      maximumParticleLife: 4,

      visibleDepth: false
    },
    attr: { remark: "车辆尾气" }
  })
  graphicLayer.addGraphic(particleSystem)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.ParticleSystem({
      position,
      style: {
        image: "//data.mars3d.cn/img/particle/fire2.png",
        particleSize: 5, // 粒子大小（单位：像素）
        emissionRate: 200, // 粒子发射器的发射速率 （单位：次/秒）

        startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
        endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
        startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
        endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
        minimumSpeed: 7.0, // 最小速度（单位：米/秒）
        maximumSpeed: 9.0 // 最大速度（单位：米/秒）
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "//data.mars3d.cn/img/particle/smoke.png",
      particleSize: 8, // 粒子大小（单位：像素）
      emissionRate: 100.0, // 发射速率 （单位：次/秒）
      heading: 290, // 方向角
      pitch: 40, // 俯仰角
      gravity: -3.5, // 重力因子，会修改速度矢量以改变方向或速度（基于物理的效果）
      transZ: 5, // 离地高度（单位：米）

      startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), // 开始颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 结束颜色
      startScale: 2.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 4.0, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 1.0, // 最小寿命时间（秒）
      maximumParticleLife: 3.0 // 最大寿命时间（秒）
    }
  })
}

export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "particleSystem",
    style: {
      image: "//data.mars3d.cn/img/particle/fire2.png",
      particleSize: 5, // 粒子大小（单位：像素）
      emissionRate: 200, //  发射速率 （单位：次/秒）

      startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
      endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
      startScale: 3.0, // 开始比例（单位：相对于imageSize大小的倍数）
      endScale: 1.5, // 结束比例（单位：相对于imageSize大小的倍数）
      minimumParticleLife: 1.5, // 最小寿命时间（秒）
      maximumParticleLife: 1.8, // 最大寿命时间（秒）
      minimumSpeed: 7.0, // 最小速度（单位：米/秒）
      maximumSpeed: 9.0 // 最大速度（单位：米/秒）
    }
  })
}

let particleGraphic
export function getGraphic(graphicId) {
  particleGraphic = graphicLayer.getGraphicById(graphicId)
  return particleGraphic
}

// 修改样式
export function setStylyToGraphic(style) {
  particleGraphic.setStyle(style)
}

// 修改位置
let particlePosition
export async function btnSelectPosition() {
  const graphic = await map.graphicLayer.startDraw({
    type: "point"
  })
  const positions = graphic.positionsShow
  particlePosition = positions[0]
  map.graphicLayer.clear()

  particleGraphic.position = particlePosition
}
