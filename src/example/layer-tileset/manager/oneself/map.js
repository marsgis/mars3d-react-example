import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option = {
    scene: {
      center: { lat: 33.597401, lng: 119.031399, alt: 514, heading: 0, pitch: -46 },
      showSun: false,
      showMoon: false,
      showSkyBox: false,
      showSkyAtmosphere: false,
      fog: false,
      backgroundColor: "#363635", // 天空背景色
      contextOptions: { webgl: { antialias: mars3d.Util.isPCBroswer() } },
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
    },
    control: {
      baseLayerPicker: false,
      sceneModePicker: false,
      locationBar: {
        fps: true,
        template: "<div>经度:{lng}</div> <div>纬度:{lat}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div>"
      }
    },
    layers: [
      {
        name: "网格线",
        type: "grid",
        color: "#ffffff",
        alpha: 0.03,
        cells: 2,
        show: true
      }
    ]
  }
  delete option.terrain
  delete option.basemaps

  return option
}

const storageName = "layer-tileset-manager-oneself"

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

export function changeColor(color) {
  const clr = Cesium.Color.fromCssColorString(color)
  map.scene.backgroundColor = clr // 空间背景色
  map.scene.globe.baseColor = clr // 地表背景色

  document.body.style.backgroundColor = color
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

// 当前页面业务相关
export function showModel(url) {
  removeLayer()
  if (!url) {
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: url,
    maximumScreenSpaceError: 1,
    backFaceCulling: false, // 禁用背面剔除
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    console.log("模型加载完成", event)
    localforage.setItem(storageName, url) // 记录历史值

    // 限定缩放级别
    map.scene.screenSpaceCameraController.maximumZoomDistance = tiles3dLayer.boundingSphere.radius * 5

    // 模型不可以拖拽移动位置，可放大缩小，旋转
    // const center = tiles3dLayer.center.toCartesian()
    // const offset = new Cesium.HeadingPitchRange(0, 0, tiles3dLayer.boundingSphere.radius)
    // map.camera.lookAt(center, offset)

    // 自动贴地处理
    tiles3dLayer.clampToGround(10)
  })
}

export function flyTo() {
  tiles3dLayer.flyTo()
}
