import * as mars3d from "mars3d"
import { TilesEditor } from "./TilesEditor.js"

export let map // mars3d.Map三维地图对象
let tiles3dLayer
let tilesEditor

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

  // 鼠标拖拽编辑，定义在js/TilesEditor.js
  tilesEditor = new TilesEditor({
    map: map,
    moveImg: "img/icon/move.png",
    rotateImg: "img/icon/rotate.png"
  })

  tilesEditor.on("change", function (data) {
    tilesEditor.enabled = true
    eventTarget.fire("tilesEditor", { data })
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 查看构件
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
export function checkedTree() {
  tiles3dLayer.tileset.style = undefined
}

/**
 *
 *
 * @param {string} url 面板中传入的url模型地址
 * @return {*} 无
 */
export function showModel(url) {
  removeLayer()

  if (!url) {
    alert("请输入图层URL！")
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: url,
    // 高亮时的样式
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      outlineEffect: true, // 采用OutlineEffect方式来高亮
      color: "#00FF00"
    },
    popup: "all",
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 加载完成事件
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    const data = event.tileset

    if (tiles3dLayer.transform) {
      tilesEditor.range = data.boundingSphere.radius * 0.9
      tilesEditor.heading = tiles3dLayer.rotation_z
      tilesEditor.position = tiles3dLayer.position
    } else {
      tilesEditor.enabled = false
    }

    // 触发自定义事件，更改面板中的值
    eventTarget.fire("tiles3dLayerLoad", { data, tiles3dLayer })
  })
}

// 异步求准确高度
export function getDefined(data) {
  const params = getConfig(data)
  // 求地面海拔 (异步)
  if (Cesium.defined(params.position) && Cesium.defined(params.position.alt)) {
    // 存在历史设置的高度时不用处理
  } else {
    mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, tiles3dLayer.orginCenterPosition, {
      asyn: true, // 是否异步求准确高度
      callback: function (newHeight) {
        if (newHeight == null) {
          return
        }
        const offsetZ = Math.ceil(newHeight - tiles3dLayer.orginCenterPoint.alt + 1)
        console.log("地面海拔：" + newHeight.toFixed(2) + ",需要偏移" + offsetZ)

        data.txtZ = offsetZ
        tiles3dLayer.height = offsetZ
      }
    })
  }
}

export function editor(event, txtZ) {
  if (Cesium.defined(event.position)) {
    const pos = event.position
    const thisZ = txtZ
    const position = mars3d.PointUtil.setPositionsHeight(pos, thisZ)

    tilesEditor.position = position
    tiles3dLayer.center = position

    const point = mars3d.LngLatPoint.fromCartesian(position)
    eventTarget.fire("changePoition", { point })
  } else if (Cesium.defined(event.heading)) {
    tiles3dLayer.rotation_z = event.heading
    eventTarget.fire("changeHeading", { tiles3dLayer })
  }
}
/**
 * 通过面板修改模型，将面板中的参数进行修改
 *
 * @param {object} pannelData 面板改变的值
 * @return {object} params  模型的参数
 */
export function getConfig(pannelData) {
  let url, maximumScreenSpaceError
  let tf = false
  if (pannelData) {
    url = pannelData.txtModel
    maximumScreenSpaceError = mars3d.Util.formatNum(pannelData.maximumScreenSpaceError, 1)
  } else {
    url = "//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json"
    maximumScreenSpaceError = 8
    tf = true
  }

  const params = {
    name: "模型名称",
    type: "3dtiles",
    url: url,
    maximumScreenSpaceError: maximumScreenSpaceError, // 【重要】数值加大，能让最终成像变模糊
    maximumMemoryUsage: 1024, // 【重要】内存分配变小有利于倾斜摄影数据回收，提升性能体验
    // center: map.getCameraView(),
    show: true
  }
  if (tf) {
    return params
  }

  const x = mars3d.Util.formatNum(pannelData.txtX, 6)
  if (x) {
    params.position = params.position || {}
    params.position.lng = x
  }

  const y = mars3d.Util.formatNum(pannelData.txtY, 6)
  if (y) {
    params.position = params.position || {}
    params.position.lat = y
  }

  const z = mars3d.Util.formatNum(pannelData.txtZ, 6)
  if (z) {
    params.position = params.position || {}
    params.position.alt = z
  }

  const rotation_x = mars3d.Util.formatNum(pannelData.rotationX, 1)
  if (rotation_x) {
    params.rotation = params.rotation || {}
    params.rotation.x = rotation_x
  }

  const rotation_y = mars3d.Util.formatNum(pannelData.rotationY, 1)
  if (rotation_y) {
    params.rotation = params.rotation || {}
    params.rotation.y = rotation_y
  }

  const rotation_z = mars3d.Util.formatNum(pannelData.rotationZ, 1)
  if (rotation_z) {
    params.rotation = params.rotation || {}
    params.rotation.z = rotation_z
  }

  const luminanceAtZenith = mars3d.Util.formatNum(pannelData.luminanceAtZenith, 1)
  if (luminanceAtZenith !== 0.2) {
    params.luminanceAtZenith = luminanceAtZenith
  }

  const scale = mars3d.Util.formatNum(pannelData.scale || 1, 1)
  if (scale > 0) {
    params.scale = scale
  }

  const axis = pannelData.axis
  params.axis = axis

  const isProxy = pannelData.chkProxy
  if (isProxy) {
    params.proxy = "//server.mars3d.cn/proxy/"
  }

  return params
}

// 修改更改后的参数
export function updateModel(pannelData) {
  // 获取参数
  const params = getConfig(pannelData)

  params.rotation = params.rotation || {}
  params.rotation.x = params.rotation.x || 0
  params.rotation.y = params.rotation.y || 0
  params.rotation.z = params.rotation.z || 0

  if (tiles3dLayer.transform) {
    tilesEditor.heading = tiles3dLayer.rotation_z
    tilesEditor.position = tiles3dLayer.position
  }
  tiles3dLayer.tileset.maximumScreenSpaceError = pannelData.maximumScreenSpaceError
  tiles3dLayer.tileset.luminanceAtZenith = pannelData.luminanceAtZenith
  tiles3dLayer.opacity = pannelData.opacity
  tiles3dLayer.setOptions(params)
  // 深度检测
  map.scene.globe.depthTestAgainstTerrain = pannelData.depthTestAgainstTerrain
  // 鼠标拖拽编辑
  tilesEditor.enabled = pannelData.tilesEditorEnabled
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
export function saveBookmark(params) {
  if (params.axis === "") {
    delete params.axis
  }

  mars3d.Util.downloadFile("3dtiles图层配置.json", JSON.stringify(params))
}

function removeLayer() {
  if (tiles3dLayer) {
    map.basemap = 2021 // 切换到默认卫星底图

    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
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
