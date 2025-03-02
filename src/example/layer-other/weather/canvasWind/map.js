import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let canvasWindLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 24.677182, lng: 107.044123, alt: 20407002, heading: 0, pitch: -90 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 蓝色底图
  map.hasTerrain = false

  // 风场
  canvasWindLayer = new mars3d.layer.CanvasWindLayer({
    fixedHeight: 1000,
    // worker: window.currentPath + "windWorker.js", // 启用多线程模式，注释后是单线程模式(非必须)
    frameRate: 30, // 每秒刷新次数
    speedRate: 100, // 风前进速率
    particlesNumber: 5000,
    maxAge: 120,
    lineWidth: 2,
    // 单颜色 - 可放开颜色选择控件，进行修改
    // color: "#ffffff",
    // 多颜色
    colors: [
      "rgb(175, 240, 91)",
      "rgb(150, 243, 87)",
      "rgb(124, 246, 88)",
      "rgb(100, 247, 95)",
      "rgb(78, 246, 105)",
      "rgb(59, 242, 119)",
      "rgb(44, 237, 135)",
      "rgb(34, 229, 153)",
      "rgb(27, 218, 170)",
      "rgb(25, 206, 186)",
      "rgb(27, 192, 201)",
      "rgb(32, 177, 212)",
      "rgb(41, 161, 221)",
      "rgb(51, 145, 225)",
      "rgb(62, 129, 225)",
      "rgb(74, 113, 221)",
      "rgb(85, 99, 213)",
      "rgb(95, 86, 201)",
      "rgb(104, 74, 187)",
      "rgb(110, 64, 170)"
    ],
    steps: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0]
  })
  map.addLayer(canvasWindLayer)

  loadHongkongData()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 滑动条事件
// 修改粒子数量
export function changeCount(val) {
  if (val) {
    canvasWindLayer.particlesNumber = val
  }
}

// 修改存活时间
export function changeAge(val) {
  if (val) {
    canvasWindLayer.maxAge = val
  }
}

// 修改移动速率
export function changeSpeed(val) {
  if (val) {
    canvasWindLayer.speedRate = val
  }
}

// 修改线宽
export function changeLinewidth(val) {
  if (val) {
    canvasWindLayer.lineWidth = val
  }
}

// 改变颜色
export function changeColor(color) {
  canvasWindLayer.color = color
}

// 加载局部数据1
export async function loadHongkongData() {
  map.setCameraView({ lat: 19.658703, lng: 114.870135, alt: 357062.4, heading: 341.1, pitch: -52.9 }, { duration: 0 })

  canvasWindLayer.setOptions({
    speedRate: 150, // 风前进速率
    flipY: false
  })

  // 取数据
  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-hongkong.json" })
  canvasWindLayer.setData(res)
}
// 加载局部数据2
export async function loadDongnanData1() {
  map.setCameraView({ lat: -8.188301, lng: 103.011488, alt: 1423712.3, heading: 4.8, pitch: -59.5 }, { duration: 0 })

  canvasWindLayer.setOptions({
    speedRate: 90, // 风前进速率
    flipY: true
  })

  // 访问windpoint.json后端接口，取数据
  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-singapore.json" })
  canvasWindLayer.setData(res)

  setTimeout(function () {
    const arrPoints = []
    const particles = canvasWindLayer._canvasParticles
    for (let index = 0, len = particles.length; index < len; index++) {
      const item = particles[index]
      arrPoints.push({ lat: item.lat, lng: item.lng, value: item.speed })
    }
    showHeatMap(arrPoints)
  }, 3000)
}

// 加载局部数据
export async function loadDongnanData2() {
  map.setCameraView({ lat: -8.188301, lng: 103.011488, alt: 1423712.3, heading: 4.8, pitch: -59.5 }, { duration: 0 })

  canvasWindLayer.setOptions({
    speedRate: 90, // 风前进速率
    flipY: true
  })

  // 访问windpoint.json后端接口，取数据
  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-singapore-ocean.json" })
  canvasWindLayer.setData(res)
}

// 加载全球数据
export async function loadEarthData() {
  map.setCameraView({ lat: 15.026094, lng: 112.896676, alt: 13975128, heading: 0, pitch: -89 }, { duration: 0 })
  showLoading()

  canvasWindLayer.setOptions({
    particlesNumber: 8000,
    speedRate: 30, // 风前进速率
    flipY: false
  })

  // 建议用后面qingxiNCData()清洗数据后直接加载json，当前只是为了演示nc的加载
  const data = await loadNetCDF("https://data.mars3d.cn/file/apidemo/wind.nc")
  console.log("数据加载解析完成", data)
  canvasWindLayer.setData(data)

  hideLoading()
}

// 加载并解析NC数据,
function loadNetCDF(filePath) {
  return new Promise(function (resolve) {
    const request = new XMLHttpRequest()
    request.open("GET", filePath)
    request.responseType = "arraybuffer"

    request.onload = function () {
      // eslint-disable-next-line new-cap
      const reader = new netcdfjs(request.response)

      // 【通用】读取变量,组织为前端方便使用的对象
      const attr = {}
      reader.variables.forEach((item) => {
        const column = item.name
        const newItem = {
          ...item,
          value: reader.getDataVariable(column)
        }
        if (item.attributes && Array.isArray(item.attributes)) {
          newItem.attributes = {}
          item.attributes.forEach((item2) => {
            newItem.attributes[item2.name] = item2
          })
        }
        attr[column] = newItem
      })

      // 【每个nc可能不一样】组织数据为mars3d需要的格式，字段名称来源于nc文件的描述文件（每个标准的nc文件都可能不同）
      const arrLon = attr.lon.value
      const arrLat = attr.lat.value
      const arrU = attr.U.value
      const arrV = attr.V.value

      // 构造WindLayer类需要的格式数据
      const result = {
        xmin: Math.min(...arrLon),
        xmax: Math.max(...arrLon),
        ymin: Math.min(...arrLat),
        ymax: Math.max(...arrLat),
        rows: arrLat.length,
        cols: arrLon.length,
        udata: arrU, // 横向风速
        vdata: arrV // 纵向风速
      }
      resolve(result)
    }
    request.send()
  })
}

// 【清洗nc数据】无论你数据原始什么格式，建议都按api组织下新json数据，后期加载都用新数据提高效率
// async function qingxiNCData() {
//   const newData = await loadNetCDF("https://data.mars3d.cn/file/apidemo/wind.nc")
//   mars3d.Util.downloadFile("newWindData.json", JSON.stringify(newData))
// }

// // 【清洗json数据】无论你数据原始什么格式，建议都按api组织下新json数据，后期加载都用新数据提高效率
// async function qingxiJsonData() {
//   const res = await mars3d.Util.fetchJson({ url: "/oldWindData.json" })

//   // const udata = res[0]
//   // const vdata = res[1]

//   const newData = {
//     xmin: res.bbox[0],
//     ymin: res.bbox[1],
//     xmax: res.bbox[2],
//     ymax: res.bbox[3],
//     cols: res.width,
//     rows: res.height,
//     udata: res.u.array, // 横向风速
//     vdata: res.v.array // 纵向风速
//   }

//   mars3d.Util.downloadFile("newWindData.json", JSON.stringify(newData))
// }

let heatLayer
function showHeatMap(arrPoints) {
  if (heatLayer) {
    heatLayer.destroy()
  }

  // 热力图 图层
  heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    min: 0,
    max: 20,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 10,
      blur: 0.6,
      minOpacity: 0,
      maxOpacity: 0.6,
      gradient: {
        0: "#e9ec36",
        0.25: "#ffdd2f",
        0.5: "#fa6c20",
        0.75: "#fe4a33",
        1: "#ff0000"
      }
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      opacity: 1.0
    }
  })
  map.addLayer(heatLayer)
}
