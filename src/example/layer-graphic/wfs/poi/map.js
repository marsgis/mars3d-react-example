import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.783013, lng: 117.221851, alt: 2307, heading: 1, pitch: -29 }
  },
  basemaps: [
    {
      name: "天地图影像-无注记",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "tdt",
      layer: "img_d",
      show: true
    },
    {
      name: "天地图电子-无注记",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/tdt_vec.png",
      type: "tdt",
      layer: "vec_d"
    },
    {
      name: "高德影像-无注记",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/gaode_img.png",
      type: "gaode",
      layer: "img_d"
    },
    {
      name: "蓝色底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_blue.png",
      type: "gaode",
      layer: "vec",
      chinaCRS: "GCJ02",
      invertColor: true,
      filterColor: "#4e70a6",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0
    },
    {
      name: "黑色底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_dark.png",
      type: "gaode",
      layer: "vec",
      chinaCRS: "GCJ02",
      invertColor: true,
      filterColor: "#909090",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0
    },
    {
      name: "无底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/null.png",
      type: "grid",
      color: "#ffffff",
      alpha: 0.03,
      cells: 2
    }
  ],
  terrain: false
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // POI图层，演示大数据的分块加载
  graphicLayer = new mars3d.layer.PoiLayer({
    service: "baidu",
    minimumLevel: 13,
    collision: { includeType: "label" }, // 文字避让 关键配置
    symbol: {
      styleOptions: {
        image: "https://data.mars3d.cn/img/marker/square.png",
        scaleByDistance: true,
        scaleByDistance_far: 20000,
        scaleByDistance_farValue: 0.3,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 0.6,
        label: {
          text: "{name}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -30,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 4000,
          distanceDisplayCondition_near: 0
        }
      }
    },
    debuggerTileInfo: false // 是否显示网格信息（测试用）
  })
  map.addLayer(graphicLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
