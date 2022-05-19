import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let textMaterialProperty
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 29.792325, lng: 121.480055, alt: 146, heading: 198, pitch: -54 }
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

  bindLayerEvent()

  // 材质对象
  textMaterialProperty = mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.Text, {
    text: "火星科技Mars3D平台",
    fillColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
    stroke: true,
    strokeWidth: 2,
    strokeColor: new Cesium.Color(1.0, 1.0, 1.0, 0.8)
  })

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
  removeAll()
}

// wall文字 entity方式
function addDemoGraphic1(graphicLayer) {
  const wallEntity = new mars3d.graphic.WallEntity({
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

  graphicLayer.addGraphic(wallEntity)
}

//  wall文字  primitive方式添加
function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.WallEntity({
    positions: [
      [121.479343, 29.791419, 35],
      [121.479197, 29.791474, 35]
    ],
    style: {
      diffHeight: 5,
      materialType: mars3d.MaterialType.Text,
      text: "   火星科技",
      font_size: 70,
      fillColor: "#3388cc",
      outlineWidth: 4,

      onCustomCanvas: onCustomCanvas // 对Canvas做自定义处理
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive)
}

// 对Canvas做自定义处理,需要返回Promise
function onCustomCanvas(canvas, material) {
  const cWidth = canvas.width
  const cHeight = canvas.height
  const context = canvas.getContext("2d")

  return Cesium.Resource.createIfNeeded("./img/country/zg.png")
    .fetchImage()
    .then((image) => {
      context.drawImage(image, 5, 5, 20, 20)

      return canvas
    })
}

// rectangle贴地矩形  3dtiles路面文字
function addDemoGraphic3(graphicLayer) {
  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    name: "路面文字",
    positions: [
      [121.479989, 29.791162],
      [121.480114, 29.791201]
    ],
    style: {
      classificationType: Cesium.ClassificationType.BOTH,
      clampToGround: true,

      materialType: mars3d.MaterialType.Text,
      text: "火星路",
      font_size: 50,
      font_family: "楷体",
      fillColor: "#00ff00",
      stroke: true,
      strokeWidth: 2,
      strokeColor: "#ffffff",
      rotationDegree: 163,

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        type: mars3d.EventType.click,
        stroke: true,
        strokeColor: "#ff0000",
        strokeWidth: 4
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

function addDemoGraphic4(graphicLayer) {
  const rectangleEntity = new mars3d.graphic.RectangleEntity({
    positions: [
      [121.479593, 29.791632, 13],
      [121.480136, 29.79169, 13]
    ],
    style: {
      material: textMaterialProperty,
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(rectangleEntity)
}

let rotation = 0
function getRotationValue() {
  return rotation
}

// 在图层级处理一些事物
function bindLayerEvent() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 创建完成，事件监听
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    // 绘制点，计算矩形的生成，特殊处理一下，点的话不用弹出属性面板
    if (e.drawtype === "point") {
      return
    }
    eventTarget.fire("graphicEditor-start", e)
  })

  // 数据编辑相关事件， 用于属性弹窗的交互
  graphicLayer.on(
    [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
    function (e) {
      // 绘制点，计算矩形的生成，特殊处理一下，点的话不用弹出属性面板
      if (e.edittype === "point") {
        return
      }
      eventTarget.fire("graphicEditor-update", e)
    }
  )
  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    eventTarget.fire("graphicEditor-stop", e)
  })

  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    }
  ])
}

export function onClickDrawWall() {
  graphicLayer.startDraw({
    type: "wall",
    maxPointNum: 2,
    style: {
      font_size: 50,
      color: "#ffff00",
      outline: false,
      diffHeight: 5,
      material: textMaterialProperty
    },
    success: function (graphic) {
      console.log(JSON.stringify(graphic.coordinates)) // 打印下边界
    }
  })
}

export function onClickDrawRectangle() {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      material: textMaterialProperty,
      rotation: new Cesium.CallbackProperty(getRotationValue, false),
      stRotation: new Cesium.CallbackProperty(getRotationValue, false),
      clampToGround: true
    },
    success: function (graphic) {
      console.log(JSON.stringify(graphic.coordinates)) // 打印下边界
    }
  })
}

// 根据中心点来计算矩形
export function onClickDrawPoint() {
  graphicLayer.startDraw({
    type: "point",
    style: {
      color: "#ffff00",
      clampToGround: true
    },
    success: function (graphic) {
      const position = graphic.positionShow
      const positions = mars3d.PolyUtil.getRectPositionsByCenter({
        center: position,
        width: 60,
        height: 10
      })

      const rectangleEntity = new mars3d.graphic.RectangleEntity({
        positions: positions,
        style: {
          material: textMaterialProperty,
          rotation: new Cesium.CallbackProperty(getRotationValue, false),
          stRotation: new Cesium.CallbackProperty(getRotationValue, false),
          clampToGround: true
        }
      })
      graphicLayer.addGraphic(rectangleEntity)

      eventTarget.fire("graphicEditor-start", { graphic: rectangleEntity })
    }
  })
}

export function onChangeSlider(val) {
  if (val) {
    rotation = Cesium.Math.toRadians(val)
  }
}

export function onClickSure(val) {
  textMaterialProperty.text = val
}

export function removeAll() {
  graphicLayer.clear()
}
