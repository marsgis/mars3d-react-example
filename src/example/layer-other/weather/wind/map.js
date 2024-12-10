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

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
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

  loadDongnanData()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}


// 参数调整面板
export function setLayerOptions(options) {
  console.log("setOptions更新了图层", options)
  windLayer.setOptions(options)
}

// 加载局部数据
export async function loadDongnanData() {
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
  const res = await mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/wind.json" })
  windLayer.setData({
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
  })
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
  const res = await mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/ocean.json" })
  windLayer.setData({
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
  })
}

// 加载全球数据
export async function loadEarthData() {
  map.setCameraView({ lat: 15.026094, lng: 112.896676, alt: 13975128, heading: 0, pitch: -89 }, { duration: 0 })
  showLoading()

  windLayer.setOptions({
    particlesTextureSize: 500, // 粒子系统的纹理大小
    domain: { min: 0, max: 8 },
    speedFactor: 1.8,
    lineWidth: { min: 2, max: 4 },
    lineLength: { min: 100, max: 200 },
    flipY: false
  })


  const data = await loadNetCDF("//data.mars3d.cn/file/apidemo/wind.nc")
  console.log("数据加载解析完成", data)
  windLayer.setData(data, true)

  hideLoading()
}

// 加载并解析NC数据
function loadNetCDF(filePath) {
  return new Promise(function (resolve) {
    const request = new XMLHttpRequest()
    request.open("GET", filePath)
    request.responseType = "arraybuffer"

    request.onload = function () {
      const arrayToMap = function (array) {
        return array.reduce(function (map, object) {
          map[object.name] = object
          return map
        }, {})
      }

      // eslint-disable-next-line new-cap
      const NetCDF = new netcdfjs(request.response)
      const variables = arrayToMap(NetCDF.variables)
      const uAttributes = arrayToMap(variables.U.attributes)
      const vAttributes = arrayToMap(variables.V.attributes)

      const arrLon = NetCDF.getDataVariable("lon").flat()
      const arrLat = NetCDF.getDataVariable("lat").flat()
      const arrU = NetCDF.getDataVariable("U").flat()
      const maxU = uAttributes.max.value
      const minU = uAttributes.min.value
      const arrV = NetCDF.getDataVariable("V").flat()
      const maxV = vAttributes.max.value
      const minV = vAttributes.min.value

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
