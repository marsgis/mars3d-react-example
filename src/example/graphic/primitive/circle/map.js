import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 30.643597, lng: 116.261903, alt: 38826, heading: 15, pitch: -52 }
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

  bindLayerEvent() // 对图层绑定相关事件
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: [116.314482, 30.918334, 417],
    style: {
      radius: 2000.0,
      color: "#00FFFF",
      opacity: 0.4,
      clampToGround: true,

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法

  // 演示对graphic的个性化处理
  initGraphicManager(primitive)
}

function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.239096, 30.872072, 700),
    style: {
      radius: 1500.0,
      image: "img/textures/excavate_bottom_min.jpg"
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic3(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.392526, 30.903729, 933.55),
    style: {
      radius: 1500.0,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.CircleWave, {
        color: "#FF0000",
        count: 1, // 圆圈数量
        speed: 20
      })
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic4(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: [116.244399, 30.920459],
    style: {
      radius: 2000,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.ScanLine, {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        speed: 10
      })
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(primitive) // primitive.addTo(graphicLayer)  //另外一种写法
}

function addDemoGraphic5(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.37617, 30.847384, 396.12),
    style: {
      radius: 900.0,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.CircleWave, {
        color: "#ffff00",
        count: 3, // 圆圈数量
        speed: 20,
        gradient: 0.1
      })
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(primitive) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic6(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.258301, 30.979046, 1483.7),
    style: {
      radius: 2500.0,
      // clampToGround: true,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.RadarWave, {
        color: "#00ffff",
        speed: 10
      })
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(primitive) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic7(graphicLayer) {
  const primitive = new mars3d.graphic.CirclePrimitive({
    position: new mars3d.LngLatPoint(116.318342, 30.972578, 1431.9),
    style: {
      radius: 1200.0,
      clampToGround: true,
      material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.RadarLine, {
        color: "#00ff00",
        speed: 10
      })
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(primitive) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

function addDemoGraphic8(graphicLayer) {
  // 注册自定义材质
  const Circle3WaveType = "Circle3Wave"
  mars3d.MaterialUtil.register(Circle3WaveType, {
    fabric: {
      uniforms: {
        color1: Cesium.Color.RED,
        color2: Cesium.Color.YELLOW,
        color3: Cesium.Color.BLUE,
        alpha: 1.0,
        speed: 10.0
      },
      source: `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float dis = distance(st, vec2(0.5, 0.5));
          float per = fract(speed*czm_frameNumber/1000.0);
          float scale = per * 0.5;
          if(dis > scale){
            discard;
          }else {
            material.alpha = alpha;
          }

          if(dis < scale/3.0)
            material.diffuse = color1.rgb;
          else  if(dis>scale/3.0 && dis<scale*2.0/3.0)
            material.diffuse =  color2.rgb;
          else
            material.diffuse = color3.rgb;

          return material;
      }`
    },
    translucent: true
  })

  const circlePrimitiveScan = new mars3d.graphic.CirclePrimitive({
    name: "三个颜色",
    position: new mars3d.LatLngPoint(116.405876, 30.963469, 1054.6),
    style: {
      radius: 3000.0,
      material: mars3d.MaterialUtil.createMaterial(Circle3WaveType, {
        color1: Cesium.Color.RED,
        color2: Cesium.Color.YELLOW,
        color3: Cesium.Color.BLUE,
        alpha: 0.4,
        speed: 10.0
      })
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(circlePrimitiveScan)
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
        graphicLayer.removeGraphic(graphic)
      }
    },

    {
      text: "计算周长",
      icon: "fa fa-medium",
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
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
