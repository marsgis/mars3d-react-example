import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.822897, lng: 117.13302, alt: 6666.9, heading: 2.2, pitch: -74 }
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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
}

// 释放当前地图业务的生命周期函数
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // 点状数据的坐标是传 position 参数
  // position支持从后端读取的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.AjaxPosition

  const graphic = new mars3d.graphic.BillboardEntity({
    position: {
      type: "ajax",
      url: "http://studio-api.mars3d.cn/api/gap/open/random/point",
      dataColumn: "data", // 接口返回数据中，对应的属性数据所在的读取字段名称，支持多级(用.分割)；如果数据直接返回时可以不配置。
      latColumn: "lat",
      lngColumn: "lng",
      altColumn: "alt",
      time: 4 // 无配置时仅取值一次，有值时间隔time秒后不断取
    },
    style: {
      image: "https://data.mars3d.cn/img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "点状数据position" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  // 线面状数据的坐标是传 positions 参数
  // positions支持从后端读取的动态坐标，API: http://mars3d.cn/api/BaseGraphic.html#.AjaxPolyPositions
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: {
      type: "ajax",
      url: "http://studio-api.mars3d.cn/api/gap/open/random/points?lng=117.133646&lat=31.843726",
      dataColumn: "data", // 接口返回数据中，对应的属性数据所在的读取字段名称，支持多级(用.分割)；如果数据直接返回时可以不配置。
      latColumn: "lat",
      lngColumn: "lng",
      altColumn: "alt",
      time: 5 // 无配置时仅取值一次，有值时间隔time秒后不断取
    },
    style: {
      width: 4,
      color: "#ffff00"
    },
    attr: { remark: "线面状数据坐标positions" }
  })
  graphicLayer.addGraphic(graphic)
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
