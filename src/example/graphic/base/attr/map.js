import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.80696, lng: 117.13675, alt: 5022.3, heading: 0, pitch: -53.6 }
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

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
}

// 释放当前地图业务的生命周期函数
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // 所有graphic都支持attr传入业务属性信息，并支持交互、导出

  const graphic = new mars3d.graphic.BillboardEntity({
    name: "静态属性",
    position: [117.134078, 31.837297, 38.2],
    style: {
      image: "https://data.mars3d.cn/img/marker/point-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    popup: "all",
    attr: {
      name: "我的静态属性",
      remark: "我可以加任意业务属性，比如取到的数据库字段"
     }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  // 所有graphic都支持attr传入业务属性信息，并支持交互、导出
  // attr 也支持从后端读取的动态属性 API: http://mars3d.cn/api/BaseGraphic.html#.AjaxAttr

  const graphic = new mars3d.graphic.BillboardEntity({
    name: "ajax动态属性",
    position: [117.150802, 31.842468, 46],
    style: {
      image: "https://data.mars3d.cn/img/marker/lace-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    popup: "all",
    popupOptions: {
      offsetY: -26,
      timeRender: true // 当attr中有定时取值的属性时，可加timeRender。
    },
    attr: {
      type: "ajax",
      url: "http://studio-api.mars3d.cn/api/gap/open/appInfo",
      dataColumn: "data", // 接口返回数据中，对应的属性数据所在的读取字段名称，支持多级(用.分割)；如果数据直接返回时可以不配置。
      cacheTime: 1 // 在time秒内再次访问读取时，直接使用上一次历史值，避免高频访问后端。
    }
  })
  graphicLayer.addGraphic(graphic)
}
