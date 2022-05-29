import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.61982, lng: 117.230607, alt: 22746, heading: 2, pitch: -49 }
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
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerEvent() // 对图层绑定相关事件
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.218662, 31.800226, 37.68],
      [117.227836, 31.800388, 32.98],
      [117.229831, 31.792927, 37.91],
      [117.222571, 31.791298, 37.04],
      [117.216327, 31.79375, 37.49]
    ],
    style: {
      color: "#00ffff",
      opacity: 0.4,
      // clampToGround: true,
      // classificationType: Cesium.ClassificationType.BOTH,

      label: { text: "鼠标移入会高亮" },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        // type: mars3d.EventType.click,
        opacity: 0.8
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 图片材质
function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.187572, 31.823074, 45.53],
      [117.195377, 31.82418, 43.36],
      [117.204541, 31.818933, 37.06],
      [117.19775, 31.809539, 36.59],
      [117.183832, 31.814237, 38.76]
    ],
    style: {
      image: "img/textures/poly-soil.jpg",

      label: {
        text: "我是火星科技",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic3(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.216386, 31.815376, 35.16],
      [117.222533, 31.81729, 29.21],
      [117.22642, 31.814983, 28.43],
      [117.22681, 31.810739, 28.55],
      [117.212868, 31.811302, 34.4],
      [117.212538, 31.81424, 31.87],
      [117.214681, 31.81402, 32.97]
    ],
    style: {
      materialType: mars3d.MaterialType.Water,
      normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
      frequency: 1000.0, // 控制波数的数字。
      animationSpeed: 0.01, // 控制水的动画速度的数字。
      amplitude: 10, // 控制水波振幅的数字。
      specularIntensity: 0.5, // 控制镜面反射强度的数字。
      baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
      blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
      clampToGround: true
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 面状：草地面效果
function addDemoGraphic4(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.319966, 31.842082, 12.29],
      [117.330034, 31.835286, 11.07],
      [117.330576, 31.823452, 11.01],
      [117.311457, 31.821023, 17.11],
      [117.308954, 31.828975, 16.29]
    ],
    style: {
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyGrass, {
        grassColor: new Cesium.Color(0.25, 0.4, 0.1, 1.0),
        dirtColor: new Cesium.Color(0.1, 0.1, 0.1, 1.0),
        patchiness: 1.5 // 斑驳
      })
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 面状：木材面效果
function addDemoGraphic5(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.271662, 31.870639, 21.49],
      [117.290605, 31.871517, 19.47],
      [117.302056, 31.858145, 16.27],
      [117.299439, 31.847545, 14.77],
      [117.267705, 31.8491, 22.11]
    ],
    style: {
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyWood, {
        lightWoodColor: new Cesium.Color(0.6, 0.3, 0.1, 1.0),
        darkWoodColor: new Cesium.Color(0.4, 0.2, 0.07, 1.0),
        ringFrequency: 10.0, // 环 频率
        noiseScale: new Cesium.Cartesian2(0.7, 0.5),
        grainFrequency: 27.0 // 波纹 频率
      })
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 面状：混合效果
function addDemoGraphic6(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.154815, 31.853495],
      [117.181255, 31.854257],
      [117.182284, 31.848255],
      [117.184748, 31.840141],
      [117.180557, 31.835556],
      [117.180023, 31.833741],
      [117.166846, 31.833737],
      [117.155531, 31.833151],
      [117.154787, 31.835978],
      [117.151994, 31.839036],
      [117.150691, 31.8416],
      [117.151215, 31.844734],
      [117.154815, 31.853495]
    ],
    style: {
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyBlob, {
        lightColor: new Cesium.Color(1.0, 1.0, 1.0, 0.5),
        darkColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        frequency: 30.0 // 次数
      })
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 面状： 柏油路面效果
function addDemoGraphic7(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541],
      [117.208302, 31.85757]
    ],
    style: {
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyAsphalt, {
        asphaltColor: new Cesium.Color(0.15, 0.15, 0.15, 1.0),
        bumpSize: 0.005, // 凹凸大小
        roughness: 0.2 // 粗糙
      })
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 面状：碎石面效果
function addDemoGraphic8(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.275127, 31.839641, 25.1],
      [117.291876, 31.83181, 23.6],
      [117.289005, 31.82154, 20.1],
      [117.281431, 31.816607, 23.2],
      [117.268173, 31.826157, 34.8],
      [117.268478, 31.82567, 34.2]
    ],
    style: {
      width: 5,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyFacet, {
        lightColor: new Cesium.Color(0.25, 0.25, 0.25, 0.75),
        darkColor: new Cesium.Color(0.75, 0.75, 0.75, 0.75),
        frequency: 50.0 // 次数
      })
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic9(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.261476, 31.799865, 20.8],
      [117.270864, 31.804957, 26],
      [117.289609, 31.804853, 25.4],
      [117.290861, 31.79569, 25.2],
      [117.268148, 31.788912, 18.5]
    ],
    style: {
      height: 50,
      diffHeight: 300,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolyGradient, {
        color: "#3388cc",
        alphaPower: 1.5
      }),
      label: {
        text: "Mars3D平台",
        font_family: "楷体",
        color: "#ffff00",
        font_size: 18,
        setHeight: 400
      }
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic10(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      // 外环
      [
        [117.24586, 31.832682, 38],
        [117.259349, 31.83163, 33.4],
        [117.255132, 31.822268, 33.6],
        [117.247102, 31.822399, 23.6],
        [117.241675, 31.827205, 30.8]
      ],
      // 内环
      [
        [117.247433, 31.829648, 33.4],
        [117.253809, 31.828713, 33],
        [117.252086, 31.824081, 32.6],
        [117.247597, 31.825922, 31.6]
      ]
    ],
    style: {
      color: "#ffff00",
      opacity: 0.6
    },
    attr: { remark: "示例10" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic11(graphicLayer) {
  const primitive = new mars3d.graphic.PolygonPrimitive({
    positions: [
      [117.232633, 31.816532, 31.2],
      [117.247045, 31.816953, 25.8],
      [117.246916, 31.815743, 23.5],
      [117.243156, 31.811025, 25.7],
      [117.232491, 31.811307, 27.3]
    ],
    style: {
      materialType: mars3d.MaterialType.WaterLight,
      specularMap: "img/textures/poly-stone.jpg",
      alpha: 0.6,
      clampToGround: true
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 生成数据
export function addDemoGraphic(count) {
  graphicLayer.clear()

  showLoading()

  const startTime = new Date().getTime()

  count = count * 10000

  for (let j = 0; j < count; ++j) {
    const position = randomPoint()
    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, 500)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 135, 500)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, 500)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, 500)

    const primitive = new mars3d.graphic.PolygonPrimitive({
      positions: [pt1, pt2, pt3, pt4, pt1],
      style: {
        height: random(30, 4000),
        color: Cesium.Color.fromRandom().withAlpha(0.7)
      },
      tooltip: "第" + j + "个"
    })
    graphicLayer.addGraphic(primitive)
  }

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(116.955684 * 1000, 117.474003 * 1000) / 1000
  const wd = random(31.7576 * 1000, 32.008782 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 清除数据

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}

// 在图层级处理一些事物
function bindLayerEvent() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  /* graphicLayer.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听layer，鼠标移入了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听layer，鼠标移出了矢量对象", event)
  }) */
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        graphicLayer.removeGraphic(graphic)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}
