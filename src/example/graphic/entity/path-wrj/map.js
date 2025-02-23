import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let pathEntity = null

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.550222, lng: 117.366824, alt: 2696, heading: 273, pitch: -67 },
    clock: {
      currentTime: "2021-07-01 10:45:00"
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "https://data.mars3d.cn/file/apidemo/flypath.json" })
    .then(function (res) {
      initPath(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 改变视角  跟踪，上方和侧方
export function viewAircraft() {
  map.trackedEntity = pathEntity.entity

  setTimeout(() => {
    pathEntity.flyToPoint({
      radius: 500, // 距离目标点的距离
      heading: 40,
      pitch: -50,
      duration: 0
    })
  }, 100)
}
export function viewTopDown() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 2000,
    heading: -90,
    pitch: -89
  })
}
export function viewSide() {
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity.positionShow, {
    radius: 3000,
    heading: -90,
    pitch: -25
  })
}

function initPath(data) {
  const list = []
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    const position = { lng: Number(item.x), lat: Number(item.y), alt: item.z, currTime: item.time }
    list.push(position)

    const graphic = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        pixelSize: 4,
        color: "#cccccc"
      },
      popup: "编号:" + item.id + "<br/>时间:" + item.time
    })
    graphicLayer.addGraphic(graphic)
  }

  // 创建path对象
  pathEntity = new mars3d.graphic.PathEntity({
    position: {
      type: "time", // 时序动态坐标
      list: list,
      timeField: "currTime",
      forwardExtrapolationType: Cesium.ExtrapolationType.HOLD // 在最后1个结束时间之后，NONE时不显示，HOLD时显示结束时间对应坐标位置
    },
    style: {
      resolution: 1,
      leadTime: 0,
      trailTime: 3600,
      color: "#ff0000",
      width: 3
    },
    label: {
      text: "飞机1号",
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE,
      outline: true,
      visibleDepth: false,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    // billboard: {
    //   image: "https://data.mars3d.cn/img/marker/lace-blue.png",
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //   visibleDepth: false
    // },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.1,
      minimumPixelSize: 20
    },
    popup: "飞行1号"
  })
  graphicLayer.addGraphic(pathEntity)

  // 圆锥追踪体
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: pathEntity.property,
    style: {
      length: 100,
      angle: 12, // 半场角度
      color: "#ff0000",
      opacity: 0.5
    }
  })
  graphicLayer.addGraphic(coneTrack)

  // 设置时钟属性
  const timeRange = pathEntity.timeRange
  if (timeRange) {
    map.clock.startTime = timeRange.startTime.clone()
    map.clock.stopTime = timeRange.stopTime.clone()
    map.clock.currentTime = timeRange.startTime.clone()
    map.clock.clockRange = Cesium.ClockRange.LOOP_STOP
    map.clock.multiplier = 5

    if (map.control.timeline) {
      map.control.timeline.zoomTo(map.clock.startTime, map.clock.stopTime)
    }
  }
}
