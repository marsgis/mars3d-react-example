import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let tiles3dLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#363635", // 天空背景色
    globe: {
      baseColor: "#363635", // 地球地面背景色
      showGroundAtmosphere: false,
      enableLighting: false
    },
    clock: {
      currentTime: "2023-11-01 12:00:00" // 固定光照时间
    },
    cameraController: {
      zoomFactor: 1.5,
      minimumZoomDistance: 0.1,
      maximumZoomDistance: 200000,
      enableCollisionDetection: false // 允许进入地下
    }
  }
}

// 自定义事件
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 固定光照方向
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })

  // 如果模型地址内有“+”符号，可以加下面方法进行自定义处理
  Cesium.Resource.ReplaceUrl = function (url) {
    if (url.endsWith(".json") || url.endsWith(".b3dm")) {
      return url.replace(/\+/gm, "%2B") // 将3dtiles中的“+”符号转义下
    } else {
      return url
    }
  }

  // 读取localStorage值
  localforage.getItem(storageName).then(function (lastUrl) {
    eventTarget.fire("historyUrl", { url: lastUrl })
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}
const storageName = "layer-tileset-manager-edit"
export function showModel(url) {
  removeLayer()

  if (!url) {
    localforage.removeItem(storageName)
    globalMsg("请输入图层URL！")
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "模型名称",
    url,
    maximumScreenSpaceError: 16,
    maxMemory: 1024, // 最大缓存内存大小(MB)
    popup: "all",
    matrixMove: {
      hasMiddle: false
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  tiles3dLayer.readyPromise
    .then(() => {
      // 加载完成
      console.log("模型加载完成", tiles3dLayer)

      localforage.setItem(storageName, url) // 记录历史值
      eventTarget.fire("tiles3dLayerLoad", { layer: tiles3dLayer })
    })
    .catch((e) => {
      // 加载失败
      console.log("模型加载失败", e)
      localforage.removeItem(storageName)
    })

  // 加载完成事件
  tiles3dLayer.on(mars3d.EventType.updatePosition, function (event) {
    eventTarget.fire("changePoition", {
      center: tiles3dLayer.center,
      rotation: tiles3dLayer.rotation
    })
  })

  tiles3dLayer.bindContextMenu([
    {
      text: "开始编辑",
      icon: "fa fa-edit",
      show: function (e) {
        return tiles3dLayer.hasEdit && !tiles3dLayer.isEditing
      },
      callback: (e) => {
        tiles3dLayer.startEditing()
      }
    },
    {
      text: "查看服务地址",
      icon: "fa fa-info",
      callback: (e) => {
        window.open(tiles3dLayer.options.url, "_blank")
      }
    }
  ])
}

// 异步求准确高度
export function updateHeightForSurfaceTerrain(position) {
  // 求地面海拔 (异步)
  if (Cesium.defined(position) && Cesium.defined(position.alt)) {
    // 存在历史设置的高度时不用处理
  } else {
    mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, tiles3dLayer.orginCenterPosition).then((result) => {
      if (!Cesium.defined(result.height)) {
        return
      }
      const offsetZ = Math.ceil(result.height - tiles3dLayer.orginCenterPoint.alt + 1)
      console.log("地面海拔：" + result.height.toFixed(2) + ",需要偏移" + offsetZ)

      tiles3dLayer.height = offsetZ

      eventTarget.fire("changeHeight", { alt: offsetZ })
    })
  }
}

// 修改更改后的参数
export function updateModel(params, pannelData) {
  console.log("更新模型参数", params)

  tiles3dLayer.setOptions(params)

  // 非参数，调用方法绑定或解绑
  if (pannelData.highlightEnable) {
    tiles3dLayer.highlight = {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#00FF00"
    }
  } else {
    tiles3dLayer.highlight = undefined
  }
  if (pannelData.popupEnable) {
    tiles3dLayer.bindPopup("all")
  } else {
    tiles3dLayer.unbindPopup()
  }
}

// 深度检测
export function updateDepthTest(enabled) {
  map.scene.globe.depthTestAgainstTerrain = enabled
}

export function locate() {
  if (tiles3dLayer.tileset?.boundingSphere) {
    map.camera.flyToBoundingSphere(tiles3dLayer.tileset.boundingSphere, {
      offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, tiles3dLayer.tileset.boundingSphere.radius * 2)
    })
  } else {
    map.flyToPoint(tiles3dLayer.position, {
      radius: tiles3dLayer.tileset.boundingSphere.radius * 2
    })
  }
}

// 保存GeoJSON
export function saveBookmark() {
  const params = tiles3dLayer.toJSON()

  // 清理参数中无需保存的部分（只是当前示例内部控制使用的）
  delete params.highlightEnable
  delete params.popupEnable

  console.log("图层参数为：", params)

  mars3d.Util.downloadFile("3dtiles图层配置.json", JSON.stringify(params))
}

// 查看构件
export function checkedTree() {
  tiles3dLayer.tileset.style = undefined
}

export function showCompTree(model) {
  querySceneTreeData(model)
    .then(function (scene) {
      const data = []
      if (scene.scenes) {
        for (let i = 0; i < scene.scenes.length; i++) {
          const node = scene.scenes[i]
          name2text(node)
          data.push(node)
        }
      } else {
        name2text(scene)
        data.push(scene)
      }

      eventTarget.fire("compTree", { data })
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

export function compModelChange(nodeid, nodesphere) {
  if (nodesphere[3] <= 0) {
    return
  }
  // 构件节点位置
  let center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2])

  // 获取构件节点位置，现对于原始矩阵变化后的新位置
  center = tiles3dLayer.getPositionByOrginMatrix(center)

  // 飞行过去
  const sphere = new Cesium.BoundingSphere(center, nodesphere[3])
  map.camera.flyToBoundingSphere(sphere, {
    offset: new Cesium.HeadingPitchRange(map.camera.heading, map.camera.pitch, nodesphere[3] * 1.5),
    duration: 0.5
  })

  // 设置tileset的样式
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${id} ==='" + nodeid + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 200, 200,0.2)"]
      ]
    }
  })
}

// 取构件树数据
function querySceneTreeData(url) {
  const scenetree = url.substring(0, url.lastIndexOf("/") + 1) + "scenetree.json"

  return mars3d.Util.fetchJson({ url: scenetree })
}

function name2text(o) {
  o.text = o.name

  // 这块为了避免tree控件里的id不统一，所以加改变一下
  o.eleid = o.id
  o.id = undefined

  if ((!o.text || o.text.trim() === "") && o.type) {
    o.text = o.type
  }

  if (o.children) {
    for (let i = 0; i < o.children.length; i++) {
      name2text(o.children[i])
    }
  }
}
