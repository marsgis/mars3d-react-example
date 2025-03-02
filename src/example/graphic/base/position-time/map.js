import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.656235, lng: 117.136489, alt: 18627.2, heading: 2.2, pitch: -51.5 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
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
  addDemoGraphic11(graphicLayer)
  addDemoGraphic12(graphicLayer)
  addDemoGraphic21(graphicLayer)
  addDemoGraphic22(graphicLayer)

  const timeRange = graphicLayer.timeRange
  if (map.control.timeline && timeRange) {
    map.control.timeline.zoomTo(timeRange.startTime, timeRange.stopTime)
  }
}

// 释放当前地图业务的生命周期函数
export function onUnmounted() {
  map = null
}

function addDemoGraphic11(graphicLayer) {
  // 点状数据的坐标是传 position 参数
  // position支持从时序的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.TimePosition

  const graphic = new mars3d.graphic.BillboardEntity({
    position: {
      type: "time", // 时序动态坐标
      speed: 800,
      list: [
        [117.228059, 31.791955, 33.1],
        [117.207606, 31.79867, 32],
        [117.192154, 31.809156, 34.1],
        [117.207802, 31.84243, 36.6]
      ]
    },
    style: {
      image: "https://data.mars3d.cn/img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "点状数据time类型position" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic12(graphicLayer) {
  // 轨迹数据的坐标是传 position 参数
  // position支持从时序的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.TimePosition

  const fixedRoute = new mars3d.graphic.FixedRoute({
    name: "步行路线",
    position: {
      type: "time", // 时序动态坐标
      speed: 700,
      pauseTime: 0.5,
      list: [
        [117.166589, 31.819284, 41.4],
        [117.151892, 31.804337, 33.1],
        [117.152427, 31.78383, 24.6],
        [117.191639, 31.784981, 30.3]
      ]
    },
    frameRate: 1,
    showStop: true,
    model: {
      url: "https://data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50
    },
    polyline: {
      color: "#ffff00",
      width: 2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // fixedRoute.openPopup() // 显示popup

  fixedRoute.start()

  // setTimeout(() => {
  //   fixedRoute.setOptions({ model: { show: false } })
  // }, 3000)
}

function addDemoGraphic21(graphicLayer) {
  // 线面状数据的坐标是传 positions 参数
  // positions支持从时序的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.TimePolyPositions

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: {
      type: "time",
      list: [
        {
          time: 5,
          positions: [
            [117.010135, 31.813058, 34.8],
            [117.035708, 31.794232, 35.2],
            [117.029614, 31.767019, 41.7]
          ]
        },
        {
          time: 10,
          positions: [
            [117.075295, 31.848101, 33.5],
            [117.100002, 31.818779, 33],
            [117.080677, 31.796511, 28.5],
            [117.090381, 31.761569, 30.1]
          ]
        },
        {
          time: 20,
          positions: [
            [117.149741, 31.864366, 32.5],
            [117.118684, 31.835242, 35.4],
            [117.153748, 31.821125, 38.8],
            [117.125668, 31.797425, 26.8],
            [117.153006, 31.784057, 24.8],
            [117.126791, 31.767478, 15.2]
          ]
        },
        {
          time: 30,
          positions: [
            [117.19204, 31.810702, 31.7],
            [117.208252, 31.760556, 25.1],
            [117.164393, 31.744924, 12.4]
          ]
        },
        {
          time: 40,
          positions: [
            [117.210314, 31.72052, 13.6],
            [117.063394, 31.724854, 49.5]
          ]
        }
      ],
      interpolation: true
    },
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "线数据time类型positions" }
  })
  graphicLayer.addGraphic(graphic)

  window.graphic = graphic // 方便F12测试
}

function addDemoGraphic22(graphicLayer) {
  // 线面状数据的坐标是传 positions 参数
  // positions支持从时序的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.TimePolyPositions

  const graphic = new mars3d.graphic.PolygonEntity({
    positions: {
      type: "time", // 时序动态坐标
      list: [
        {
          time: 5,
          positions: [
            [117.171524, 31.796989, 27.9],
            [117.201915, 31.782426, 36.3],
            [117.173053, 31.769166, 16.8]
          ]
        },
        {
          time: 15,
          pauseTime: 4,
          positions: [
            [117.207479, 31.762051, 26.2],
            [117.228616, 31.747205, 23.3],
            [117.221875, 31.729595, 21.8],
            [117.1972, 31.728751, 15.6],
            [117.188988, 31.745452, 16.1]
          ]
        },
        {
          time: 30,
          positions: [
            [117.281354, 31.784189, 28],
            [117.281777, 31.758727, 13.5],
            [117.250985, 31.758001, 22.9],
            [117.24984, 31.78339, 52.1]
          ]
        }
      ],
      interpolation: true // setInterpolationOptions插值
    },
    style: {
      color: "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#ffffff",
      label: { text: "我是时序动态面" }
    },
    attr: { remark: "面数据的time类型positions" }
  })
  graphicLayer.addGraphic(graphic)
}

// 开始绘制
export async function startDrawGraphic() {
  const graphic = await graphicLayer.startDraw({
    type: "billboard",
    position: {
      type: "time", // 时序动态坐标
      speed: 460
    },
    style: {
      image: "https://data.mars3d.cn/img/marker/point-yellow.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    frameRate: 1 // 当postion为时序坐标时，多少帧获取一次数据。用于控制效率，如果卡顿就把该数值调大一些。
  })
  console.log("标绘完成", graphic.toJSON())
}

// 开始绘制
export async function startDrawGraphic2() {
  const graphic = await graphicLayer.startDraw({
    type: "fixedRoute",
    showStop: true,
    model: {
      url: "https://data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50
    },
    polyline: {
      width: 6,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "#00ffff",
        image: "https://data.mars3d.cn/img/textures/arrow-small.png",
        repeat: new Cesium.Cartesian2(80, 1),
        speed: 30,
        bgColor: "rgba(0,255,255,0.3)"
      },
      showAll: true
    }
  })

  graphic.start()
  console.log("标绘完成", graphic.toJSON())
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
      text: "编辑下一个时序",
      icon: "fa fa-fast-forward",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit || !graphic.hasTimePostions) {
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
          const thisIndex = graphic.editing.timeIndex
          if (thisIndex + 1 >= graphic.editing.maxTimeIndex) {
            graphic.editing.timeIndex = 0
          } else {
            graphic.editing.timeIndex = thisIndex + 1
          }
        }
      }
    },
    {
      text: "编辑上一个时序",
      icon: "fa fa-backward",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit || !graphic.hasTimePostions) {
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
          const thisIndex = graphic.editing.timeIndex
          if (thisIndex - 1 <= 0) {
            graphic.editing.timeIndex = graphic.editing.maxTimeIndex - 1
          } else {
            graphic.editing.timeIndex = thisIndex - 1
          }
        }
      }
    },
    {
      text: "开始漫游",
      icon: "fa fa-play-circle-o",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || graphic.type !== "fixedRoute") {
          return false
        }
        return !graphic.isStart
      },
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.start()
        }
      }
    },
    {
      text: "停止漫游",
      icon: "fa fa-stop-circle-o",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || graphic.type !== "fixedRoute") {
          return false
        }
        return graphic.isStart
      },
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.stop()
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
        if (graphic.cluster && graphic.graphics) {
          return true
        } else {
          return false
        }
      },
      callback: (e) => {
        const graphics = e.graphic?.graphics
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
