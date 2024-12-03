import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.314417, lng: 118.82149, alt: 78939, heading: 358, pitch: -46 }
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
  map.basemap = 2017

  // BusineDataLayer 业务数据(通过API接口获取)图层
  graphicLayer = new mars3d.layer.BusineDataLayer({
    url: "//data.mars3d.cn/file/apidemo/gaoxiao.json",
    symbol: {
      type: "divLightPoint",
      styleOptions: {
        color: "#f33349",
        size: 10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 200000,
        distanceDisplayCondition_near: 0
      }
    },
    // 自定义解析坐标
    formatPosition: (attr, graphic) => {
      const postion = attr["经纬度"].split(",") // 取到经纬度坐标
      if (postion.length !== 2) {
        return null
      } else {
        return postion
      }
    },
    popup: "all"
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)
    eventTarget.fire("refTree")
  })
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function getGraphicsTree(options) {
  return graphicLayer.getGraphicsTree(options)
}

export function getGraphicById(id) {
  return graphicLayer.getGraphicById(id)
}
