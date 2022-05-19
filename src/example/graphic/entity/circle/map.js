import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.740724, lng: 116.363055, alt: 23499, heading: 351, pitch: -54 }
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
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  // addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
  addDemoGraphic11(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

//
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: [116.253946, 30.865476, 881.9],
    style: {
      radius: 800.0,
      color: "#00ff00",
      opacity: 0.3,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      clampToGround: true
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 演示个性化处理graphic
  initGraphicManager(graphic)
}

//
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: [116.244399, 30.920459],
    style: {
      radius: 2000,
      height: 200,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
        color: "#ffff00",
        count: 2,
        speed: 20
      }),
      label: {
        text: "我是原始的\n测试换行",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.position = [116.301991, 30.933872, 624.03]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.392526, 30.903729, 933.55),
    style: {
      radius: 1500.0,
      diffHeight: 1000.0,
      color: "#00ff00",
      opacity: 0.3,
      rotationDegree: 45,

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.329199, 30.881595, 390.3),
    style: {
      radius: 1500.0,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
        // color: "#ff0000",
        color: new Cesium.CallbackProperty(function () {
          return Cesium.Color.BLUE
        }, false),
        count: 1, // 单个圆圈
        speed: 20
      })
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic5(graphicLayer) {
  let _rotation = Math.random()

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.37617, 30.847384, 396.12),
    style: {
      radius: 1500.0,
      clampToGround: false,
      // 扫描材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleScan, {
        image: "img/textures/circleScan.png",
        color: "#5fc4ee",
        opacity: 1.0
      }),
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation -= 0.1
        return _rotation
      }, false),
      classificationType: Cesium.ClassificationType.BOTH
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  let _rotation = Math.random()
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.326329, 30.84786, 421.7),
    style: {
      radius: 1000.0,
      // 扫描材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleScan, {
        image: "img/textures/circle_bg.png",
        color: "#ffff00"
      }),
      stRotation: new Cesium.CallbackProperty(function (e) {
        _rotation += 0.1
        return _rotation
      }, false)
    },
    attr: { remark: "示例6" },
    hasEdit: false // 不允许编辑
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic7(graphicLayer) {
  let currentRadius = 1
  const duration = 5000 // 毫秒
  const maxRadius = 2000 // 米

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.271298, 30.831822, 634),
    style: {
      semiMajorAxis: new Cesium.CallbackProperty(function (event) {
        currentRadius += (1000 / duration) * 50
        if (currentRadius > maxRadius) {
          currentRadius = 1
        }
        return currentRadius
      }, false),
      semiMinorAxis: new Cesium.CallbackProperty(function (event) {
        return currentRadius
      }, false),
      // 扫描材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleScan, {
        image: "img/textures/hexagon.png",
        color: "#ff0000",
        opacity: 1.0
      })
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  const canvasCollection = document.createElement("canvas")
  canvasCollection.setAttribute("width", "800px")
  canvasCollection.setAttribute("height", "800px")

  let rotation = 0
  const step = -0.02

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(116.326672, 30.811903, 605),
    style: {
      radius: 2000,
      rotation: new Cesium.CallbackProperty(() => {
        rotation -= step
        return rotation
      }, false),
      stRotation: new Cesium.CallbackProperty(() => {
        rotation -= step
        return rotation
      }, false),
      material: new Cesium.ImageMaterialProperty({
        image: new Cesium.CallbackProperty(() => {
          const context = canvasCollection.getContext("2d")
          context.clearRect(0, 0, canvasCollection.width, canvasCollection.height) // 清空画布

          const scanColor0 = "rgba(0,255,255,1)"
          const scanColorTmp = scanColor0.split(",")
          scanColorTmp[3] = "0)"
          const scanColor1 = scanColorTmp.join()

          const grd = context.createLinearGradient(175, 100, canvasCollection.width, canvasCollection.height / 2)
          grd.addColorStop(0, scanColor0)
          grd.addColorStop(1, scanColor1)
          context.fillStyle = grd
          context.beginPath()
          context.moveTo(400, 400)
          context.arc(400, 400, 400, (-30 / 180) * Math.PI, (0 / 180) * Math.PI)
          context.fill()

          const newImg = new Image(canvasCollection.width, canvasCollection.height)
          newImg.src = canvasCollection.toDataURL("image/png")

          return newImg
        }, false),
        transparent: true
      })
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic9(graphicLayer) {
  let lastPosition
  let lastHeight = 0

  const circleEntity = new mars3d.graphic.CircleEntity({
    position: new Cesium.CallbackProperty(function (time) {
      const center = map.getCenter()
      if (center) {
        lastHeight = center.alt + 10
        lastPosition = center.toCartesian()
      }
      return lastPosition
    }, false),
    style: {
      material: "img/tietu/bagua.png",
      radius: 500,
      // height: new Cesium.CallbackProperty(function (time) {
      //   return lastHeight
      // }, false)
      clampToGround: true
    },
    attr: { remark: "示例9" },
    hasEdit: false
  })
  graphicLayer.addGraphic(circleEntity)
}

function addDemoGraphic10(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LatLngPoint(116.365776, 30.963614, 1090.7),
    style: {
      radius: 500,
      opacity: 0.4,
      color: "#02D4FD",
      outline: false,
      outlineColor: "#8A99B4",
      outlineWidth: 2,
      outlineOpacity: 1,
      clampToGround: true
    }
  })
  graphicLayer.addGraphic(graphic)

  let newRadius = 500

  graphic.radius = new Cesium.CallbackProperty(function (time) {
    if (newRadius < 2000) {
      newRadius += 10
    }
    return newRadius
  }, false)
}

function addDemoGraphic11(graphicLayer) {
  let alpha = 1
  let biaoshi = true

  const graphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LatLngPoint(116.261813, 30.9766, 1310.1),
    style: {
      radius: 900,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function () {
          if (biaoshi) {
            alpha = alpha - 0.05
            if (alpha <= 0) {
              biaoshi = false // hide
            }
          } else {
            alpha = alpha + 0.05
            if (alpha >= 1) {
              biaoshi = true // show
            }
          }
          return Cesium.Color.RED.withAlpha(alpha)
        }, false)
      )
    }
  })
  graphicLayer.addGraphic(graphic)
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

  // 数据编辑相关事件， 用于属性弹窗的交互
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    eventTarget.fire("graphicEditor-start", e)
  })
  graphicLayer.on(
    [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
    function (e) {
      eventTarget.fire("graphicEditor-update", e)
    }
  )
  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    eventTarget.fire("graphicEditor-stop", e)
  })
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
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.startEditing) {
          return false
        }
        return !graphic.isEditing
      },
      callback: function (e) {
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
        if (!graphic) {
          return false
        }
        return graphic.isEditing
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.stopEditing(graphic)
        }
      }
    },
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

export function updateLayerHasEdit(val) {
  graphicLayer.hasEdit = val
}

// 按钮事件
export function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.6,
      clampToGround: false,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      label: {
        text: "我是火星科技",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    drawShowRadius: true
  })
}
export function onClickDrawModelExtruded() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ff0000",
      opacity: 0.5,
      diffHeight: 600,

      highlight: {
        type: "click",
        opacity: 0.9
      }
    }
  })
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
