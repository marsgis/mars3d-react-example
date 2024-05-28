import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let mapSplit

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "示例数据",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "测试模型",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  createControl()

  map.on(mars3d.EventType.addLayer, function (event) {
    const mapEx = mapSplit?.mapEx
    if (mapEx) {
      const layerOptions = event.layer.toJSON() // 转为参数
      const newLayer = mars3d.LayerUtil.create(layerOptions) // 创建图层
      mapEx.addLayer(newLayer)
    }
  })

  setTimeout(() => {
    addTestData()
  }, 10000)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function createControl() {
  if (mapSplit) {
    globalMsg("控件已存在,请勿重复创建!")
    return
  }

  // 修改已有地图为50%
  const mapOld = document.getElementById("centerDiv3D")
  mapOld.style.width = "50%"

  // 获取原来地图的参数
  const mapOptions2 = map.toJSON()
  mapOptions2.control.baseLayerPicker = true // basemaps底图切换按钮
  mapOptions2.control.sceneModePicker = false

  // 用于双屏同图层，不同配置展示
  for (let i = 0, len = mapOptions2.layers.length; i < len; i++) {
    const item = mapOptions2.layers[i]
    if (item.compare) {
      for (const key in item.compare) {
        item[key] = item.compare[key] // 存在compare属性时
      }
    }
  }
  console.log("分屏地图配置", mars3d.Util.clone(mapOptions2))

  mapSplit = new mars3d.control.MapCompare({
    ...mapOptions2,
    parentContainer: document.body
  })
  map.addControl(mapSplit)

  // 修改对比地图
  mapSplit.mapEx.basemap = "天地图电子"
}

export function destroyControl() {
  if (!mapSplit) {
    globalMsg("控件已销毁,无需重复销毁!")
    return
  }

  map.removeControl(mapSplit)
  mapSplit = null
  const mapOld = document.getElementById("centerDiv3D")
  mapOld.style.width = "100%"
}

function addTestData() {
  const layer = new mars3d.layer.TilesetLayer({
    name: "测试模型2",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 116.267315, lat: 31.457617, alt: 103 },
    scale: 100,
    maximumScreenSpaceError: 2,
    cullWithChildrenBounds: false
  })
  map.addLayer(layer)
}
