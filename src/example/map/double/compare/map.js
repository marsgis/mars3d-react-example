import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let mapCompare

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  layers: [
    {
      type: "geojson",
      name: "示例数据",
      url: "https://data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "测试模型",
      url: "https://data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  createControl()

  map.on(mars3d.EventType.addLayer, function (event) {
    const mapEx = mapCompare?.mapEx
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

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function createControl() {
  if (mapCompare) {
    globalMsg("控件已存在,请勿重复创建!")
    return
  }

  // 获取原来地图的参数
  const mapOptions2 = map.toJSON()
  // 用于双屏同图层，不同配置展示
  for (let i = 0, len = mapOptions2.layers.length; i < len; i++) {
    const item = mapOptions2.layers[i]
    if (item.compare) {
      for (const key in item.compare) {
        item[key] = item.compare[key] // 存在compare属性时
      }
    }
  }

  mapCompare = new mars3d.control.MapCompare({
    basemap: "微软影像",
    terrain: mapOptions2.terrain,
    layers: mapOptions2.layers,
    control: { baseLayerPicker: true, homeButton: true, zoom: true },
    sync: true
  })
  map.addControl(mapCompare)
}

export function destroyControl() {
  if (!mapCompare) {
    globalMsg("控件已销毁,无需重复销毁!")
    return
  }

  map.removeControl(mapCompare)
  mapCompare = null
}

function addTestData() {
  const layer = new mars3d.layer.TilesetLayer({
    name: "测试模型2",
    url: "https://data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 116.267315, lat: 31.457617, alt: 103 },
    scale: 100,
    maximumScreenSpaceError: 2,
    cullWithChildrenBounds: false
  })
  map.addLayer(layer)
}
