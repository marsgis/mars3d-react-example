import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.756263, lng: 117.209077, alt: 7696, heading: 5, pitch: -33 }
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

  bindLayerEvent() // 对图层绑定相关事件
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

  graphic.addDynamicPosition(randomPoint(), 0)
  graphic.addDynamicPosition(randomPoint(), 20)

  // 定时更新动态位置（setInterval为演示）
  setInterval(() => {
    graphic.addDynamicPosition(randomPoint(), 20)
  }, 20000)
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
        const parent = graphic._parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}


