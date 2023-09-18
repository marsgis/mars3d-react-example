import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tilesetLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.658282, lng: 117.070076, alt: 521, heading: 94, pitch: -33 }
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

  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "石化工厂",
    url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
    position: { lng: 117.077158, lat: 31.659116, alt: -2.0 },
    maximumScreenSpaceError: 1,
    highlight: { type: "click", outlineEffect: true, width: 8, color: "#FFFF00" },
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // 从数据库读取属性后，按下面格式组织好赋值即可[不适合大模型]
  tilesetLayer.readyPromise.then(() => {
    bindSetPropertiesToTile(tilesetLayer.tileset)

    addProperties({
      id: "55a7cf9c71f1c9c495413f934dd1a158",
      name: "大烟囱1 - 我是setProperties更新的", // 修改原有属性
      column1: "我是setProperties更新的", // 新增的属性
      testStyle: true // 新增的属性
    })
    addProperties({
      id: "559cb990c9dffd8675f6bc2186971dc2",
      name: "大烟囱2 - 我是setProperties更新的", // 修改原有属性
      column1: "我是setProperties更新的", // 新增的属性
      testStyle: true // 新增的属性
    })

    setTimeout(() => {
      // 还原或删除赋予的属性
      removeProperties({
        id: "559cb990c9dffd8675f6bc2186971dc2",
        name: "大烟囱2 - 我是还原的", // 修改原有属性
        column1: undefined,
        testStyle: undefined
      })
      console.log("大烟囱2 还原了属性值")
    }, 5000)
  })

  // style回调方法
  tilesetLayer.style = function (feature) {
    const attr = mars3d.Util.get3DTileFeatureAttr(feature)

    // 下面可以根据属性做各类判断后返回不同颜色，隐藏的可以透明度为0
    if (attr.testStyle) {
      return "rgba(255,0,0,1)"
    }
    if (attr.id === "f106b7f99d2cb30c3db1c3cc0fde9ccb") {
      return "rgba(0,255,255,1)"
    }
    if (attr.name === "Obj3d66-771819-1-938") {
      return "rgba(0,255,0,1)"
    }

    return "rgba(255,255,255,0.7)"
  }

  // 还原或删除赋予的样式
  // setTimeout(() => {
  //   tilesetLayer.style = undefined
  // }, 5000)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

const idField = "id" // 唯一标识对应的属性字段名称
const newProperties = {}
const loadFeatureList = new mars3d.MarsArray()

// 绑定处理的事件
function bindSetPropertiesToTile(tileset) {
  tileset.tileLoad.addEventListener(function (tile) {
    processTileFeatures(tile, (feature) => {
      const id = feature.getProperty(idField)
      const attr = newProperties[id]
      if (id && attr) {
        setFeatureProperties(feature, attr)
        loadFeatureList.set(id, feature)
      }
    })
  })

  tileset.tileUnload.addEventListener(function (tile) {
    processTileFeatures(tile, (feature) => {
      const id = feature.getProperty(idField)
      if (id) {
        loadFeatureList.remove(id)
      }
    })
  })
}

// 增加属性
function addProperties(properties) {
  const id = properties[idField]
  newProperties[id] = properties
}

// 移除属性
function removeProperties(properties) {
  const id = properties[idField]
  if (id) {
    delete newProperties[id]

    const feature = loadFeatureList.get(id)
    setFeatureProperties(feature, properties)
  }
}

function processTileFeatures(tile, callback) {
  const content = tile.content
  const innerContents = content.innerContents
  if (Cesium.defined(innerContents)) {
    const length = innerContents.length
    for (let i = 0; i < length; ++i) {
      processContentFeatures(innerContents[i], callback)
    }
  } else {
    processContentFeatures(content, callback)
  }
}
function processContentFeatures(content, callback) {
  const featuresLength = content.featuresLength
  for (let i = 0; i < featuresLength; ++i) {
    const feature = content.getFeature(i)
    callback(feature)
  }
}
// 更新feature属性
function setFeatureProperties(feature, newAttr) {
  if (!feature || !newAttr) {
    return
  }

  for (const key in newAttr) {
    const val = newAttr[key]
    if (feature.hasProperty(key) && feature.getProperty(key) === val) {
      continue
    }
    feature.setProperty(key, val)
  }
}
