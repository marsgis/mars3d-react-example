import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let windLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -7.267841, lng: 102.947683, alt: 1960633.4, heading: 0.4, pitch: -70.1 },
    scene3DOnly: true
  },
  control: {
    sceneModePicker: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 蓝色底图

  map.mouseEvent.enabledMoveTarget = false // 是否开启鼠标移动事件的拾取矢量数据

  // map.scene.globe.showGroundAtmosphere = false// 关闭大气层
  // map.scene.skyAtmosphere.show = true
  // map.scene.fog.enabled = true
  // map.scene.fog.density = 0.00005 // 地面 0.00005 海底0.00008
  // map.scene.fog.minimumBrightness = 0.03 // 0.03

  // map.scene.skyAtmosphere.hueShift = 0.0
  // map.scene.skyAtmosphere.saturationShift = 0.1
  // map.scene.skyAtmosphere.brightnessShift = 0.08 // 地面0.08 海底

  windLayer = new mars3d.layer.WindLayer({
    fixedHeight: 1000,
    particlesTextureSize: 200, // 粒子系统的纹理大小
    dropRate: 0.003, // 粒子消失率
    dropRateBump: 0.001, // 慢速粒子的额外消失率
    speedFactor: 0.8,
    lineWidth: { min: 1, max: 2 },
    lineLength: { min: 50, max: 100 },
    useViewerBounds: true,
    // 色带配置
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
    ]
    // colors: [
    //   "rgb(4,14,216)",
    //   "rgb(32,80,255)",
    //   "rgb(65,150,255)",
    //   "rgb(109,193,255)",
    //   "rgb(134,217,255)",
    //   "rgb(156,238,255)",
    //   "rgb(175,245,255)",
    //   "rgb(206,255,255)",
    //   "rgb(255,254,71)",
    //   "rgb(255,235,0)",
    //   "rgb(255,196,0)",
    //   "rgb(255,144,0)",
    //   "rgb(255,72,0)",
    //   "rgb(255,0,0)",
    //   "rgb(213,0,0)",
    //   "rgb(158,0,0)"
    // ]
  })
  map.addLayer(windLayer)

  loadHongkongData()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 参数调整面板
export function setLayerOptions(options) {
  console.log("setOptions更新了图层", options)
  windLayer.setOptions(options)
}

// 加载局部数据1
export async function loadHongkongData() {
  map.setCameraView({ lat: 19.658703, lng: 114.870135, alt: 357062.4, heading: 341.1, pitch: -52.9 }, { duration: 0 })

  windLayer.setOptions({
    particlesTextureSize: 300, // 粒子系统的纹理大小
    // domain: { min: 0, max: 8 },
    speedFactor: 0.7,
    lineWidth: { min: 1, max: 1.5 },
    lineLength: { min: 4, max: 20 },
    flipY: false
  })

  // 访问windpoint.json后端接口，取数据

  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-hongkong.json" })
  windLayer.setData(res, true)
}

// 加载局部数据2
export async function loadDongnanData1() {
  map.setCameraView({ lat: -8.188301, lng: 103.011488, alt: 1423712.3, heading: 4.8, pitch: -59.5 }, { duration: 0 })

  windLayer.setOptions({
    particlesTextureSize: 200, // 粒子系统的纹理大小
    domain: { min: 0, max: 8 },
    speedFactor: 0.7,
    lineWidth: { min: 1, max: 2 },
    lineLength: { min: 40, max: 80 },
    flipY: true
  })

  // 访问windpoint.json后端接口，取数据
  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-singapore.json" })
  windLayer.setData(res, true)
}

// 加载局部数据
export async function loadDongnanData2() {
  map.setCameraView({ lat: -8.188301, lng: 103.011488, alt: 1423712.3, heading: 4.8, pitch: -59.5 }, { duration: 0 })

  windLayer.setOptions({
    particlesTextureSize: 100, // 粒子系统的纹理大小
    domain: { min: 0, max: 1 },
    speedFactor: 8,
    lineWidth: { min: 1, max: 4 },
    lineLength: { min: 20, max: 50 },
    flipY: true
  })

  // 访问windpoint.json后端接口，取数据
  const res = await mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/wind-singapore-ocean.json" })
  windLayer.setData(res, true)
}

// 加载全球数据
export async function loadEarthData() {
  map.setCameraView({ lat: 15.026094, lng: 112.896676, alt: 13975128, heading: 0, pitch: -89 }, { duration: 0 })
  showLoading()

  windLayer.setOptions({
    particlesTextureSize: 600, // 粒子系统的纹理大小
    dropRate: 0.001, // 粒子消失率
    speedFactor: 1.0,
    // domain: { min: 0, max: 8 },
    lineWidth: { min: 6, max: 8 },
    lineLength: { min: 40, max: 200 },
    flipY: false
  })

  // 建议用后面qingxiNCData()清洗数据后直接加载json，当前只是为了演示nc的加载
  const data = await loadNetCDF("https://data.mars3d.cn/file/apidemo/wind.nc")
  console.log("数据加载解析完成", data)
  windLayer.setData(data, true)

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

      const maxU = attr.U.attributes.max.value
      const minU = attr.U.attributes.min.value
      const maxV = attr.V.attributes.max.value
      const minV = attr.V.attributes.min.value

      // 构造WindLayer类需要的格式数据
      const result = {
        xmin: Math.min(...arrLon),
        xmax: Math.max(...arrLon),
        ymin: Math.min(...arrLat),
        ymax: Math.max(...arrLat),
        rows: arrLat.length,
        cols: arrLon.length,
        udata: arrU, // 横向风速
        umin: minU,
        umax: maxU,
        vdata: arrV, // 纵向风速
        vmin: minV,
        vmax: maxV
      }
      resolve(result)
    }
    request.send()
  })
}

// 【清洗nc数据】无论你数据原始什么格式，建议都按api组织下新json数据，后期加载都用新数据提高效率
async function qingxiNCData() {
  const newData = await loadNetCDF("https://data.mars3d.cn/file/apidemo/wind.nc")
  mars3d.Util.downloadFile("newWindData.json", JSON.stringify(newData))
}

// 【清洗json数据】无论你数据原始什么格式，建议都按api组织下新json数据，后期加载都用新数据提高效率
async function qingxiJsonData() {
  const res = await mars3d.Util.fetchJson({ url: "/oldWindData.json" })

  // const udata = res[0]
  // const vdata = res[1]

  const newData = {
    xmin: res.bbox[0],
    ymin: res.bbox[1],
    xmax: res.bbox[2],
    ymax: res.bbox[3],
    cols: res.width,
    rows: res.height,
    udata: res.u.array, // 横向风速
    umin: res.u.min,
    umax: res.u.max,
    vdata: res.v.array, // 纵向风速
    vmin: res.v.min,
    vmax: res.v.max
  }

  mars3d.Util.downloadFile("newWindData.json", JSON.stringify(newData))
}
