import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.548343, lng: 104.372096, alt: 8226.5, heading: 342.8, pitch: -43.1 }
  }
}

let colorRamp

export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer) // 在layer上绑定监听事件

  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    console.log("单击了合并对象中的单个值为", pickedItem)
  })

  colorRamp = new mars3d.ColorRamp({
    steps: [0, 30],
    colors: ["rgb(33, 113, 181)", "rgb(8, 48, 107)"]
  })

  let progressValue = 0 // 当前进度
  const intervalId = setInterval(() => {
    progressValue++
    if (progressValue < 216) {
      loadAndRenderGeoJSON(progressValue)
    } else {
      clearInterval(intervalId)
    }
  }, 200)
}

export function onUnmounted() {
  map = null
}

const floods = []

// 加载洪水数据
async function loadAndRenderGeoJSON(fileIndex) {
  const url = `//data.mars3d.cn/file/apidemo/floods/${fileIndex}.json`
  const features = await mars3d.Util.sendAjax({ url })
  const instances = []
  features.forEach((feature) => {
    const coordinates = feature.c
    instances.push({
      positions: coordinates[0],
      style: {
        color: colorRamp.getColor(feature.d)
      },
      attr: { depth: feature.d }
    })
  })

  const graphic = new mars3d.graphic.PolygonCombine({
    instances: instances, // 高亮时的样式
    popup: `深度:{depth}米`
  })
  graphicLayer.addGraphic(graphic)

  await graphic.readyPromise

  // 避免闪烁 + 占用内存 综合考虑，保留过渡的graphic
  if (floods.length > 3) {
    const a = floods.shift()
    a.remove()
  }
  floods.push(graphic)
}
