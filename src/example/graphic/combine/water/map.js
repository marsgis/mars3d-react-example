import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.839779, lng: 117.261174, alt: 5404, heading: 359, pitch: -54 }
  },
  terrain: {
    show: false
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

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  // 加一些演示数据
  Cesium.Resource.fetchJson({
    url: "//data.mars3d.cn/file/geojson/buildings-hf.json"
  })
    .then((data) => {
      let arr = mars3d.Util.geoJsonToGraphics(data, {
        symbol: {
          callback: function (attr, styleOpt) {
            return {
              height: 0,
              color: Cesium.Color.fromRandom({ alpha: 0.4 }) // 随机色
            }
          }
        }
      })
      arr = arr.slice(0, 5000) // 控制数量，避免卡顿

      globalMsg("共加载" + arr.length + "个水面")

      // 多个面对象的合并渲染。
      const primitive = new mars3d.graphic.WaterCombine({
        instances: arr,
        // 公共样式
        style: {
          normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
          frequency: 8000.0, // 控制波数的数字。
          animationSpeed: 0.02, // 控制水的动画速度的数字。
          amplitude: 5.0, // 控制水波振幅的数字。
          specularIntensity: 0.8, // 控制镜面反射强度的数字。
          baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
          blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
          opacity: 0.7 // 透明度
        }
      })
      graphicLayer.addGraphic(primitive)
    })
    .catch(function (error) {
      console.log("服务出错", error)
    })
}

export function addDemoGraphic(count) {
  graphicLayer.clear()
  showLoading()
  const startTime = new Date().getTime()
  count = count * 10000

  const arrData = []
  for (let j = 0; j < count; ++j) {
    const position = randomPoint()
    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 45, 500)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 135, 500)
    const pt3 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, 500)
    const pt4 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, 500)

    arrData.push({
      positions: [pt1, pt2, pt3, pt4, pt1],
      style: {
        normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
        frequency: 8000.0, // 控制波数的数字。
        animationSpeed: 0.02, // 控制水的动画速度的数字。
        amplitude: 5.0, // 控制水波振幅的数字。
        specularIntensity: 0.8, // 控制镜面反射强度的数字。
        baseWaterColor: "#006ab4", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
        blendColor: "#006ab4", // 从水中混合到非水域时使用的rgba颜色对象。
        opacity: 0.7 // 透明度
      },
      attr: {
        name: "第" + j + "个"
      }
    })
  }

  // 多个面对象的合并渲染。
  const primitive = new mars3d.graphic.WaterCombine({
    instances: arrData
  })
  graphicLayer.addGraphic(primitive)

  hideLoading()

  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
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

// 取区域内的随机点
function randomPoint() {
  const jd = random(115.955684 * 1000, 117.474003 * 1000) / 1000
  const wd = random(30.7576 * 1000, 32.008782 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
