import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 33.309721, lng: 117.521312, alt: 7373508.3, heading: 356, pitch: -87.6 }
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

  // 创建mapv图层
  createMapvLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function createMapvLayer() {
  // 构造数据
  const positions = []
  const geojson = []
  let randomCount = 1000
  while (randomCount--) {
    // 取区域内的随机点
    const point = [random(113 * 1000, 119 * 1000) / 1000, random(28 * 1000, 35 * 1000) / 1000]

    positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]))

    geojson.push({
      geometry: {
        type: "Point",
        coordinates: point
      },
      // 具体点的icon设置
      iconOptions: {
        url: "//data.mars3d.cn/img/marker/lace-blue.png", // 非聚合时点的icon,可设置为空
        width: 25,
        height: 36
      }
    })
  }
  map.camera.flyTo({
    destination: Cesium.Rectangle.fromCartesianArray(positions)
  })

  const options = {
    draw: "cluster",
    depthTest: false,
    fillStyle: "rgba(255, 50, 0, 1.0)",
    unit: "px", // 单位
    minSize: 8, // 聚合点最小半径
    maxSize: 31, // 聚合点最大半径
    globalAlpha: 0.8, // 透明度
    clusterRadius: 150, // 聚合像素半径
    maxClusterZoom: 18, // 最大聚合的级别
    maxZoom: 19, // 最大显示级别
    minPoints: 5, // 最少聚合点数，点数多于此值才会被聚合
    extent: 400, // 聚合的细腻程度，越高聚合后点越密集
    label: {
      // 聚合文本样式
      show: true, // 是否显示
      fillStyle: "white"
      // shadowColor: 'yellow',
      // font: '20px Arial',
      // shadowBlur: 10,
    },
    gradient: { 0: "blue", 0.5: "yellow", 1.0: "rgb(255,0,0)" }, // 聚合图标渐变色
    // pointerEvents: true,

    data: geojson // 数据
  }

  // 创建MapV图层
  const mapVLayer = new mars3d.layer.MapVLayer(options)
  map.addLayer(mapVLayer)

  mapVLayer.on(mars3d.EventType.click, (event) => {
    console.log("单击了图层", event)
  })
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
