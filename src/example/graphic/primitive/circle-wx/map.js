import * as mars3d from "mars3d"

export let map
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并)
export const mapOptions = {
  scene: {
    center: { lat: 37.290956, lng: 116.757437, alt: 26532614.1, heading: 360, pitch: -90 },
    sceneMode: 2,
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 50000000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    }
  },
  terrain: {
    show: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 添加矢量图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addGraphic()
}

function addGraphic() {
  const data = [
    {
      height: 35786,
      mapRadius: 6370,
      angleIncrement: 15,
      color: "#ff0000"
    },
    {
      height: 35786,
      mapRadius: 6370,
      angleIncrement: 40,
      color: "#00ff00"
    },
    {
      height: 35786,
      mapRadius: 6370,
      angleIncrement: 75,
      color: "#0000ff"
    }
  ]
  data.forEach((item) => {
    const radius = calculateAngle(item.height, item.mapRadius, item.angleIncrement).toFixed(2)
    console.log(radius)
    const circleGraphic = new mars3d.graphic.CirclePrimitive({
      position: [110.584194, 30.547723, 0],
      style: {
        radius: radius * 1000,
        outlineColor: item.color,
        fill: false,
        outline: true,
        outlineWidth: 3,
        clampToGround: true
      }
    })
    graphicLayer.addGraphic(circleGraphic)
  })
}

/**
 *
 * @param height 卫星距离地球的高度
 * @param mapRadius // 地球半径
 * @param angleIncrement // 角度增量 取值范围 0.01-89.99
 */
function calculateAngle(height, mapRadius, angleIncrement) {
  // 计算卫星距离地球中心点高度
  const distance = height + mapRadius

  // 计算与地球切面的角度，根据正弦定理推论
  const mapAngle = angleIncrement + 90

  // 使用正弦定理计算
  const sinAngle = Math.sin((mapAngle * Math.PI) / 180) // 将角度转换为弧度
  const sinAngleA = (mapRadius * sinAngle) / distance

  // 计算卫星与地球的夹角
  const satelliteAngle = ((Math.asin(sinAngleA) * 180) / Math.PI).toFixed(2) // 将弧度转换回角度

  console.log(satelliteAngle)

  const angleCDJ = Math.sin(((180 - mapAngle - satelliteAngle) * Math.PI) / 180)

  console.log((Math.asin(angleCDJ) * 180) / Math.PI)
  const CJ = angleCDJ * mapRadius

  return CJ
}

// 切换为二维视图
export function to2d() {
  map.scene.morphTo2D(0)
}

// 切换为三维视图
export function to3d() {
  map.scene.morphTo3D(0)
}

// 切换为2.5D维视图
export function toGLB() {
  map.scene.morphToColumbusView(0)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  if (graphicLayer) {
    graphicLayer.remove(true) // 销毁内部会释放所有事件及数据
    graphicLayer = null
  }
  map = null
}
