import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.653865, lng: 116.262622, alt: 54556, heading: 0, pitch: -60 }
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
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
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

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 31.0, 1000],
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // 半球
      fill: false,
      subdivisions: 64,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: "#ffff00",

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        outlineColor: "#ff0000"
      }
    },
    attr: { remark: "示例1" },
    // 添加扫描面
    scanPlane: {
      step: 0.5, // 步长
      style: {
        color: "#ffff00",
        opacity: 0.4
      }
    }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 演示个性化处理graphic
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

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 31.0, 1000),
    style: {
      radii: new Cesium.Cartesian3(2500.0, 2500.0, 1000.0),
      maximumConeDegree: 90, // 半球
      color: Cesium.Color.RED.withAlpha(0.3),
      subdivisions: 128,
      stackPartitions: 32,
      slicePartitions: 32,
      outline: true,
      outlineColor: Cesium.Color.RED.withAlpha(0.7)
    },
    attr: { remark: "示例2" },
    // 添加扫描面
    scanPlane: [
      { step: 0.9, style: { color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 120, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } },
      { step: 0.9, style: { heading: 240, color: "#ffff00", minimumConeDegree: 70.0, maximumConeDegree: 90.0 } }
    ]
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.307258, 30.999546, 1239.2),
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidElectric,
      materialOptions: {
        color: Cesium.Color.GREEN,
        speed: 5.0
      },
      outline: false
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

//
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.4, 31.0, 1000],
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.EllipsoidWave,
      materialOptions: {
        color: "#00ffff",
        speed: 5.0
      },
      outline: false
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: [116.1, 30.9, 1000],
    style: {
      radii: 2500,
      innerRadii: 1500,
      maximumConeDegree: 90, // 半球
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/line-color-azure.png",
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
    },
    hasEdit: false,
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 添加扫描面
  // graphic.addScanPlane({
  //   type: "roll", // 扫描类型
  //   step: 0.5, // 步长
  //   style: {
  //     minimumConeDegree: -90.0,
  //     maximumConeDegree: 90.0
  //   }
  // })
}

// 半圆顶球体
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.2, 30.9, 1000),
    style: {
      radii: 2500,
      maximumConeDegree: 90,
      materialType: mars3d.MaterialType.WallScroll,
      materialOptions: {
        image: "//data.mars3d.cn/img/textures/poly-san.png",
        count: 1.0,
        color: "#00ffff",
        speed: 10,
        reverse: false,
        axisY: false,
        bloom: true
      }
      // outline: true,
      // outlineColor: Cesium.Color.BLUE.withAlpha(0.6)
    },
    hasEdit: false,
    // 添加扫描面
    scanPlane: {
      step: 0.5, // 步长
      style: {
        innerRadii: 2500,
        color: "#00ffff",
        opacity: 0.2,
        outline: true,
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,
        minimumConeDegree: -30.0,
        maximumConeDegree: 70.0
      }
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic)

  // // 添加扫描面
  // graphic.addScanPlane({
  //   type: "pitch", // 扫描类型
  //   step: 0.5, // 步长
  //   style: {
  //     roll: 90,
  //     minimumConeDegree: 0.0,
  //     maximumConeDegree: 180.0
  //   }
  // })
}

// 含内半径 半圆顶球体
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.3, 30.9, 1000),
    style: {
      radii: 2500,
      innerRadii: 1000,
      maximumConeDegree: 90,
      color: "rgba(253,2,0,0.3)",
      outline: true
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 添加扫描面
  graphic.addScanPlane({
    step: 1.5, // 步长
    style: {
      innerRadii: 1000
    }
  })
}

// 被切开的含内半径 半圆顶球体
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position: new mars3d.LngLatPoint(116.4, 30.9, 1000),
    style: {
      radii: 2500,
      innerRadii: 1000,
      minimumConeDegree: 20.0,
      maximumConeDegree: 90,
      color: "rgba(253,200,0,0.3)",
      outline: true
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 添加扫描面
  graphic.addScanPlane({
    step: 0.8, // 步长
    style: {
      innerRadii: 1000
    }
  })
}

function addDemoGraphic9(graphicLayer) {
  const ellipsoid = new mars3d.graphic.EllipsoidEntity({
    position: [116.105052, 30.816437, 991],
    style: {
      radii: 2500,
      minimumClockDegree: -90.0,
      maximumClockDegree: 180.0,
      minimumConeDegree: 20.0,
      maximumConeDegree: 90.0,
      fill: false,
      outline: true,
      outlineColor: "rgba(0, 204, 0, 0.4)", // 绿色
      stackPartitions: 30, // 竖向
      slicePartitions: 30 // 横向
    },
    // 添加扫描面
    scanPlane: {
      step: 1.0, // 步长
      min: -90.0, // 最小值
      max: 180.0, // 最大值
      style: {
        innerRadii: 1000,
        outline: true,
        color: "rgba(255, 204, 0)",
        outlineColor: "rgba(255, 204, 0, 0.1)",
        minimumClockDegree: 90.0,
        maximumClockDegree: 100.0,
        minimumConeDegree: 20.0,
        maximumConeDegree: 70.0
      }
    }
  })
  graphicLayer.addGraphic(ellipsoid)
}

function addDemoGraphic10(graphicLayer) {
  const point = [116.257171, 31.218046, 962.1]

  const graphicN = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 4000,
      maximumConeDegree: 90,
      color: "rgba(231,6,16,0.2)",
      label: {
        text: "最小半径",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 4000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicN)

  const graphicZ = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 6000,
      maximumConeDegree: 90,
      color: "rgba(26,144,255,0.2)",
      label: {
        text: "中间半径",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 6000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicZ)

  const graphicW = new mars3d.graphic.EllipsoidEntity({
    position: point,
    style: {
      radii: 8000,
      maximumConeDegree: 90,
      color: "rgba(82,196,26,0.2)",
      label: {
        text: "最大半径",
        color: "blue",
        background: true,
        backgroundColor: "rgba(255,255,255,0.4)",
        setHeight: 8000,
        visibleDepth: false,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      }
    },
    hasEditRadii: false,
    linkage: [graphicN, graphicZ] // 联动的对象
  })
  graphicLayer.addGraphic(graphicW)

  // 绑定事件
  graphicW.on(mars3d.EventType.editMouseMove, (event) => {
    const linkage = event.graphic?.options?.linkage // 联动的对象
    if (linkage) {
      const position = event.graphic.position
      linkage.forEach((element) => {
        element.position = position
      })
    }
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  const radius = result.radius

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.EllipsoidEntity({
      position,
      style: {
        radii: radius,
        maximumConeDegree: 90,
        color: Cesium.Color.fromRandom({ alpha: 0.6 })
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
    type: "ellipsoid",
    style: {
      color: "rgba(0,255,255,0.6)",
      maximumConeDegree: 90
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
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
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
    }
  ])
}
