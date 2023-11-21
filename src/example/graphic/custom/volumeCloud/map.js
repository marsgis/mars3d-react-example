import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

export const mapOptions = {
  scene: {
    center: { lat: 28.750173, lng: 116.904665, alt: 353676.9, heading: 1.4, pitch: -50 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/volumeCloud.json" })
    .then(function (data) {
      console.log("演示数据data", data)

      addDemoGraphic1(data)
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

const colors = [
  "rgb(0,0,0,0)",
  "rgb(170,36,250)",
  "rgba(212,142,254,0.13)",
  "rgba(238,2,48,0.12)",
  "rgba(254,100,92,0.11)",
  "rgba(254,172,172,0.1)",
  "rgba(140,140,0,0.09)",
  "rgba(200,200,2,0.08)",
  "rgba(252,244,100,0.07)",
  "rgba(16,146,26,0.06)",
  "rgba(0,234,0,0.05)",
  "rgba(166,252,168,0.04)",
  "rgba(30,38,208,0.03)",
  "rgba(122,114,238,0.02)",
  "rgba(192,192,254,0.01)"
]
const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]

function addDemoGraphic1(data) {
  // 创建气象数据体渲染模型
  const volumeCloud = new mars3d.graphic.VolumeCloud({
    data: {
      rows: data.rows, // 行网格数
      cols: data.cols, // 列网格数
      heights: data.heights, // 高网格数
      values: data.values, // 3D 数据集数组, 数组长度应该是 rows*cols*heights, 顺序为： [height1-row1-col1, height1-row1-col2,…… ,height1-row2-col1, height1-row2-col2,…… ,height2-row1-col1, height2-row1-col2,……]

      xmin: data.xmin, // 最小经度（度数，-180-180）
      xmax: data.xmax, // 最大经度（度数，-180-180）
      ymin: data.ymin, // 最小纬度（度数，-90-90）
      ymax: data.ymax, // 最大纬度（度数，-90-90）
      zmin: data.zmin, // 最小高度
      zmax: data.zmax // 最大高度
    },
    steps,
    colors
    // flyTo: true
  })
  graphicLayer.addGraphic(volumeCloud)

  // 显示边界，方便对比测试
  showDebuggerRectangleOutline(volumeCloud)

  // setInterval(() => {
  //   for (let index = 0, len = data.values.length; index < len; index++) {
  //     if (data.values[index] > 20) {
  //       data.values[index] = Math.abs(data.values[index] * 1.001)
  //     }
  //   }

  //   volumeCloud.updateData({
  //     rows: data.rows, // 行网格数
  //     cols: data.cols, // 列网格数
  //     heights: data.heights, // 高网格数
  //     values: data.values // 3D 数据集数组, 数组长度应该是 rows*cols*heights
  //   })
  // }, 1000)
}

// 显示Rectangle矩形体边界，方便对比测试
function showDebuggerRectangleOutline(volumeCloud) {
  const boxOutlineInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleOutlineGeometry({
      ellipsoid: Cesium.Ellipsoid.WGS84,
      rectangle: volumeCloud._rectangle,
      height: volumeCloud.options.data.zmin,
      extrudedHeight: volumeCloud.options.data.zmax
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
    }
  })

  map.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: boxOutlineInstance,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    })
  )
}
