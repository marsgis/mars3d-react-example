import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let drawLayer
let measure

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  method: {
    // eslint-disable-next-line no-undef
    lang: CustomLang // 使用自定义语言配置，配置信息在 ./CustomLang.js
  },
  control: {
    homeButton: true,
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode", insertIndex: 0 },
    baseLayerPicker: true,
    fullscreenButton: true,
    navigationHelpButton: true,

    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件

    contextmenu: { hasDefault: true }, // 涉及到多语言的模块：右键菜单
    compass: { top: "10px", left: "5px" },
    distanceLegend: { left: "180px", bottom: "30px" },
    locationBar: {
      template:
        "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div>"
    }
  },
  basemaps: [
    {
      id: "100",
      name: "Tianditu Images",
      name_cn: "天地图影像",
      name_en: "Tianditu Images",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d" },
        { name: "注记", type: "tdt", layer: "img_z" }
      ],
      show: true
    },
    {
      id: "200",
      name: "Tianditu Images EN",
      name_cn: "天地图影像EN",
      name_en: "Tianditu Images EN",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d" },
        { name: "注记", type: "tdt", layer: "img_e" }
      ]
    },
    {
      name: "Tianditu Electronic map",
      name_cn: "天地图电子",
      name_en: "Tianditu Electronic map",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_vec.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d" },
        { name: "注记", type: "tdt", layer: "vec_z" }
      ]
    },
    {
      name: "not map",
      name_cn: "无底图",
      name_en: "not map",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/null.png",
      type: "grid",
      color: "#ffffff",
      alpha: 0.03,
      cells: 2
    }
  ]
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  // 涉及到多语言的模块：标绘提示
  drawLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(drawLayer)

  drawLayer.bindContextMenu([
    {
      text: () => {
        return map.getLangText("_删除")
      },
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        drawLayer.removeGraphic(graphic)
        if (parent) {
          drawLayer.removeGraphic(parent)
        }
      }
    }
  ])

  // 涉及到多语言的模块：图上量算
  measure = new mars3d.thing.Measure({
    // 可设置文本样式
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function toCustomLang() {
  map.basemap = "200" // 英文天地图
  map.options.basemaps.forEach((item) => {
    item.name = item.name_en
  })

  if (map.control.locationBar) {
    map.control.locationBar.options.template =
      "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div><div class='hide700'> {fps} FPS</div>"
  }

  // eslint-disable-next-line no-undef
  map.lang = CustomLang // 使用自定义语言配置，配置信息在 ./CustomLang.js
}

export function toDefaultLange() {
  map.basemap = "100" // 中文天地图
  map.options.basemaps.forEach((item) => {
    item.name = item.name_cn
  })

  if (map.control.locationBar) {
    map.control.locationBar.options.template =
      "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div class='hide1000'>横{crsx}  纵{crsy}</div> <div>海拔：{alt}米</div> <div class='hide700'>层级：{level}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div><div class='hide700'>视高：{cameraHeight}米</div><div class='hide700'>帧率：{fps} FPS</div>"
  }

  map.lang = mars3d.Lang // 使用默认配置
}

export function distance() {
  drawLayer.stopDraw()
  measure.distance()
}

export function area() {
  drawLayer.stopDraw()
  measure.area()
}

export function height() {
  drawLayer.stopDraw()
  measure.heightTriangle()
}

export function coordinate() {
  drawLayer.stopDraw()
  measure.point()
}
export function angle() {
  drawLayer.stopDraw()
  measure.angle()
}

/**
 *开始标绘
 *
 * @export startDraw
 * @param { string } type 矢量数据类型
 * @returns {void} 无
 */
export function startDraw(type) {
  measure.stopDraw()
  drawLayer.startDraw({
    type,
    style: {
      color: "#00ffff",
      opacity: 0.6
    }
  })
}
