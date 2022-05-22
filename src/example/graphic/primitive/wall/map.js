import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.516143, lng: 117.282937, alt: 46242, heading: 2, pitch: -49 }
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
  addDemoGraphic1()
  addDemoGraphic2()
  addDemoGraphic3()
  addDemoGraphic4()
  addDemoGraphic5()
  addDemoGraphic6()
  addDemoGraphic7()
  addDemoGraphic8()
  addDemoGraphic9()
  addDemoGraphic10()

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340100.json" }).then(function (data) {
    addDemoGraphic11(data)
  })
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

function addDemoGraphic1() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.153945, 31.881122, 36.4],
      [117.168352, 31.880147, 32.6],
      [117.178047, 31.885925, 29.25]
    ],
    style: {
      diffHeight: 200,
      color: "#ffff00",
      opacity: 0.4,

      label: { text: "鼠标移入会高亮" },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        // type: mars3d.EventType.click,
        opacity: 0.8
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive)

  initGraphicManager(primitive)
}

function addDemoGraphic2() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
        image: "img/textures/arrow.png",
        color: Cesium.Color.CHARTREUSE,
        repeat: new Cesium.Cartesian2(30, 1),
        speed: 20 // 速度，建议取值范围1-100
      })
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic3() {
  // 圆形时
  const positions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: Cesium.Cartesian3.fromDegrees(117.276257, 31.866351, 19.57),
    radius: 1200, // 半径
    count: 50 // 共返回(count*4)个点
  })

  const primitive = new mars3d.graphic.WallPrimitive({
    positions: positions,
    style: {
      diffHeight: 800,
      closure: true,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
        image: "img/textures/fence.png",
        color: "#ffff00",
        speed: 10, // 速度，建议取值范围1-100
        axisY: true
      })
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic4() {
  const primitive = new mars3d.graphic.WallPrimitive({
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
      [117.151215, 31.844734]
    ],
    style: {
      closure: true,
      diffHeight: 700,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
        // 动画线材质
        image: "img/textures/fence.png",
        axisY: true,
        color: "#ff0000",
        speed: 10 // 速度，建议取值范围1-100
      })
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic5() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.229659, 31.908221],
      [117.240804, 31.908175]
    ],
    style: {
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
        // 动画线材质
        image: "img/textures/fence.png",
        axisY: true,
        color: "#ff0000",
        hasImage2: true,
        image2: "img/textures/tanhao.png",
        color2: "#ffff00",
        speed: 10 // 速度，建议取值范围1-100
      }),
      label: {
        text: "我是墙",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic6() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.169646, 31.769171],
      [117.194579, 31.806466]
    ],
    style: {
      diffHeight: 400,
      image: "img/textures/movingRiver.png"
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic7() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.353776, 31.887406, 21.2],
      [117.321028, 31.887207, 21.3],
      [117.290341, 31.902469, 15.1]
    ],
    style: {
      diffHeight: 400,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
        image: "img/textures/arrow.png",
        color: "#00eba8",
        repeat: new Cesium.Cartesian2(20, 1),
        speed: 20 // 速度，建议取值范围1-100
      })
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic8() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.251382, 31.824055, 28.4],
      [117.278989, 31.819766, 27.3],
      [117.279566, 31.799699, 3.9],
      [117.265249, 31.797702, 26.3],
      [117.245146, 31.811783, 29]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.WallScroll, {
        image: "img/textures/fence.png",
        color: Cesium.Color.CHARTREUSE,
        count: 3,
        speed: 20,
        bloom: false
      })
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic9() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.31104, 31.821121, 14],
      [117.330257, 31.823798, 9.9],
      [117.334015, 31.804235, 9.8],
      [117.317901, 31.802142, 14.9],
      [117.312515, 31.807128, 6.2]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.WallScroll, {
        image: "img/textures/poly-san.png",
        color: Cesium.Color.RED,
        count: 2,
        direction: 1,
        speed: 20,
        bloom: true
      })
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic10() {
  const primitive = new mars3d.graphic.WallPrimitive({
    positions: [
      [117.374042, 31.838945, 11.6],
      [117.392644, 31.835948, 4.7],
      [117.397659, 31.820042, 8],
      [117.378515, 31.810404, 2]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.WallScroll, {
        image: "img/textures/line-color3.png",
        color: Cesium.Color.BLUE,
        count: 5,
        direction: -1,
        speed: 20,
        bloom: true
      })
    },
    attr: { remark: "示例9" }
  })
  graphicLayer.addGraphic(primitive)
}

// 显示合肥市边界
function addDemoGraphic11(data) {
  const arr = mars3d.Util.geoJsonToGraphics(data) // 解析geojson
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const primitive = new mars3d.graphic.WallPrimitive({
      positions: item.positions,
      style: {
        diffHeight: 3000,
        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
          image: "img/textures/fence.png",
          color: "#bdf700",
          repeat: new Cesium.Cartesian2(5, 1),
          axisY: true, // 方向，true时上下，false左右
          speed: 10 // 速度，建议取值范围1-100
        })
      },
      attr: item.attr
    })
    graphicLayer.addGraphic(primitive)
    primitive.bindTooltip("合肥欢迎您 - 火星科技")
  }
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
        graphicLayer.removeGraphic(graphic)
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
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
