import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.778267, lng: 116.350072, alt: 2899.9, heading: 351.8, pitch: -16.3 },
    globe: {
      depthTestAgainstTerrain: true
    }
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
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const bbox = [116.29368, 30.832263, 116.37264, 30.895221]
  const result = mars3d.PolyUtil.getGridPoints(bbox, 10000)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.BillboardPrimitive({
      position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, getRandomHeight()),
      style: {
        image: "https://data.mars3d.cn/img/marker/droplet.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        height: 10,
        width: 10,
        scaleByDistance: new Cesium.NearFarScalar(100, 1, 50000, 0.2)
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
    rainDrops.push(graphic)
  }

  map.on(mars3d.EventType.postRender, () => {
    updateRainPositions()
  })
}

const rainDrops = []

// 更新所有雨滴的位置
function updateRainPositions() {
  rainDrops.forEach((billboard) => {
    const point = billboard.point
    let height = point.alt

    // 如果高度小于0，则重新设置为随机高度
    if (height < minHeight) {
      height = getRandomHeight()
    } else {
      height -= 10 // 向下移动雨滴
    }
    point.alt = height

    billboard.position = point // 更新雨滴的位置
  })
}

// 获取一个随机的雨滴高度\
const minHeight = 377
function getRandomHeight() {
  return Math.floor(Math.random() * (5000 - 1000 + 1)) + minHeight
}
