import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.468597, lng: 117.24951, alt: 43443.9, heading: 2.1, pitch: -51.7 }
  },
  terrain: {
    show: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map // 创建矢量数据图层

  graphicLayer = new mars3d.layer.GraphicLayer({
    collision: { includeType: "label" } // 文字避让 关键配置
  })
  map.addLayer(graphicLayer) // 在layer上绑定监听事件

  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    console.log("单击了合并对象中的单个值为", pickedItem)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效 // 加一些演示数据

  addRandomGraphicByCount(10000)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
  graphicLayer.remove()
}

export function addDemoGraphic1() {
  const startTime = new Date().getTime()

  const url = "https://data.mars3d.cn/file/geojson/buildings-hf.json"
  mars3d.Util.fetchJson({ url }).then((data) => {
    console.log("1.geojson数据请求完成", data)
    const arr = mars3d.Util.geoJsonToGraphics(data, { hasGroup: false })

    console.log("2.开始渲染PolygonCombine对象", arr)

    const graphic = new mars3d.graphic.PolygonCombine({
      instances: arr, // 公共样式
      style: {
        randomColor: true,
        flat: true,
        label: { text: "{NAME}" }
      },
      // 高亮时的样式
      highlight: {
        type: mars3d.EventType.click,
        color: Cesium.Color.YELLOW.withAlpha(0.9)
      }
    })
    graphicLayer.addGraphic(graphic)

    graphic.readyPromise.then(() => {
      console.log("3.PolygonCombine渲染完成")

      const endTime = new Date().getTime()
      const usedTime = (endTime - startTime) / 1000 // 两个时间戳相差的毫秒数
      globalMsg(`生成${arr.length}条数据，共耗时${usedTime.toFixed(2)}秒`) // 多个面对象的合并渲染。
    })
  })
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.LabelPrimitive({
      position,
      style: {
        text: "第" + index + "个",
        font_size: 46,
        scale: 0.5,
        font_family: "楷体",
        color: "#ffff00",
        outline: true,
        outlineColor: "#000000",
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
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
