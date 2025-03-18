import * as mars3d from "mars3d"
import kriging from "./krigingConfig"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 24.018309, lng: 109.414236, alt: 8607884, heading: 0, pitch: -82 },
    contextOptions: { webgl: { preserveDrawingBuffer: true } } // 从屏幕取颜色的关键配置
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.on(mars3d.EventType.mouseMove, function (event) {
    const color = getMouseColor(event.endPosition)
    eventTarget.fire("changeColor", { color })
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer
export function addTileLayer() {
  removeTileLayer()

  mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/geojson/temperature.json" })
    .then(function (geojson) {
      console.log("加载数据完成", geojson)

      // eslint-disable-next-line no-undef
      const image = loadkriging(geojson.features, kriging_bounds, kriging_colors)
      tileLayer = new mars3d.layer.ImageLayer({
        url: image,
        rectangle: {
          xmin: 73.4766,
          xmax: 135.088,
          ymin: 18.1055,
          ymax: 53.5693
        },
        alpha: 0.4
      })
      map.addLayer(tileLayer)
    })
    .catch(function (error) {
      console.log("构造出错了", error)
    })
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// 根据 克里金法 插值绘制图片
function loadkriging(tempture, bounds, colors) {
  // let canvas = document.createElement("canvas")
  const canvas = mars3d.DomUtil.create("canvas")
  canvas.width = 2000
  canvas.height = 2000

  const t = []
  const x = []
  const y = []
  for (let i = 0, len = tempture.length; i < len; i++) {
    t.push(tempture[i].properties.Temperatur) // 权重值
    x.push(tempture[i].geometry.coordinates[0]) // x
    y.push(tempture[i].geometry.coordinates[1]) // y
  }
  // 1.用克里金训练一个variogram对象

  const variogram = kriging.train(t, x, y, "exponential", 0, 100)

  // 2.使用刚才的variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值；
  // bounds:普通的geojson格式的面的格式的coordinates。

  const grid = kriging.grid(bounds, variogram, 0.05)
  // 3.将得到的格网预测值渲染到canvas画布上

  kriging.plot(canvas, grid, [73.4766, 135.088], [18.1055, 53.5693], colors)

  const image = canvas.toDataURL("image/png")
  return image
}

function getMouseColor(mousePosition) {
  const scene = map.scene

  // 转换精确坐标
  const x = Math.floor(mousePosition.x)
  const y = Math.floor(scene.canvas.height - mousePosition.y)

  if (x < 0 || x >= scene.canvas.width || y < 0 || y >= scene.canvas.height) {
    return // 检查坐标是否在画布范围内
  }

  // 新版核心修正：直接使用WebGL常量
  const gl = scene.context._gl
  const pixel = new Uint8Array(4)
  gl.readPixels(
    x,
    y,
    1,
    1,
    gl.RGBA, // 对应格式常量
    gl.UNSIGNED_BYTE, // 对应类型常量
    pixel
  )


  if (!pixel || pixel.length < 4) {
    return // 确保像素数据有效
  }

  const color = Cesium.Color.fromBytes(pixel[0], pixel[1], pixel[2], pixel[3])
  return color.toCssColorString()
}
