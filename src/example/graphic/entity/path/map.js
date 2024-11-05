import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.756263, lng: 117.209077, alt: 7696, heading: 5, pitch: -33 },
    clock: {
      currentTime: "2017-08-25 08:00:00"
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
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
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  let tempTime

  // 起点
  tempTime = map.clock.currentTime // 飞行开始时间
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.172852, 31.862736, 50))

  // 移动到的第1个目标点
  tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.251461, 31.856011, 50))

  // 移动到的第2个目标点
  tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.265321, 31.876336, 50))

  tempTime = Cesium.JulianDate.addSeconds(tempTime, 600, new Cesium.JulianDate())
  property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.160215, 31.890639, 50))

  const graphic = new mars3d.graphic.PathEntity({
    position: property,
    style: {
      width: 2,
      color: "#ffff00",
      opacity: 1.0,

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click,
        color: "#ff0000"
      }
    },
    label: {
      text: "火星1号",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.5,
      minimumPixelSize: 40
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.PathEntity({
    // maxCacheCount: -1,
    style: {
      width: 2,
      color: "#00ffff",
      opacity: 1.0,
      leadTime: 0, // 前方的路线不显示

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click,
        color: "#ff0000"
      }
    },
    label: {
      text: "火星车",
      font_size: 18,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    model: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 30
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // 设置动态位置
  changePosition(graphic, 0)

  // 定时更新动态位置（setInterval为演示）
  const interval = 20
  changePosition(graphic, interval)
  setInterval(() => {
    if (graphic.isDestroy) {
      return
    }
    changePosition(graphic, interval)
  }, interval * 1000)
}

// 改变位置
function changePosition(graphic, time) {
  graphic.addDynamicPosition(randomPoint(), time) // 按time秒运动至指定位置
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(117.207666 * 1000, 117.287241 * 1000) / 1000
  const wd = random(31.817099 * 1000, 31.876848 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 30)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  let tempTime

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const property = new Cesium.SampledPositionProperty()
    property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

    // 起点
    tempTime = map.clock.currentTime // 飞行开始时间
    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    property.addSample(tempTime, pt1)

    // 移动到的第1个目标点
    tempTime = Cesium.JulianDate.addSeconds(tempTime, 60, new Cesium.JulianDate())
    property.addSample(tempTime, mars3d.LngLatPoint.toCartesian(position))

    // 移动到的第2个目标点
    tempTime = Cesium.JulianDate.addSeconds(tempTime, 60, new Cesium.JulianDate())
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)
    property.addSample(tempTime, pt2)

    const graphic = new mars3d.graphic.PathEntity({
      position: property,
      style: {
        width: 2,
        color: "#ffff00",
        opacity: 1.0,

        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          color: "#ff0000"
        }
      },
      model: {
        url: "//data.mars3d.cn/gltf/mars/wrj.glb",
        scale: 0.5,
        minimumPixelSize: 40
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
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
