import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

let flatBillboard

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 28.18408, lng: 116.160667, alt: 1138597, heading: 1, pitch: -78 },
    globe: {
      baseColor: "#a3b3c2"
    }
  },
  control: {
    infoBox: false
  },
  terrain: false,
  layers: [
    {
      type: "geojson",
      name: "全国省界",
      url: "//data.mars3d.cn/file/geojson/areas/100000_full.json",
      symbol: {
        type: "polylineCombine",
        styleOptions: {
          width: 2,
          color: "#cccccc",
          opacity: 0.8
        }
      },
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.basemap = undefined

  // 创建Graphic图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    const pickedItem = event.pickedObject?.data
    // let attr = event.graphic.attr
    console.log("单击了合并对象中的单个值为", pickedItem)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效

  flatBillboard = new mars3d.graphic.FlatBillboard({
    // instances: [], //也可以后面通过属性传入
    style: {
      width: 30, // 单位：像素
      height: 60
    }
  })
  graphicLayer.addGraphic(flatBillboard)

  loadDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 生成图标
export function showDataPoint(numPoints) {
  clearData()
  showLoading()
  const startTime = new Date().getTime()
  // 创建等值线区域
  const extent = [112.287256, 27.408204, 120.695453, 34.659583]
  const pointGrid = turf.pointGrid(extent, numPoints, {
    units: "miles"
  })
  const arr = []
  for (let i = 0; i < pointGrid.features.length; i++) {
    const coor = pointGrid.features[i].geometry.coordinates
    const position = Cesium.Cartesian3.fromDegrees(coor[0], coor[1], 1000)

    const angle = random(0, 360) // 随机方向
    const speed = random(0, 60) // 随机数值

    arr.push({
      position: position,
      angle: angle,
      image: getImageBySpeed(speed),
      attr: {
        name: "第" + i + "个图标",
        remark: "测试绑定的属性"
      }
    })
  }

  flatBillboard.instances = arr

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
}

// 清除数据
export function clearData() {
  if (flatBillboard) {
    flatBillboard.clear()
  }
}

// 加载演示数据
export function loadDemo() {
  queryWindPointApiData().then(function (arr) {
    showWindPoint(arr)
  })
}
// 访问后端接口，取数据
let arrWind
function queryWindPointApiData() {
  return new Promise(function (resolve, reject) {
    if (arrWind) {
      resolve(arrWind)
    } else {
      mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/windpoint.json" })
        .then(function (result) {
          arrWind = result.data
          resolve(arrWind)
        })
        .catch(function (error) {
          console.log("加载JSON出错", error)
        })
    }
  })
}

function showWindPoint(arr) {
  clearData()
  const arrPoint = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]
    arrPoint.push({
      position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 1000),
      angle: 360 - item.dir, // 方向
      image: getImageBySpeed(item.speed), // 速度 ，使用不同图片
      attr: {
        name: "第" + i + "个图标",
        remark: "测试绑定的属性"
      }
    })
  }
  flatBillboard.instances = arrPoint
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getImageBySpeed(speed) {
  let windVaneUrl = "img/windVane/01.svg"
  if (speed >= 0 && speed <= 2) {
    windVaneUrl = "img/windVane/01.svg"
  } else if (speed > 2 && speed <= 4) {
    windVaneUrl = "img/windVane/02.svg"
  } else if (speed > 4 && speed <= 6) {
    windVaneUrl = "img/windVane/03.svg"
  } else if (speed > 6 && speed <= 8) {
    windVaneUrl = "img/windVane/04.svg"
  } else if (speed > 8 && speed <= 10) {
    windVaneUrl = "img/windVane/05.svg"
  } else if (speed > 10 && speed <= 12) {
    windVaneUrl = "img/windVane/06.svg"
  } else if (speed > 12 && speed <= 14) {
    windVaneUrl = "img/windVane/07.svg"
  } else if (speed > 14 && speed <= 16) {
    windVaneUrl = "img/windVane/08.svg"
  } else if (speed > 16 && speed <= 18) {
    windVaneUrl = "img/windVane/09.svg"
  } else if (speed > 18 && speed <= 20) {
    windVaneUrl = "img/windVane/10.svg"
  } else if (speed > 20 && speed <= 22) {
    windVaneUrl = "img/windVane/11.svg"
  } else if (speed > 22 && speed <= 24) {
    windVaneUrl = "img/windVane/12.svg"
  } else if (speed > 24 && speed <= 26) {
    windVaneUrl = "img/windVane/13.svg"
  } else if (speed > 26 && speed <= 28) {
    windVaneUrl = "img/windVane/14.svg"
  } else if (speed > 28 && speed <= 30) {
    windVaneUrl = "img/windVane/15.svg"
  } else if (speed > 30 && speed <= 32) {
    windVaneUrl = "img/windVane/16.svg"
  } else if (speed > 32 && speed <= 34) {
    windVaneUrl = "img/windVane/17.svg"
  } else if (speed > 34 && speed <= 36) {
    windVaneUrl = "img/windVane/18.svg"
  } else if (speed > 36 && speed <= 38) {
    windVaneUrl = "img/windVane/19.svg"
  } else if (speed > 38 && speed <= 40) {
    windVaneUrl = "img/windVane/20.svg"
  } else if (speed > 40 && speed <= 42) {
    windVaneUrl = "img/windVane/21.svg"
  } else if (speed > 42 && speed <= 44) {
    windVaneUrl = "img/windVane/22.svg"
  } else if (speed > 44 && speed <= 46) {
    windVaneUrl = "img/windVane/23.svg"
  } else if (speed > 46 && speed <= 48) {
    windVaneUrl = "img/windVane/24.svg"
  } else if (speed > 48 && speed <= 50) {
    windVaneUrl = "img/windVane/25.svg"
  } else if (speed > 50 && speed <= 52) {
    windVaneUrl = "img/windVane/26.svg"
  } else if (speed > 52 && speed <= 54) {
    windVaneUrl = "img/windVane/27.svg"
  } else if (speed > 54 && speed <= 56) {
    windVaneUrl = "img/windVane/28.svg"
  } else if (speed > 56) {
    windVaneUrl = "img/windVane/29.svg"
  }
  return windVaneUrl
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}
