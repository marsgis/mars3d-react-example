import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.353044, lng: 117.230763, alt: 58544, heading: 1, pitch: -51 }
  },
  terrain: {
    show: false
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

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

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // let attr = event.graphic.attr
    console.log("单击了合并对象中的单个值为", pickedItem)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效

  addDemoGraphic(1)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 生成演示数据
export function addDemoGraphic(num) {
  graphicLayer.clear()

  showLoading()
  const startTime = new Date().getTime()

  const count = num * 10000

  const gridSize = 45 / Math.sqrt(count)

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const geojson = turf.pointGrid(bbox, gridSize, { units: "kilometers" })
  const arrData = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

  const radius = (gridSize * 1000) / 2

  for (let j = 0; j < arrData.length; ++j) {
    arrData[j].style = {
      length: radius * 2,
      topRadius: 0.0,
      bottomRadius: radius,
      color: Cesium.Color.fromRandom({ alpha: 0.5 })
    }
    arrData[j].attr = {
      name: "第" + j + "个"
    }
  }

  // 多个矢量对象的合并渲染。
  const primitive = new mars3d.graphic.CylinderCombine({
    instances: arrData,
    // style: {
    //   outline: true,
    //   outlineWidth: 1,
    //   outlineColor: "#ffffff",
    // },
    // 高亮时的样式
    highlight: {
      type: mars3d.EventType.click,
      color: Cesium.Color.YELLOW.withAlpha(0.9)
    }
  })
  graphicLayer.addGraphic(primitive)

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  // console.log(usedTime);

  globalMsg("生成" + arrData.length + "条数据，共耗时" + usedTime.toFixed(2) + "秒")
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
