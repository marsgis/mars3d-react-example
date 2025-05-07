import * as mars3d from "mars3d"
import kriging from "kriging"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 25.494999, lng: 116.078819, alt: 993610, heading: 0.1, pitch: -78.9 },
    contextOptions: { webgl: { preserveDrawingBuffer: true } } // 从屏幕取颜色的关键配置
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // map.on(mars3d.EventType.mouseMove, function (event) {
  //   const color = getMouseColor(event.endPosition)
  //   eventTarget.fire("changeColor", { color })
  // })

  addTileLayer()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer
export async function addTileLayer() {
  removeTileLayer()

  // 绘制色斑图需要的数据
  const lngs = [] // 经度数组
  const lats = [] // 纬度数组
  const vals = [] // 数值数组
  let xmin, xmax, ymin, ymax

  // 加载江西省各县年平均降水量数据
  const result = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/jxjy.json" })
  for (let i = 0; i < result.length; i++) {
    const item = result[i]
    const lat = item.y
    const lng = item.x
    const val = Number(item.val.toFixed(0))

    lngs.push(lng)
    lats.push(lat)
    vals.push(val)

    if (i === 0) {
      xmin = lng
      xmax = lng
      ymin = lat
      ymax = lat
    } else {
      xmin = Math.min(xmin, lng)
      xmax = Math.max(xmax, lng)
      ymin = Math.min(ymin, lat)
      ymax = Math.max(ymax, lat)
    }
  }
  // map.flyToExtent({ xmin, xmax, ymin, ymax })

  // 训练并得到格网[kriging适合少量数据，数据量大就卡死了]
  const variogram = kriging.train(vals, lngs, lats, "exponential", 0, 100)
  const extent = [
    [
      [xmin, ymin],
      [xmax, ymin],
      [xmax, ymax],
      [xmin, ymax]
    ]
  ]
  const grid = kriging.grid(extent, variogram, (xmax - xmin) / 500)

  // 进行绘图
  const canvas = document.createElement("canvas")
  canvas.width = 1000
  canvas.height = 1000
  canvas.style.display = "block"
  canvas.getContext("2d").globalAlpha = 1.0
  newPlot(canvas, grid, grid.xlim, grid.ylim, jxPrecipitationColors)

  // 【按数据矩形区域展示】 直接加载图片
  tileLayer = new mars3d.layer.ImageLayer({
    url: canvas.toDataURL("image/png"),
    rectangle: { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax }
  })
  map.addLayer(tileLayer)

  // 【按行政区域展示】加载江西省矢量面后贴图片材质
  // const jxData = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/geojson/areas/360000.json" })
  // const jxPolygon = jxData.features[0].geometry.coordinates[0]
  // const polygonCartesians = Cesium.Cartesian3.fromDegreesArray(jxPolygon[0].flat())
  // const graphic = new mars3d.graphic.PolygonPrimitive({
  //   positions: polygonCartesians,
  //   style: {
  //     image: canvas,
  //     clampToGround: true
  //   }
  // })
  // map.graphicLayer.addGraphic(graphic)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// 平均年降水量，单位mm
const jxPrecipitationColors = [
  { min: 0, max: 1000, color: "#7fffff" },
  { min: 1000, max: 1100, color: "#23b7ff" },
  { min: 1100, max: 1200, color: "#0177b4" },
  { min: 1200, max: 1400, color: "#0052ca" },
  { min: 1400, max: 1600, color: "#0310d8" },
  { min: 1600, max: 1800, color: "#9601f9" },
  { min: 1800, max: 2000, color: "#6f00b8" },
  { min: 2000, max: 10000, color: "#4c0082" }
]
/** 颜色数组应该从小到大排列，才能正确获取超出界限的值 */
function getColor(colors, z) {
  const len = colors.length
  let minVal = colors[0].min
  for (let i = 0; i < len; i++) {
    minVal = Math.min(minVal, colors[i].min)
    if (z >= colors[i].min && z < colors[i].max) {
      return colors[i].color
    }
  }
  if (z <= minVal) {
    return colors[0].color
  } else {
    return colors[len - 1].color
  }
}

function newPlot(canvas, grid, xlim, ylim, colors) {
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const range = [xlim[1] - xlim[0], ylim[1] - ylim[0], grid.zlim[1] - grid.zlim[0]]
  let i, j, x, y, z
  const n = grid.length
  const m = grid[0].length
  const wx = Math.ceil((grid.width * canvas.width) / (xlim[1] - xlim[0]))
  const wy = Math.ceil((grid.width * canvas.height) / (ylim[1] - ylim[0]))
  for (i = 0; i < n; i++) {
    for (j = 0; j < m; j++) {
      if (grid[i][j] === undefined) {
        continue
      }
      x = (canvas.width * (i * grid.width + grid.xlim[0] - xlim[0])) / range[0]
      y = canvas.height * (1 - (j * grid.width + grid.ylim[0] - ylim[0]) / range[1])
      z = (grid[i][j] - grid.zlim[0]) / range[2]
      if (z < 0.0) {
        z = 0.0
      }
      if (z > 1.0) {
        z = 1.0
      }
      ctx.fillStyle = getColor(colors, grid[i][j])
      ctx.fillRect(Math.round(x - wx / 2), Math.round(y - wy / 2), wx, wy)
    }
  }
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
