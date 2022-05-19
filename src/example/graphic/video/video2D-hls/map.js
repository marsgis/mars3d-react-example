import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

let selectedView
let videoElement

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.844188, lng: 117.205321, alt: 143, heading: 175, pitch: -26 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: -24 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    selectedView = event.graphic
    console.log("监听layer，单击了矢量对象", event)
  })

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindPopup("我是layer上绑定的Popup")

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    }
  ])

  createVideoDom()
  addDemoGraphic1()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// let hlsUrl = "http://ivi.bupt.edu.cn/hls/cctv13.m3u8";
// const hlsUrl = "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
const hlsUrl = "http://1252093142.vod2.myqcloud.com/4704461fvodcq1252093142/f865d8a05285890787810776469/playlist.f3.m3u8"

function createVideoDom(callback) {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  if (window.Hls.isSupported()) {
    const hls = new window.Hls()
    hls.loadSource(hlsUrl)
    hls.attachMedia(videoElement)
    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
      videoElement.play()
      if (callback) {
        callback()
      }
    })
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = hlsUrl
    videoElement.addEventListener("loadedmetadata", function () {
      videoElement.play()
      if (callback) {
        callback()
      }
    })
  }
}

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  const video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  selectedView = video2D // 记录下

  eventTarget.fire("loadVideo", {
    value: {
      cameraAngle: selectedView.angle,
      cameraAngle2: selectedView.angle2,
      heading: selectedView.heading,
      pitchValue: selectedView.pitch,
      distanceValue: selectedView.distance,
      opcity: selectedView.opacity,
      ckdFrustum: selectedView.showFrustum
    }
  })
}

// 投射视频
export function addVideo(data) {
  // 开始绘制
  graphicLayer.startDraw({
    type: "video2D",
    style: {
      container: videoElement,
      angle: data.cameraAngle,
      angle2: data.cameraAngle2,
      heading: data.heading,
      pitch: data.pitchValue,
      distance: data.distanceValue,
      showFrustum: data.ckdFrustum
    },
    success: function (graphic) {
      console.log("绘制完成", graphic)

      selectedView = graphic // 记录下
    }
  })
}

// 按当前相机投射视频
export function addThisCamera(data) {
  // 取屏幕中心点
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // 构造投射体
  const video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition: targetPosition,
    style: {
      container: videoElement,
      angle: data.cameraAngle,
      angle2: data.cameraAngle2,
      opacity: data.opcity,
      showFrustum: data.ckdFrustum
    }
  })
  graphicLayer.addGraphic(video2D)

  selectedView = video2D // 记录下
}

// 清除
export function clear() {
  graphicLayer.clear()
  selectedView = null
}

export function playOrpause() {
  if (!selectedView) {
    return
  }
  selectedView.play = !selectedView.play
}

// 改变水平角度
export function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

// 改变垂直角度
export function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

// 改变投射距离
export function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

// 改变四周距离
export function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

// 改变俯仰角度
export function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

/**
 *
 * @export
 * @param {boolean} isCheckde 线框是否显示
 * @returns {void}
 */
export function showFrustum(isCheckde) {
  if (selectedView) {
    selectedView.showFrustum = isCheckde
  }
}

// 改变视频透明度
export function onChangeOpacity(value) {
  if (selectedView) {
    selectedView.opacity = value
  }
}

/**
 * 视频角度
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
export function rotateDeg(num) {
  if (selectedView) {
    selectedView.setStyle({ stRotationDegree: num })
  }
}

// 定位至视频位置
export function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}
// 打印参数
export function printParameters() {
  if (!selectedView) {
    return
  }

  const params = selectedView.toJSON()
  console.log("Video2D构造参数为", JSON.stringify(params))
}
// 视频位置
export function selCamera() {
  if (selectedView == null) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // 删除绘制的点

      selectedView.position = point
    }
  })
}

// 四周视角选点
export function onClickSelView() {
  if (!selectedView) {
    return
  }

  map.graphicLayer.startDraw({
    type: "point",
    success: (graphic) => {
      const point = graphic.point
      graphic.remove() // 删除绘制的点

      selectedView.targetPosition = point
    }
  })
}
