import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.792193, lng: 121.48008, alt: 122, heading: 198, pitch: -54 }
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

  // 加个模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "水利闸门",
    url: "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
    position: { alt: 15.2 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true
  })
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

//  wall文字  primitive方式添加
function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [121.479914, 29.791249, 32],
      [121.479694, 29.791303, 32]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      text: "水利闸门",
      font_family: "楷体",
      fillColor: "#00ffff"
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive)
}

//  wall文字  primitive方式添加
function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [121.479343, 29.791419, 35],
      [121.479197, 29.791474, 35]
    ],
    style: {
      diffHeight: 5,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.Text, {
        text: "火星科技",
        font_size: 70,
        fillColor: "#3388cc",
        outlineWidth: 4
      })
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive)
}

// rectangle贴地矩形  3dtiles路面文字
function addDemoGraphic3(graphicLayer) {
  const rectanglePrimitive = new mars3d.graphic.RectanglePrimitive({
    name: "路面文字",
    positions: [
      [121.479989, 29.791162],
      [121.480114, 29.791201]
    ],
    style: {
      clampToGround: true,

      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.Text, {
        text: "火星路",
        font_size: 50,
        font_family: "楷体",
        fillColor: "#00ff00",
        stroke: true,
        strokeWidth: 2,
        strokeColor: "#ffffff"
      }),
      rotationDegree: 163,

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click,
        stroke: true,
        strokeColor: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
        strokeWidth: 5
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(rectanglePrimitive)
}

function addDemoGraphic4(graphicLayer) {
  const rectanglePrimitive = new mars3d.graphic.RectanglePrimitive({
    positions: [
      [121.479593, 29.791632, 13],
      [121.480136, 29.79169, 13]
    ],
    style: {
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.Text, {
        text: "火星科技Mars3D平台",
        font_size: 70,
        fillColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        stroke: true,
        strokeWidth: 2,
        strokeColor: new Cesium.Color(1.0, 1.0, 1.0, 0.8)
      }),
      rotation: Cesium.Math.toRadians(163),
      stRotation: Cesium.Math.toRadians(163),
      clampToGround: true
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(rectanglePrimitive)
}

// 添加数据
export function addDemoGraphic(count) {
  graphicLayer.clear()

  map.centerAt({ lat: 29.81612, lng: 121.476177, alt: 945, heading: 179, pitch: -22 })

  showLoading()
  const startTime = new Date().getTime()

  // 取区域内的随机图标
  function randomPoint(j) {
    const jd = random(121.460727 * 1000, 121.494659 * 1000) / 1000
    const wd = random(29.778576 * 1000, 29.806463 * 1000) / 1000
    return Cesium.Cartesian3.fromDegrees(jd, wd, 20)
  }

  const txtWidth = 90 // 图片宽度，单位：米
  const txtHeight = 40 // 图片高度，单位：米

  // 多个面对象的合并渲染。
  const instances = []
  for (let j = 0; j < count; ++j) {
    const position = randomPoint(j)

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 160, txtWidth)

    const primitive = new mars3d.graphic.WallPrimitive({
      positions: [position, pt1],
      style: {
        diffHeight: txtHeight,
        materialType: mars3d.MaterialType.Text,
        text: "第" + j + "个",
        font_family: "楷体",
        fillColor: "#00ffff"
      },
      tooltip: "第" + j + "个"
    })
    graphicLayer.addGraphic(primitive)
  }

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  console.log(usedTime)

  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
}

// 清除数据

// 取随机数据
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
        const parent = graphic._parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
