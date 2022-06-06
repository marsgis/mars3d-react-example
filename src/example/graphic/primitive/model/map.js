import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.857163, lng: 116.345129, alt: 926, heading: 33, pitch: -34 }
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

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建Graphic图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  bindLayerEvent() // 对图层绑定相关事件
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.ModelPrimitive({
    position: [116.346929, 30.861947, 401.34],
    style: {
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangyuan-run.gltf",
      scale: 20,
      minimumPixelSize: 50,
      heading: 90,

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 10000,
      distanceDisplayPoint: {
        // 当视角距离超过一定距离(distanceDisplayCondition_far定义的) 后显示为点对象的样式
        color: "#00ff00",
        pixelSize: 8
      },

      label: {
        text: "我是模型",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -50,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法

  initGraphicManager(primitive)

  // 转geojson
  const geojson = primitive.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.position = [116.348587, 30.859472, 373.8]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.ModelPrimitive({
    position: [116.35104, 30.86225, 374.4],
    style: {
      url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      heading: 270,
      scale: 30,
      minimumPixelSize: 100,
      runAnimations: false, // 关闭启动动画

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 9000,
      distanceDisplayBillboard: {
        // 当视角距离超过一定距离(distanceDisplayCondition_far定义的) 后显示为图标对象的样式
        image: "img/marker/303.png",
        scale: 1
      },

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        silhouette: true,
        silhouetteColor: "#00ffff",
        silhouetteSize: 3
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法

  // 手动按需启动动画
  primitive.on(mars3d.EventType.load, function (event) {
    const model = event.model

    // 参考API: http://mars3d.cn/api/cesium/ModelAnimationCollection.html
    model.activeAnimations.addAll({
      multiplier: 0.5, // Play at half-speed
      loop: Cesium.ModelAnimationLoop.REPEAT // Loop the animations
    })

    // let animation = model.activeAnimations.add({
    //   index: 0, //第一个叶子
    //   multiplier: 0.5, // Play at double speed
    //   loop: Cesium.ModelAnimationLoop.REPEAT, // Loop the animation
    // });

    // animation.start.addEventListener(function (model, animation) {
    //   console.log("Animation started: " + animation.name);
    // });
    // animation.update.addEventListener(function (model, animation, time) {
    //   console.log("Animation updated: " + animation.name + ". glTF animation time: " + time);
    // });
    // animation.stop.addEventListener(function (model, animation) {
    //   console.log("Animation stopped: " + animation.name);
    // });
  })
}

function addDemoGraphic3(graphicLayer) {
  const primitive = new mars3d.graphic.ModelPrimitive({
    position: [116.349194, 30.864603, 376.58],
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 50,

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        silhouette: true,
        silhouetteColor: "#ff0000",
        silhouetteSize: 4
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

export function addDemoGraphic(count) {
  graphicLayer.clear()

  map.setCameraView({ lat: 30.648084, lng: 116.747173, alt: 29041, heading: 317, pitch: -32 })

  showLoading()

  const startTime = new Date().getTime()

  createModels(count)

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
}
// 清除数据


function createModels(count) {
  for (let j = 0; j < count; ++j) {
    //
    const position = randomPoint()

    const primitive = new mars3d.graphic.ModelPrimitive({
      position: position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/feiji.glb",
        scale: 1,
        minimumPixelSize: 50,

        distanceDisplayCondition: true,
        distanceDisplayCondition_near: 0,
        distanceDisplayCondition_far: 90000,
        distanceDisplayPoint: {
          // 当视角距离超过一定距离(distanceDisplayCondition_far定义的) 后显示为点对象的样式
          color: "#00ff00",
          pixelSize: 5
        }
      },
      tooltip: "第" + j + "个"
    })
    graphicLayer.addGraphic(primitive)
  }
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



// 在图层级处理一些事物
function bindLayerEvent() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  /* graphicLayer.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听layer，鼠标移入了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听layer，鼠标移出了矢量对象", event)
  }) */
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic._parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  /* graphic.on(mars3d.EventType.click, function (event) {
    console.log("监听graphic，单击了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听graphic，鼠标移入了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听graphic，鼠标移出了矢量对象", event)
  }) */

  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(116.1 * 1000, 116.6 * 1000) / 1000
  const wd = random(30.8 * 1000, 31.1 * 1000) / 1000
  const height = random(1000, 9000)
  return new mars3d.LngLatPoint(jd, wd, height)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
