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
      contextOptions: { webgl: { antialias: !mobilecheck() } },
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

function mobilecheck() {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true
    }
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}
