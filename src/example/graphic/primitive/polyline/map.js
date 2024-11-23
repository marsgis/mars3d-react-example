import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.51363, lng: 117.278891, alt: 46241, heading: 2, pitch: -49 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic2_1(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic13(graphicLayer)
  addDemoGraphic17(graphicLayer)
  addDemoGraphic18(graphicLayer)
  addDemoGraphic19(graphicLayer)
  addDemoGraphic20(graphicLayer)
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
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.220337, 31.832987],
      [117.220242, 31.835234],
      [117.216263, 31.835251],
      [117.217219, 31.819929],
      [117.223096, 31.818342],
      [117.249686, 31.818964],
      [117.263171, 31.816664],
      [117.278695, 31.816107],
      [117.279826, 31.804185],
      [117.286308, 31.804112],
      [117.28621, 31.801059]
    ],
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineTrail,
      materialOptions: {
        color: Cesium.Color.CHARTREUSE,
        speed: 5
      },
      clampToGround: true,
      label: {
        text: "我是线",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  initGraphicManager(graphic)
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  // graphic.on(mars3d.EventType.click, function (event) {
  //   console.log("监听graphic，单击了矢量对象", event)
  // })

  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "开始编辑对象[graphic绑定的]",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.172852, 31.862736, 33.69],
      [117.251461, 31.856011, 26.44]
    ],
    style: {
      width: 6,
      materialType: mars3d.MaterialType.PolylineDash, // 虚线
      materialOptions: {
        color: "#ff0000",
        dashLength: 20
      },

      label: { text: "鼠标移入会高亮" },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        // type: mars3d.EventType.click,
        materialType: mars3d.MaterialType.Color,
        color: "#ff0000"
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // 在指定时间范围显示对象 0-10，20-30,40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

function addDemoGraphic2_1(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.13312, 31.877271, 37.6],
      [117.18517, 31.876315, 25.6],
      [117.24824, 31.87394, 22.9]
    ],
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineDotDash, // 点划线 虚线
      materialOptions: {
        color: "#00ffff",
        dashLength: 50
      }
    },
    attr: { remark: "示例2-1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.358187, 31.838662, 12.23],
      [117.4384, 31.819405, 11.78]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#FFFF00",
        speed: 10,
        percent: 0.15,
        alpha: 0.2
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.348938, 31.805369, 7.63],
      [117.429496, 31.786715, 8.41]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#1a9850",
        image: "//data.mars3d.cn/img/textures/line-arrow-right.png",
        speed: 10
      }
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.313682, 31.7416, 10.85],
      [117.311934, 31.774753, 19.71],
      [117.305473, 31.800304, 23.86]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/arrow-h.png",
        axisY: false,
        repeat: new Cesium.Cartesian2(20.0, 1.0),
        color: "#ffff00",
        speed: 40
      }
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.169646, 31.769171],
      [117.194579, 31.806466]
    ],
    style: {
      width: 3,
      materialType: mars3d.MaterialType.ODLine,
      materialOptions: {
        color: "#FF0000",
        speed: 5 + 1.0 * Math.random(),
        startTime: Math.random()
      }
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const startPoint = Cesium.Cartesian3.fromDegrees(117.025419, 32.00651, 51.2)
  const endPoint = Cesium.Cartesian3.fromDegrees(117.323963, 32.050384, 33.8)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions,
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.CHARTREUSE,
        image: "//data.mars3d.cn/img/textures/line-color-yellow.png",
        speed: 15
      }
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.225811, 31.772658, 28],
      [117.251371, 31.771603, 24.8],
      [117.24979, 31.739408, 25.4],
      [117.229487, 31.751584, 27.5]
    ],
    style: {
      width: 5,
      closure: true,
      materialType: mars3d.MaterialType.LineFlicker,
      materialOptions: {
        color: new Cesium.Color(0.0, 1.0, 0.0, 0.7),
        speed: 5
      }
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic9(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.208284, 31.809663, 36.2],
      [117.221568, 31.793622, 32.7],
      [117.271391, 31.797771, 24.3]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#00ffff",
        speed: 10,
        percent: 0.15,
        alpha: 0.2
      }
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic10(graphicLayer) {
  const colors = []
  for (let i = 0; i < 7; ++i) {
    colors.push(Cesium.Color.fromRandom({ alpha: 1.0 }))
  }

  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.063958, 31.831931, 35.1],
      [117.094926, 31.83328, 33.3],
      [117.099639, 31.812169, 30.9],
      [117.120429, 31.811357, 32.3],
      [117.120415, 31.785387, 21.3],
      [117.142865, 31.784693, 23.6],
      [117.142902, 31.784508, 23.6]
    ],
    style: {
      width: 5,
      colors // 每一段都不同颜色,
      // colorsPerVertex: true,
    },
    attr: { remark: "示例10" }
  })
  graphicLayer.addGraphic(graphic)
}

// 注册自定义材质
const LineSpriteType = "LineSprite"
mars3d.MaterialUtil.register(LineSpriteType, {
  fabric: {
    uniforms: {
      image: Cesium.Material.DefaultImageId,
      speed: 20,
      globalAlpha: 1.0
    },
    source: `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec4 colorImage = texture(image, vec2(fract(st.s - speed*czm_frameNumber/1000.0), st.t));
        material.alpha = colorImage.a * globalAlpha;
        material.diffuse = colorImage.rgb * 1.5 ;
        return material;
      }`
  },
  translucent: true
})

function addDemoGraphic11(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.261209, 31.919032, 20.7],
      [117.279865, 31.893017, 15.3],
      [117.26716, 31.874204, 19.3]
    ],
    style: {
      width: 1.7,
      // 使用自定义材质
      materialType: LineSpriteType,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/line-sprite.png",
        speed: 10
      }
    },
    attr: { remark: "示例11" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic12(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.281001, 31.923691, 15.6],
      [117.296594, 31.89781, 12.3],
      [117.28622, 31.877348, 14.2]
    ],
    style: {
      width: 2,
      // 使用自定义材质
      materialType: LineSpriteType,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/fence-line.png",
        speed: 10
      }
    },
    attr: { remark: "示例12" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic13(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.299877, 31.929951, 18.1],
      [117.318114, 31.900197, 18.9],
      [117.302505, 31.874097, 14.4]
    ],
    style: {
      width: 1.6,
      // 使用自定义材质
      materialType: LineSpriteType,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/line-sprite2.png",
        speed: 10
      }
    },
    attr: { remark: "示例13" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic17(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.126296, 31.901182, 32.3],
      [117.19873, 31.896307, 29],
      [117.245564, 31.894645, 24.1]
    ],
    style: {
      width: 20,
      materialType: mars3d.MaterialType.LineThreeDash,
      materialOptions: {
        color: Cesium.Color.RED, // 中心线颜色
        dashLength: 64, // 中心长度
        widthRatio: 0.1, // 中心百分比
        sidesColor: Cesium.Color.WHITE, // 外侧颜色
        sidesDashLength: 32, // 外侧长度
        sidesWidthRatio: 0.1 // 外侧百分比
      }
    },
    attr: { remark: "示例17" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic18(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [117.336832, 31.871106, 16.6],
      [117.413649, 31.872435, 10.9],
      [117.507419, 31.847006, 18.7]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineCross,
      materialOptions: {
        color: Cesium.Color.RED, // 中心线颜色
        dashLength: 36, // 十字长度
        maskLength: 10, // 空隙间隔长度
        centerPower: 0.1, // 中心宽百分比
        dashPower: 0.2 // 虚线百分比
      }
    },
    attr: { remark: "示例18" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic19(graphicLayer) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: [
      [117.167335, 31.735739, 9.9],
      [117.232611, 31.799572, 24.4]
    ],
    style: {
      width: 10,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: Cesium.Color.AQUA,
        image: "//data.mars3d.cn/img/textures/arrow-small.png",
        repeat: new Cesium.Cartesian2(40, 1),
        speed: 30,
        bgColor: "#0000ff"
      },
      clampToGround: true,
      showAll: true
    },
    attr: { remark: "示例19" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic20(graphicLayer) {
  const graphic = new mars3d.graphic.PolylinePrimitive({
    positions: [
      [116.297402, 30.975045, 1000],
      [116.305843, 30.950567, 776.3],
      [116.33202, 30.951973, 728.4],
      [116.326067, 30.970536, 1059.1],
      [116.31299, 30.959927, 1080.4]
    ],
    style: {
      color: Cesium.Color.YELLOW,
      // 需要开启深度检测后可见
      depthFail: true,
      depthFailMaterial: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.PolylineDash, {
        color: Cesium.Color.RED,
        dashLength: 20
      })
    },
    attr: { remark: "示例20" }
  })
  graphicLayer.addGraphic(graphic)
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

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions: [pt1, position, pt2],
      style: {
        width: 3.0,
        color: Cesium.Color.fromRandom({ alpha: 1.0 })
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
    type: "polylineP",
    // maxPointNum: 2, //可以限定最大点数，2个点绘制后自动结束
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: false
    }
  })
}

export function startDrawGraphic2() {
  graphicLayer.startDraw({
    type: "polylineP",
    style: {
      color: "#ff0000",
      width: 3,
      closure: true
    }
  })
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic_parent ?? e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic_parent ?? e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "还原编辑(还原到初始)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRestore(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRestore()
        }

        const graphic = event.graphic
        if (hasRestore(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRestore(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.restore) {
          graphic.editing.restore() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.restore) {
          graphic.parent.editing.restore() // 右击是编辑点时
        }
      }
    },
    {
      text: "撤销编辑(还原到上一步)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRevoke(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRevoke()
        }

        const graphic = event.graphic
        if (hasRevoke(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRevoke(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.revoke) {
          graphic.editing.revoke() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.revoke) {
          graphic.parent.editing.revoke() // 右击是编辑点时
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy || graphic.isPrivate || graphic.graphicIds) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "查看聚合列表",
      icon: "fa fa-info",
      show: (event) => {
        const graphic = event.graphic
        if (graphic.graphicIds) {
          return true
        } else {
          return false
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const graphics = graphic.getGraphics() // 对应的grpahic数组，可以自定义显示
        if (graphics) {
          const names = []
          for (let index = 0; index < graphics.length; index++) {
            const g = graphics[index]
            names.push(g.attr.name || g.attr.text || g.id)
          }
          return globalAlert(`${names.join(",")}`, `共${graphics.length}个聚合对象`)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: (event) => {
        const graphic = event.graphic
        return !graphic.isPoint
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    }
  ])
}
