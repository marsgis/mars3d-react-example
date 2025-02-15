import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 28.339692, lng: 117.287486, alt: 290058.7, heading: 0.4, pitch: -43.7 },
    clock: {
      startTime: "2017/08/25 08:00:00",
      stopTime: "2017/08/25 08:01:30"
    }
  },
  control: {
    animation: true, // 是否创建 动画小器件，左下角仪表
    timeline: true // 是否显示 时间线控件
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  addStaticGraphic() // 加静态数据
  addDynamicsGraphic() // 加动态数据
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 加静态数据
function addStaticGraphic() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["名称"] = event.graphic.name
    attr["类型"] = event.graphic.type

    return mars3d.Util.getTemplateHtml({ title: "静态数据图层", template: "all", attr })
  })

  // 下面是红方的
  const graphicRedCamp = new mars3d.graphic.BillboardPrimitive({
    name: "红方指挥所",
    position: [116.33981, 30.860834, 430.3],
    style: {
      image: "https://data.mars3d.cn/img/marker/camp-red.png"
    }
  })
  graphicLayer.addGraphic(graphicRedCamp)

  const graphicRedLeidaModel = new mars3d.graphic.ModelPrimitive({
    name: "红方雷达模型",
    position: [115.947263, 30.835768, 260.2],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40
    }
  })
  graphicLayer.addGraphic(graphicRedLeidaModel)

  const graphicRedScan = new mars3d.graphic.EllipsoidEntity({
    name: "红方雷达扫描面",
    position: graphicRedLeidaModel.position,
    style: {
      radii: new Cesium.Cartesian3(55000, 55000, 35000),
      maximumConeDegree: 90, // 半球
      color: Cesium.Color.RED.withAlpha(0.3),
      subdivisions: 128,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: Cesium.Color.RED.withAlpha(0.7)
    },
    // 添加扫描面
    scanPlane: [
      { step: 0.9, style: { heading: 0, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 120, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 240, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } }
    ]
  })
  graphicLayer.addGraphic(graphicRedScan)

  const squareRed = new mars3d.graphic.WallPrimitive({
    name: "红方战场区域",
    positions: mars3d.graphic.GatheringPlace.getOutlinePositions([
      [116.184102, 31.544798],
      [115.342088, 30.553571],
      [116.816057, 30.156257]
    ]),
    style: {
      diffHeight: 15000,
      closure: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "https://data.mars3d.cn/img/textures/fence.png",
        color: "#FF0004",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    }
  })
  graphicLayer.addGraphic(squareRed)

  // 下面是蓝方的
  const graphicBlueLeidaModel = new mars3d.graphic.ModelPrimitive({
    name: "蓝方雷达模型",
    position: [118.795298, 32.06146, 8.2],
    style: {
      url: "//data.mars3d.cn/gltf/mars/leida.glb",
      scale: 1,
      minimumPixelSize: 40
    }
  })
  graphicLayer.addGraphic(graphicBlueLeidaModel)

  const graphicBlueScan = new mars3d.graphic.EllipsoidEntity({
    name: "蓝方雷达扫描面",
    position: graphicBlueLeidaModel.position,
    style: {
      radii: 45000,
      minimumClockDegree: 60,
      maximumClockDegree: 300,
      minimumConeDegree: 20.0,
      maximumConeDegree: 90.0,
      fill: false,
      outline: true,
      outlineColor: "rgba(0, 0, 255, 0.5)",
      stackPartitions: 30, // 竖向
      slicePartitions: 30 // 横向
    },
    // 添加扫描面
    scanPlane: {
      step: 1.0, // 步长
      min: 60 + 90, // 最小值
      max: 300 + 90, // 最大值
      style: {
        innerRadii: 1000,
        color: "rgba(0, 0, 255,0.3)",
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,
        minimumConeDegree: 20.0,
        maximumConeDegree: 70.0
      }
    }
  })
  graphicLayer.addGraphic(graphicBlueScan)

  const graphicBlueScan2 = new mars3d.graphic.EllipsoidEntity({
    name: "蓝方雷达扫描面2",
    position: [118.026355, 32.780869],
    style: {
      radii: 45000,
      innerRadii: 30000,
      maximumConeDegree: 90, // 半球
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "https://data.mars3d.cn/img/textures/line-color-azure.png",
        color: "#00ffff",
        count: 1.0,
        speed: 20,
        reverse: true,
        axisY: true,
        bloom: true
      },
      subdivisions: 128,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#00ffff"
    }
  })
  graphicLayer.addGraphic(graphicBlueScan2)

  const squareBlue = new mars3d.graphic.WallPrimitive({
    name: "蓝方战场区域",
    positions: mars3d.graphic.GatheringPlace.getOutlinePositions([
      [117.459464, 32.669056],
      [119.134144, 32.663604],
      [118.836901, 31.317446]
    ]),
    style: {
      diffHeight: 15000,
      closure: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "https://data.mars3d.cn/img/textures/fence.png",
        color: "#0000ff",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      }
    }
  })
  graphicLayer.addGraphic(squareBlue)
}

// 加动态数据
function addDynamicsGraphic() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["名称"] = event.graphic.name
    attr["类型"] = event.graphic.type

    return mars3d.Util.getTemplateHtml({ title: "动态数据图层", template: "all", attr })
  })

  // 【动态】进攻箭头标号
  const arrArrow = [
    {
      name: "红方进攻箭头1",
      color: "#FF0000",
      list: [
        {
          time: "2017/08/25 08:00:06",
          positions: [
            [116.463145, 30.818331, 556.9],
            [116.213265, 30.879942, 639.8],
            [116.322121, 31.159826, 397],
            [116.664029, 31.463736, 59.3]
          ]
        },
        {
          time: "2017/08/25 08:00:45",
          positions: [
            [116.463145, 30.818331, 556.9],
            [116.213265, 30.879942, 639.8],
            [116.845152, 31.670017, 35.1],
            [117.408668, 31.865484, 88.7]
          ]
        }
      ]
    },
    {
      name: "蓝方进攻箭头1",
      color: "#0099FF",
      list: [
        {
          time: "2017/08/25 08:00:03",
          positions: [
            [118.782104, 32.133595, 9.9],
            [118.773311, 31.980909, 0.3],
            [118.438338, 32.084293, 21.8],
            [118.055669, 32.019832, 58.6]
          ]
        },
        {
          time: "2017/08/25 08:00:45",
          positions: [
            [118.782104, 32.133595, 9.9],
            [118.773311, 31.980909, 0.3],
            [117.913453, 31.870789, 30.1],
            [117.286644, 31.83366, 137.1]
          ]
        }
      ]
    }
  ]
  for (let i = 0; i < arrArrow.length; i++) {
    const item = arrArrow[i]
    const graphicTriangle = new mars3d.graphic.AttackArrowYW({
      name: item.name,
      positions: {
        type: "time", // 时序动态坐标
        speed: 260,
        list: item.list,
        interpolation: true,
        backwardExtrapolationType: Cesium.ExtrapolationType.NONE, // 在第1个开始时间之前，NONE时不显示，HOLD时显示开始时间对应坐标位置
        forwardExtrapolationType: Cesium.ExtrapolationType.HOLD // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
      },
      style: {
        color: item.color,
        opacity: 0.6,
        outline: true,
        outlineWidth: 3,
        outlineColor: "#ffffff"
      }
    })
    graphicLayer.addGraphic(graphicTriangle)
  }

  // 【动态】飞机飞行路线
  const arrPlane = [
    {
      name: "蓝方战机1",
      color: "#0099FF",
      list: [
        { time: "2017/08/25 08:00:05", lng: 118.666947, lat: 32.019659, alt: 1800 },
        { time: "2017/08/25 08:00:20", lng: 118.073734, lat: 32.196725, alt: 1800 },
        { time: "2017/08/25 08:00:30", lng: 117.663747, lat: 32.139578, alt: 1800 },
        { time: "2017/08/25 08:00:45", lng: 117.416821, lat: 31.983683, alt: 1800 }
      ]
    },
    {
      name: "蓝方战机2",
      color: "#0099FF",
      list: [
        { time: "2017/08/25 08:00:05", lng: 118.670229, lat: 31.951527, alt: 1800 },
        { time: "2017/08/25 08:00:15", lng: 118.006201, lat: 32.001893, alt: 1800 },
        { time: "2017/08/25 08:00:20", lng: 117.701754, lat: 31.987723, alt: 1800 },
        { time: "2017/08/25 08:00:33", lng: 117.461582, lat: 31.888292, alt: 1800 }
      ]
    },
    {
      name: "蓝方战机3",
      color: "#0099FF",
      list: [
        { time: "2017/08/25 08:00:05", lng: 118.673806, lat: 31.913296, alt: 1800 },
        { time: "2017/08/25 08:00:25", lng: 118.054865, lat: 31.839124, alt: 1800 },
        { time: "2017/08/25 08:00:35", lng: 117.675255, lat: 31.753229, alt: 1800 },
        { time: "2017/08/25 08:00:50", lng: 117.485964, lat: 31.726996, alt: 1800 },
        { time: "2017/08/25 08:00:55", lng: 117.379996, lat: 31.770719, alt: 1800 }
      ]
    },
    {
      name: "红方战机1",
      color: "#FF0000",
      list: [
        { time: "2017/08/25 08:00:10", lng: 116.33981, lat: 30.860834, alt: 1800 },
        { time: "2017/08/25 08:00:41", lng: 117.144977, lat: 31.984587, alt: 1800 },
        { time: "2017/08/25 08:00:56", lng: 117.269559, lat: 31.995661, alt: 1800 }
      ],
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
    },
    {
      name: "红方战机2",
      color: "#FF0000",
      list: [
        { time: "2017/08/25 08:00:10", lng: 116.33981, lat: 30.860834, alt: 1800 },
        { time: "2017/08/25 08:00:30", lng: 117.135403, lat: 31.852591, alt: 1800 },
        { time: "2017/08/25 08:00:55", lng: 117.271061, lat: 31.837848, alt: 1800 }
      ],
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
    },
    {
      name: "红方战机3",
      color: "#FF0000",
      list: [
        { time: "2017/08/25 08:00:10", lng: 116.33981, lat: 30.860834, alt: 1800 },
        { time: "2017/08/25 08:00:20", lng: 117.043351, lat: 31.617132, alt: 1800 },
        { time: "2017/08/25 08:00:32", lng: 117.200792, lat: 31.665817, alt: 1800 },
        { time: "2017/08/25 08:00:52", lng: 117.292905, lat: 31.742538, alt: 1800 }
      ]
    }
  ]
  for (let i = 0; i < arrPlane.length; i++) {
    const item = arrPlane[i]
    const feijiPath = new mars3d.graphic.PathEntity({
      name: item.name,
      position: {
        type: "time", // 时序动态坐标
        speed: 260,
        list: item.list,
        forwardExtrapolationType: item.forwardExtrapolationType ?? Cesium.ExtrapolationType.NONE, // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
        backwardExtrapolationType: Cesium.ExtrapolationType.NONE // 在第1个开始时间之前，NONE时不显示，HOLD时显示开始时间对应坐标位置
      },
      style: {
        width: 6,
        leadTime: 0, // 前方的路线不显示
        materialType: mars3d.MaterialType.LineFlow,
        materialOptions: {
          color: item.color,
          image: "https://data.mars3d.cn/img/textures/line-tarans.png",
          speed: 4
        }
      },
      model: {
        url: "https://data.mars3d.cn/gltf/mars/zhanji.glb",
        scale: 0.01,
        minimumPixelSize: 50,
        show: true
      },
      billboard: {
        show: false,
        image: "https://data.mars3d.cn/img/marker/plane_blue.png",
        color: item.color,
        scale: 0.2,
        distanceDisplayCondition: true,
        distanceDisplayCondition_near: 90000,
        distanceDisplayCondition_far: Number.MAX_VALUE
      }
    })
    graphicLayer.addGraphic(feijiPath)
  }

  // 【动态】导弹飞行路线
  const arrMissile = [
    {
      name: "红方导弹1",
      image: "https://data.mars3d.cn/img/marker/missile_red.png",
      list: [
        { time: "2017/08/25 08:00:32", lng: 117.200792, lat: 31.665817, alt: 1800 },
        { time: "2017/08/25 08:00:34", lng: 117.238481, lat: 31.827555, alt: 1800 }
      ]
    },
    {
      name: "红方导弹2",
      image: "https://data.mars3d.cn/img/marker/missile_red.png",
      list: [
        { time: "2017/08/25 08:00:30", lng: 117.135403, lat: 31.852591, alt: 1800 },
        { time: "2017/08/25 08:00:33", lng: 117.461582, lat: 31.888292, alt: 1800 }
      ]
    },
    {
      name: "红方导弹3",
      image: "https://data.mars3d.cn/img/marker/missile_red.png",
      list: [
        { time: "2017/08/25 08:00:41", lng: 117.144977, lat: 31.984587, alt: 1800 },
        { time: "2017/08/25 08:00:45", lng: 117.416821, lat: 31.983683, alt: 1800 }
      ]
    },
    {
      name: "红方导弹4",
      image: "https://data.mars3d.cn/img/marker/missile_red.png",
      list: [
        { time: "2017/08/25 08:00:52", lng: 117.271061, lat: 31.837848, alt: 1800 },
        { time: "2017/08/25 08:00:55", lng: 117.379996, lat: 31.770719, alt: 1800 }
      ]
    },
    {
      name: "蓝方导弹1",
      image: "https://data.mars3d.cn/img/marker/missile_blue.png",
      list: [
        { time: "2017/08/25 08:00:48", lng: 117.531423, lat: 31.732342, alt: 1800 },
        { time: "2017/08/25 08:00:52", lng: 117.296763, lat: 31.740295, alt: 1800 }
      ]
    }
  ]
  for (let i = 0; i < arrMissile.length; i++) {
    const item = arrMissile[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      name: item.name,
      position: {
        type: "time", // 时序动态坐标
        speed: 260,
        list: item.list,
        backwardExtrapolationType: Cesium.ExtrapolationType.NONE, // 在第1个开始时间之前，NONE时不显示，HOLD时显示开始时间对应坐标位置
        forwardExtrapolationType: Cesium.ExtrapolationType.NONE // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
      },
      style: {
        image: item.image,
        scale: 0.5,
        alignedAxis: true
      }
    })
    graphicLayer.addGraphic(graphic)
  }

  // 【动态】导弹爆炸之后的滞留
  const arrFire = [
    {
      name: "爆炸火焰1",
      list: [
        { time: "2017/08/25 08:00:34", lng: 117.238481, lat: 31.827555, alt: 1800 },
        { time: "2017/08/25 08:00:35", lng: 117.238481, lat: 31.827555, alt: 1800 }
      ]
    },
    {
      name: "爆炸火焰2",
      list: [
        { time: "2017/08/25 08:00:52", lng: 117.292905, lat: 31.742538, alt: 1800 },
        { time: "2017/08/25 08:00:53", lng: 117.292905, lat: 31.742538, alt: 1800 }
      ]
    },
    {
      name: "爆炸火焰3",
      list: [
        { time: "2017/08/25 08:00:33", lng: 117.461582, lat: 31.888292, alt: 1800 },
        { time: "2017/08/25 08:00:34", lng: 117.461582, lat: 31.888292, alt: 1800 }
      ]
    },
    {
      name: "爆炸火焰4",
      list: [
        { time: "2017/08/25 08:00:45", lng: 117.416821, lat: 31.983683, alt: 1800 },
        { time: "2017/08/25 08:00:46", lng: 117.416821, lat: 31.983683, alt: 1800 }
      ]
    },
    {
      name: "爆炸火焰5",
      list: [
        { time: "2017/08/25 08:00:55", lng: 117.379996, lat: 31.770719, alt: 1800 },
        { time: "2017/08/25 08:00:56", lng: 117.379996, lat: 31.770719, alt: 1800 }
      ]
    }
  ]

  for (let i = 0; i < arrFire.length; i++) {
    const item = arrFire[i]
    const fireImage = new mars3d.graphic.BillboardEntity({
      name: item.name,
      position: {
        type: "time", // 时序动态坐标
        speed: 260,
        list: item.list,
        backwardExtrapolationType: Cesium.ExtrapolationType.NONE, // 在第1个开始时间之前，NONE时不显示，HOLD时显示开始时间对应坐标位置
        forwardExtrapolationType: Cesium.ExtrapolationType.NONE // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
      },
      style: {
        image: "https://data.mars3d.cn/img/marker/fire.png",
        scale: 1.0,
        alignedAxis: true
      }
    })
    graphicLayer.addGraphic(fireImage)
  }
}
