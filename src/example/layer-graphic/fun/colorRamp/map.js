import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.804075, lng: 104.419481, alt: 10628, heading: 358.4, pitch: -60.9 }
  }
}

let colorRamp

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({ popup: "all" })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  colorRamp = new mars3d.ColorRamp({
    steps: [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    colors: ["#0A0A80", "#0000CD", "#1F497D", "#4682B4", "#00FFFF", "#00FF7F", "#8FBC8F", "#FFFF00", "#FFA500", "#FF4500", "#FF0000", "#8B0000"]
  })

  mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/flood-point.json" }).then(function (result) {
    for (let i = 0; i < result.length; i++) {
      const item = result[i]
      const graphic = new mars3d.graphic.PointPrimitive({
        position: [item.lon, item.lat, 650],
        style: {
          color: colorRamp.getColor(item.val),
          pixelSize: 7
        },
        attr: { 水深: item.val }
      })
      graphicLayer.addGraphic(graphic)
    }

    // graphicLayer.flyTo()
  })
}
