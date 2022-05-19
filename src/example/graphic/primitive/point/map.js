import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.PointPrimitive({
    position: [116.244399, 30.920459, 573.6],
    style: {
      pixelSize: 8,
      color: Cesium.Color.fromCssColorString("#FED976").withAlpha(0.9),
      label: {
        text: "我是原始点",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法

  // 演示对graphic的个性化处理
  initGraphicManager(primitive)

  // 转geojson
  const geojson = primitive.toGeoJSON()
  console.log("转换后的geojson", geojson)
}

function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.PointPrimitive({
    position: [116.39224, 30.902853],
    style: {
      pixelSize: 9,
      color: "#ff0000",
      clampToGround: true
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic3(graphicLayer) {
  const primitive = new mars3d.graphic.PointPrimitive({
    position: [116.340443, 30.882935, 389.88],
    style: {
      color: "#ffff00",
      pixelSize: 10,
      outlineWidth: 0,

      label: { text: "鼠标单击会高亮", pixelOffsetY: -10 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
        pixelSize: 15,
        outlineColor: "#ff0000",
        outlineWidth: 2
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic4(graphicLayer) {
  const primitive = new mars3d.graphic.PointPrimitive({
    position: new mars3d.LngLatPoint(116.329102, 30.977955, 1548.6),
    style: {
      color: Cesium.Color.BLUE,
      pixelSize: 20,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

// 添加数据
export function addDemoGraphic(count) {
  graphicLayer.clear()

  showLoading()
  const startTime = new Date().getTime()

  count = count * 10000

  for (let j = 0; j < count; ++j) {
    const position = randomPoint()

    const color = Cesium.Color.fromRandom({
      minimumRed: 0.75,
      minimumGreen: 0.75,
      minimumBlue: 0.75,
      alpha: 1.0
    })

    const primitive = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        color: color,
        pixelSize: 5,
        outlineColor: "#000000",
        outlineWidth: 1
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
    }
  ])
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  /* graphic.on(mars3d.EventType.click, function (event) {
    console.log("监听graphic，单击了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听graphic，鼠标移入了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听graphic，鼠标移出了矢量对象", event)
  }) */

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
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(116.1 * 1000, 116.6 * 1000) / 1000
  const wd = random(30.8 * 1000, 31.1 * 1000) / 1000
  const height = random(1000, 9000)
  return new mars3d.LngLatPoint(jd, wd, height)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
