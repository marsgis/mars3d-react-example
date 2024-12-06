import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

const creditHtml = `© 2023 Baidu - <span>审图号：GS(2023)3206号</span>
- 甲测资字11111342- <a target="_blank" href="https://map.baidu.com/zt/client/service/index.html">服务条款</a>`

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.667339, lng: 117.301893, alt: 40357, heading: 2, pitch: -68 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "百度电子",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/gaode_vec.png",
      type: "baidu",
      layer: "vec",
      credit: creditHtml,
      show: true
    },
    {
      name: "百度影像",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/gaode_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "baidu", layer: "img_d" },
        { name: "注记", type: "baidu", layer: "img_z" }
      ],
      credit: creditHtml
    },
    {
      name: "百度深蓝色",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/bd-c-midnight.png",
      type: "baidu",
      layer: "custom",
      style: "midnight",
      credit: creditHtml
    },
    {
      name: "百度黑色",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/bd-c-dark.png",
      type: "baidu",
      layer: "custom",
      style: "dark",
      credit: creditHtml
    },
    {
      name: "离线百度瓦片(示例)",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/arcgis.png",
      type: "baidu",
      url: "//data.mars3d.cn/tile/baiduVec/{z}/{x}/{y}.jpg",
      maximumLevel: 12
    }
  ]
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  addCreditDOM()

  globalNotify("已知问题提示", `(1) 百度瓦片纠偏后在部分瓦片拼接处有文字注记对不齐情况。`)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  removeCreditDOM()
  map = null
}

// 叠加的图层
let tileLayer

export function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.BaiduLayer({
    layer: "time"
  })
  map.addLayer(tileLayer)
}

export function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// 在下侧状态栏增加一个额外div展示图层版权信息
let creditDOM
function addCreditDOM() {
  const locationBar = map.control.locationBar?.container
  if (locationBar) {
    creditDOM = mars3d.DomUtil.create("div", "mars3d-locationbar-content mars3d-locationbar-autohide", locationBar)
    creditDOM.style["pointer-events"] = "all"
    creditDOM.style.float = "left"
    creditDOM.style.marginLeft = "20px"

    creditDOM.innerHTML = map.basemap?.options?.credit || ""

    map.on(mars3d.EventType.changeBasemap, function (event) {
      creditDOM.innerHTML = event.layer?.options?.credit || ""
    })
  }
}
function removeCreditDOM() {
  if (creditDOM) {
    mars3d.DomUtil.remove(creditDOM)
    creditDOM = null
  }
}
