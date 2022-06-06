import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.404343, lng: 117.327155, alt: 46410, heading: 2, pitch: -49 }
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
  const graphic = new mars3d.graphic.Regular({
    positions: [
      [117.237988, 31.827364, 30]
      // [117.180234, 31.826722, 30],
    ],
    style: {
      border: 3, // 多边形边数量
      radius: 5000,
      startAngle: 0, // 开始角度(正东方向为0,顺时针到360度)

      color: "#3388ff",
      opacity: 0.5,
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
    attr: { remark: "示例1", name: "正三角形" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  initGraphicManager(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.Regular({
    position: [117.357442, 31.854502, 30],
    style: {
      border: 4, // 多边形边数量
      radius: 3000,
      startAngle: 20, // 开始角度(正东方向为0,顺时针到360度)
      clampToGround: true,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.Image, {
        image: "img/textures/poly-lake.jpg",
        color: Cesium.Color.WHITE.withAlpha(0.8) // 透明度处理
      })
    },
    attr: { remark: "示例2", name: "正方形" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.Regular({
    position: [117.250028, 31.729021, 30],
    style: {
      border: 5, // 多边形边数量
      radius: 3000,
      startAngle: 30, // 开始角度(正东方向为0,顺时针到360度)
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.Water, {
        normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
        frequency: 8000.0, // 控制波数的数字。
        animationSpeed: 0.02, // 控制水的动画速度的数字。
        amplitude: 5.0, // 控制水波振幅的数字。
        specularIntensity: 0.8, // 控制镜面反射强度的数字。
        baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
        blendColor: "#006ab4" // 从水中混合到非水域时使用的rgba颜色对象。
      })
    },
    attr: { remark: "示例3", name: "正五角形" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.Regular({
    position: [117.371943, 31.765769, 15.6],
    style: {
      border: 6, // 多边形边数量
      radius: 3000,
      startAngle: 40, // 开始角度(正东方向为0,顺时针到360度)
      diffHeight: 2000.0,
      color: Cesium.Color.YELLOW,
      opacity: 0.5,
      closeTop: false,
      closeBottom: false,

      label: { text: "鼠标移入会高亮" },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.9
      }
    },
    attr: { remark: "示例4", name: "正六角形" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
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
        const parent = graphic._parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
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
    type: "regular",
    style: {
      border: 3, // 多边形边数量
      color: "#29cf34",
      opacity: 0.5,
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
    }
  })
}
export function onClickDrawModelExtruded() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "regular",
    style: {
      color: "#00ff00",
      opacity: 0.5,
      diffHeight: 300
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
