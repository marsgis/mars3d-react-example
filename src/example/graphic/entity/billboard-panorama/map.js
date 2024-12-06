import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.649617, lng: 117.081721, alt: 444, heading: 348, pitch: -25 }
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

  // 加载石化工厂模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "http://data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  // 创建DIV数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("您单击了", event)
  })

  // 在layer上绑定右键菜单
  graphicLayer.bindContextMenu(
    [
      {
        text: "查看摄像头",
        icon: "fa fa-trash-o",
        callback: (e) => {
          const graphic = e.graphic

          globalMsg("右键菜单示例")
        }
      }
    ],
    { offsetY: -170 }
  )

  graphicLayer.bindPopup((event) => {
    const attr = event.graphic.attr || {}
    if (!attr) {
      return
    }

    return `<iframe style="width: 600px; height: 300px; border: none; "src="${attr.url}"  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe> `
  }, { useGraphicPostion: true, offsetY: -30 })

  // 添加数据
  addRandomGraphicByCount(graphicLayer, [117.078006, 31.65649, 49.4])
  addRandomGraphicByCount(graphicLayer, [117.080571, 31.657898, 50.2])
  addRandomGraphicByCount(graphicLayer, [117.078331, 31.660016, 47.2])
  addRandomGraphicByCount(graphicLayer, [117.080397, 31.656139, 33.3]).openPopup()

  // console.log("导出数据测试", graphicLayer.toJSON())
  // const layer = mars3d.LayerUtil.create(json)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addRandomGraphicByCount(graphicLayer, position) {
  const graphic = new mars3d.graphic.BillboardEntity({
    position,
    style: {
      image: "//data.mars3d.cn/img/marker/lace-blue.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { url: "https://www.720yun.com/vr/b32jOOkmvm5", name: "上海浦江郊野公园" }
  })
  graphicLayer.addGraphic(graphic)

  return graphic
}
