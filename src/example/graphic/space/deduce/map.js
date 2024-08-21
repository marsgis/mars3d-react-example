import * as mars3d from "mars3d"
import "./index.css"

export let map // mars3d.Map三维地图对象
export let graphicLayer
export let lineLayer
export let satelliteLayer
const Cesium = mars3d.Cesium

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export const mapOptions = {
  scene: {
    center: { lat: 42.126999, lng: 98.685654, alt: 16560060, heading: 5.6, pitch: -89 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
  }
}

export function onMounted(mapInstance) {
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 线矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  // 卫星矢量数据图层
  satelliteLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(satelliteLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}
const posArr = [
  {
    name: "中国资源卫星应用中心",
    pos: [116.240032464881, 40.0797910765005, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },

  {
    name: "自然资源部",
    pos: [116.364862, 39.922346, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "生态环境部",
    pos: [116.352146287861, 39.9315519489232, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "农业农村部",
    pos: [116.457555, 39.932756, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "水利部",
    pos: [116.352155, 39.884728, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "国家发展改革委",
    pos: [116.331546, 39.912456, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },

  {
    name: "住建部",
    pos: [116.326609, 39.930379, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "国家林业草原局",
    pos: [116.419465, 39.954384, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "交通运输部",
    pos: [116.419109, 39.908169, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "中国地震局",
    pos: [116.284736, 39.906494, 0],
    model: "//data.mars3d.cn/gltf/imap/171112f22bf34b09a80dfe36b7a2c3ce/gltf/gltf2.gltf"
  },
  {
    name: "西安卫星测控中心",
    pos: [109.023912, 34.250872, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "中国科学院遥感与数字地球研究所",
    pos: [116.276306422658, 40.0706289383518, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },

  {
    name: "密云站",
    pos: [116.858716105082, 40.452385253501, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "喀什站",
    pos: [75.93105, 39.505111, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "北极站",
    pos: [20.186391, 67.8537518, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "三亚站",
    pos: [109.311472012774, 18.312718489265, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  },
  {
    name: "昆明站",
    pos: [102.372779, 25.532377, 0],
    model: "//data.mars3d.cn/gltf/mars/leida.glb"
  }
]

// 初始化场景
export function initScene() {
  for (let index = 0; index < posArr.length; index++) {
    const scenePos = posArr[index]
    // 加模型
    const graphic = new mars3d.graphic.ModelEntity({
      name: "地面站模型",
      position: scenePos.pos,
      style: {
        url: scenePos.model,
        scale: 1,
        minimumPixelSize: 40,
        clampToGround: true,
        label: {
          text: scenePos.name,
          font_size: 40,
          scale: 0.5,
          font_family: "楷体",
          color: "#e5fcff",
          outline: true,
          outlineColor: "#3565a3",
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          visibleDepth: false
        }
      }
    })
    graphicLayer.addGraphic(graphic)
  }
}

// 需求受理

export function acceptance() {
  satelliteLayer.clear() // 清除卫星数据
  map.setCameraView(
    { lat: 39.869944, lng: 115.884115, alt: 17452.2, heading: 65, pitch: -28.3 },
    {
      complete: () => accepAction()
    }
  )
}

function accepAction() {
  // 线
  for (let i = 1; i <= 9; i++) {
    const startPoint = Cesium.Cartesian3.fromDegrees(posArr[i].pos[0], posArr[i].pos[1])
    const endPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
    const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // 计算曲线点
    const graphic = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        width: 4,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "#ff0000",
          speed: 8,
          percent: 0.15,
          alpha: 0.2
        }
      }
    })
    lineLayer.addGraphic(graphic)
  }
}

// 任务编排
export function task() {
  satelliteLayer.clear() // 清除卫星数据
  const cameraView = { lat: 40.051583, lng: 116.238469, alt: 1672.4, heading: 7.8, pitch: -27.7 }
  const html = `<div class="info">
              <div class="working title">任务编排</div>
               <h3 style="padding:0 10px">编排中...</h3>
              <br><p style="padding:0 10px; line-height:30px;">中国资源卫星应用中心接收到各部门的任务请求，然后进行数据处理对任务进行分析，整理，整合出合适的方案。。。</p>
           </div>`

  addDivGraphic(cameraView, html)
}

// 任务上注
export function startTask() {
  map.setCameraView({ lat: 23.644034, lng: 66.747739, alt: 4865177.6, heading: 358, pitch: -63 }, { complete: () => addTask() })
}

function addTask() {
  const weixin = addSatelliteGrahic()
  satelliteLayer.addGraphic(weixin)
  const propertyQC = getSampledPositionProperty([[75.93105, 39.505111, 0]])

  // 圆锥追踪体（动态position=>动态targetPosition）
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: propertyQC,
    targetPosition: weixin.property,
    style: {
      angle: 5, // 半场角度
      // 自定义扩散波纹纹理
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      }
    }
  })
  satelliteLayer.addGraphic(coneTrack)

  setTimeout(() => {
    satelliteLayer.removeGraphic(coneTrack)
  }, 5000)
}

// 卫星观测
export function satelliteLook() {
  map.setCameraView({ lat: 30.560391, lng: 58.246962, alt: 4113469.4, heading: 358, pitch: -63 }, { complete: () => lookAction() })
}

function lookAction() {
  const weixin = addSatelliteGrahic()

  // 视锥体 展示
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: weixin.property,
    orientation: new Cesium.VelocityOrientationProperty(weixin.property),
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: 20,
      angle2: 10,
      color: "rgba(110,245,0,0.5)"
    }
  })
  satelliteLayer.addGraphic(satelliteSensor)

  setTimeout(() => {
    satelliteLayer.removeGraphic(satelliteSensor)
  }, 10000)
}

// 数据接收
export function sendDataAction() {
  map.setCameraView({ lat: 23.644034, lng: 66.747739, alt: 4865177.6, heading: 358, pitch: -63 }, { complete: () => sendData() })
}

function sendData() {
  const weixin = addSatelliteGrahic()
  const propertyQC = getSampledPositionProperty([[75.93105, 39.505111, 0]])

  // 圆锥追踪体（动态position=>动态targetPosition）
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: weixin.property,
    targetPosition: propertyQC,
    style: {
      angle: 5, // 半场角度
      // 自定义扩散波纹纹理
      materialType: mars3d.MaterialType.CylinderWave,
      materialOptions: {
        color: "#ffff00",
        repeat: 30.0
      },
      faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
      closed: true // 是否为封闭体，实际上执行的是 是否进行背面裁剪
    }
  })
  satelliteLayer.addGraphic(coneTrack)

  setTimeout(() => {
    satelliteLayer.removeGraphic(coneTrack)
  }, 5000)
}

// 数据传输
export function transferringData() {
  satelliteLayer.clear() // 清除卫星数据

  // 场景视角
  map.setCameraView({ lat: 39.647456, lng: 116.234526, alt: 61145.4, heading: 17.5, pitch: -42.8 }, { complete: () => transferringAction() })
}

function transferringAction() {
  const startPoint = Cesium.Cartesian3.fromDegrees(116.858716105082, 40.452385253501)
  const endPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // 计算曲线点
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: {
      width: 4,
      materialType: mars3d.MaterialType.LineFlowColor,
      materialOptions: {
        color: "#ff0000",
        speed: 6,
        percent: 0.15,
        alpha: 0.2
      }
    }
  })
  lineLayer.addGraphic(graphic)
}

// 产品生产
export function production() {
  const cameraView = { lat: 40.070515, lng: 116.23878, alt: 2213.5, heading: 3, pitch: -68.8 }

  const html = ` <div class="info">
  <div class="working title">产品生产</div>
  <h3 style="padding:0 10px">产品生产中...</h3>
  <br><p style="padding:0 10px;line-height:30px;">中国资源卫星应用中心接收到密云站传送过来的信息开始对数据进行处理然后生成产品...</p>
</div>`
  addDivGraphic(cameraView, html)
}

// 产品分发
export function distribution() {
  clearGraphicLayer()
  map.setCameraView({ lat: 39.869944, lng: 115.884115, alt: 17452.2, heading: 65, pitch: -28.3 }) // 改变相机视角
  // 线
  for (let i = 1; i <= 9; i++) {
    const startPoint = Cesium.Cartesian3.fromDegrees(116.240032464881, 40.0797910765005)
    const endPoint = Cesium.Cartesian3.fromDegrees(posArr[i].pos[0], posArr[i].pos[1])
    const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 2000, 50) // 计算曲线点
    const graphic = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        width: 4,
        materialType: mars3d.MaterialType.LineFlowColor,
        materialOptions: {
          color: "#ff0000",
          speed: 6,
          percent: 0.15,
          alpha: 0.2
        }
      }
    })
    lineLayer.addGraphic(graphic)
  }
}

function addDivGraphic(cameraView, divhtml) {
  clearGraphicLayer()
  map.setCameraView(cameraView, {
    complete: () => {
      const divGraphic = new mars3d.graphic.DivGraphic({
        position: [116.240032464881, 40.0797910765005],
        style: {
          html: divhtml,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
          clampToGround: true
        }
      })
      graphicLayer.addGraphic(divGraphic)
      setTimeout(() => {
        graphicLayer.removeGraphic(divGraphic)
      }, 3000)
    }
  })
}

let weixin
function addSatelliteGrahic() {
  if (!weixin || !weixin.isAdded) {
    map.clock.currentTime = Cesium.JulianDate.fromIso8601("2019-07-15T18:48:48.36721000009856652Z")
    map.clock.multiplier = 2 // 速度
    weixin = new mars3d.graphic.Satellite({
      name: "GF-1",
      tle1: "1 39150U 13018A   19351.75901006  .00000041  00000-0  13118-4 0  9991",
      tle2: "2 39150  97.8876  68.0565 0018875 352.9713   7.1223 14.76542863358056",
      model: {
        url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
        scale: 1,
        minimumPixelSize: 90
      },
      label: {
        text: "GF-1",
        color: "#ffffff"
      },
      path: {
        color: "#00ff00",
        opacity: 0.5,
        width: 1
      }
    })

    satelliteLayer.addGraphic(weixin)
  }
  // 目标卫星
  return weixin
}

// 计算演示的SampledPositionProperty轨迹
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function clearGraphicLayer() {
  if (lineLayer) {
    lineLayer.clear() // 线矢量数据
  }

  if (satelliteLayer) {
    satelliteLayer.clear() // 清除卫星数据
  }
}

export function clearAll() {
  lineLayer.clear() // 线矢量数据
  satelliteLayer.clear() // 清除卫星数据
  graphicLayer.clear()
}
