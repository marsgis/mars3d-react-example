import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer

let video2D
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

  globalNotify("已知问题提示", `如视频未播放或服务URL访问超时，可能是在线演示URL链接已失效，您可以替换代码中URL为本地服务后使用。`)

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 43.7 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    video2D = event.graphic
    console.log("监听layer，单击了矢量对象", event)
  })

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindPopup("我是layer上绑定的Popup")

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: (e) => {
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

// 视频播放器播放 flv 报错 Flv: Unsupported codec in video frame: 12
// 原因:主要是因为我们的播放器不支持 H.265 视频编码；
// 解决办法:将设备端的视频编码改为 H.264
const flvUrl = "https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"

function createVideoDom() {
  videoElement = mars3d.DomUtil.create("video", "", document.body)
  videoElement.setAttribute("muted", "muted")
  videoElement.setAttribute("autoplay", "autoplay")
  videoElement.setAttribute("loop", "loop")
  videoElement.setAttribute("crossorigin", "")
  videoElement.setAttribute("controls", "")
  videoElement.style.display = "none"

  if (window.mpegts.isSupported()) {
    const flvPlayer = window.mpegts.createPlayer({
      type: "flv",
      url: flvUrl
    })
    flvPlayer.attachMediaElement(videoElement)
    flvPlayer.load()
    flvPlayer.play()
  } else {
    globalMsg("不支持flv格式视频")
  }

  setTimeout(() => {
    try {
      if (videoElement.paused) {
        globalMsg("当前浏览器已限制自动播放，请单击播放按钮")
        // videoElement.play()
      }
    } catch (e) {
      // 规避浏览器权限异常
      globalMsg("当前浏览器已限制自动播放，请单击播放按钮")
    }
  }, 3000)
}

export function getGraphic(graphicId) {
  video2D = graphicLayer.getGraphicById(graphicId)
  return video2D
}

export function setViedoGraphic(graphic) {
  video2D = graphic
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.Video2D({
      position,
      style: {
        container: videoElement,
        angle: 46.3,
        angle2: 15.5,
        heading: 88.5,
        pitch: 8.2,
        distance: 1178,
        showFrustum: true
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
}

// 投射视频
export function startDrawGraphic() {
  graphicLayer.clear()
  // 开始绘制
  graphicLayer.startDraw({
    type: "video2D",
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
}

// 按当前相机投射视频
export function startDrawGraphic2() {
  graphicLayer.clear()
  // 取屏幕中心点
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // 构造投射体
  video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition,
    style: {
      container: videoElement,
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)
}

export function playOrpause() {
  video2D.play = !video2D.play
}

// 改变水平角度
export function onChangeAngle(value) {
  if (video2D) {
    video2D.angle = value
  }
}

// 改变垂直角度
export function onChangeAngle2(value) {
  if (video2D) {
    video2D.angle2 = value
  }
}

// 改变投射距离
export function onChangeDistance(value) {
  if (video2D) {
    video2D.distance = value
  }
}

// 改变四周距离
export function onChangeHeading(value) {
  if (video2D) {
    video2D.heading = value
  }
}

// 改变俯仰角度
export function onChangePitch(value) {
  if (video2D) {
    video2D.pitch = value
  }
}

/**
 *
 * @export
 * @param {boolean} isCheckde 线框是否显示
 * @returns {void}
 */
export function showFrustum(isCheckde) {
  if (video2D) {
    video2D.showFrustum = isCheckde
  }
}

// 改变视频透明度
export function onChangeOpacity(opacity) {
  if (video2D) {
    video2D.setOpacity(opacity)
  }
}

/**
 * 视频角度
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
export function rotateDeg(num) {
  if (video2D) {
    video2D.setStyle({ stRotationDegree: num })
  }
}

// 定位至视频位置
export function locate() {
  if (video2D) {
    video2D.setView()
  }
}
// 打印参数
export function printParameters() {
  if (video2D) {
    const params = video2D.toJSON()
    console.log("Video2D构造参数为", JSON.stringify(params))
  }
}
// 视频位置
export async function selCamera() {
  if (video2D == null) {
    return
  }

  const graphic = await map.graphicLayer.startDraw({ type: "point" })
  const point = graphic.point
  graphic.remove() // 删除绘制的点

  video2D.position = point
}

// 四周视角选点
export async function onClickSelView() {
  if (!video2D) {
    return
  }

  const graphic = await map.graphicLayer.startDraw({ type: "point" })
  const point = graphic.point
  graphic.remove() // 删除绘制的点

  video2D.targetPosition = point
}
