import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.797497, lng: 117.470076, alt: 404990.7, heading: 357.2, pitch: -73.5 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/radar-scores.json" })
    .then(function (arrPoints) {
      const dataLD = []
      for (let angle = 0; angle < arrPoints.length; angle++) {
        const item = arrPoints[angle]
        for (let radius = 0; radius < item.scores.length; radius++) {
          const val = item.scores[radius]
          dataLD.push([radius, item.angle, val])
        }
      }
      // 创建图层
      createEchartsImageLayer(dataLD)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createEchartsImageLayer(dataLD) {
  // 计算图片四周边界
  const rectangle = mars3d.PolyUtil.getRectangle(
    mars3d.PolyUtil.getEllipseOuterPositions({
      position: [117.22413, 31.859107], // 雷达中心点坐标
      radius: 100000 // 雷达半径，单位：米
    }),
    true
  )

  // 单张图片图层
  const imageLayer = new mars3d.layer.ImageLayer({
    crs: mars3d.CRS.EPSG3857,
    rectangle
  })
  map.addLayer(imageLayer)

  // 获取echart渲染对象
  const echartsInstance = getEchartsInstance(dataLD)

  function updateImage() {
    const imageData = echartsInstance.getDataURL({ type: "png", pixelRatio: 1 })
    imageLayer.url = imageData // 更新图片，base64图片
  }

  // echartsInstance.on("rendered", mars3d.Util.funDebounce(updateImage, 1000))
  let timeTik
  echartsInstance.on("rendered", function () {
    clearTimeout(timeTik) // 防抖处理
    timeTik = setTimeout(() => {
      updateImage()
    }, 1000)
  })
}

// 获取echart渲染对象
function getEchartsInstance(dataLD) {
  function renderItem(params, api) {
    const values = [api.value(0), api.value(1)]
    const coord = api.coord(values)
    const size = api.size([1, 1], values)
    return {
      type: "sector",
      shape: {
        cx: params.coordSys.cx,
        cy: params.coordSys.cy,
        r0: coord[2] - size[0] / 2,
        r: coord[2] + size[0] / 2,
        startAngle: -(coord[3] + size[1] / 2),
        endAngle: -(coord[3] - size[1] / 2)
      },
      style: api.style({
        fill: api.visual("color")
      })
    }
  }

  const maxValue = echarts.util.reduce(
    dataLD,
    function (max, item) {
      return Math.max(max, item[2])
    },
    -Infinity
  )

  // 构造 echarts option
  const option = {
    animation: false,
    polar: {},
    visualMap: {
      type: "continuous",
      min: 0,
      max: maxValue,
      top: "middle",
      dimension: 2,
      show: false
    },
    // 极坐标系的径向轴
    radiusAxis: {
      type: "category",
      z: 100,
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    // 极坐标系的角度轴
    angleAxis: {
      type: "category",
      boundaryGap: false,
      splitLine: { show: false },
      axisLine: { show: false }
    },
    series: [
      {
        type: "custom",
        coordinateSystem: "polar",
        itemStyle: {
          normal: {
            color: "#d14a61"
          }
        },
        renderItem,
        data: dataLD
      }
    ]
  }

  // echarts.init
  const container = mars3d.DomUtil.create("div", "mars3d-echarts mars3d-hideDiv", map.container)
  container.style.position = "absolute"
  container.style.top = "0px"
  container.style.left = "0px"
  container.style.width = "1024px"
  container.style.height = "1024px"

  const echartsInstance = echarts.init(container)
  echartsInstance.setOption(option)

  return echartsInstance
}
