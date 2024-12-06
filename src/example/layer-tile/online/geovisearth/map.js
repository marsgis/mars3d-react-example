import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

const creditHtml = `©2023 中科星图- <span>审图号：GS (2023) 1924号</span>
-  甲测资字11111577 - <a href="https://geovisearth.com/declaration#/user" target="_blank" trace="tos">服务条款</a> `

// 请自行申请token后替换，星图地球官方地址：https://datacloud.geovisearth.com/support/map/summary
const geovisearthToken = "a56dddf720b90fd413d9795a90ddae83bc5806b951f3ed5f1ec7407a7b91d6c1"

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      pid: 10,
      name: "星图影像",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
      type: "group",
      layers: [
        {
          name: "底图",
          type: "xyz",
          url: "https://tiles{s}.geovisearth.com/base/v1/img/{z}/{x}/{y}?token=" + geovisearthToken,
          subdomains: "123"
        },
        {
          name: "注记",
          type: "xyz",
          url: "https://tiles{s}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?token=" + geovisearthToken,
          subdomains: "123"
        }
      ],
      show: true,
      credit: creditHtml
    },
    {
      pid: 10,
      name: "星图电子",
      icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_vec.png",
      type: "xyz",
      url: "https://tiles{s}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?token=" + geovisearthToken,
      subdomains: "123",
      credit: creditHtml
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
  tileLayer = new mars3d.layer.XyzLayer({
    name: "地形晕渲",
    url: "https://tiles{s}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?token=" + geovisearthToken,
    subdomains: "123",
    maximumLevel: 9
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
