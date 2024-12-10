import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let measure

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 修改编辑点样式，比如大小
  mars3d.DrawUtil.setAllEditPointStyle({ pixelSize: 14 })

  measure = new mars3d.thing.Measure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    },
    isAutoEditing: false // 绘制完成后是否自动激活编辑
    // drawEndEventType: mars3d.EventType.rightClick,
    // drawDelEventType: mars3d.EventType.middleClick
  })
  map.addThing(measure)

  measure.on(mars3d.EventType.start, function (e) {
    console.log("开始异步分析", e)
    showLoading()
  })
  measure.on(mars3d.EventType.end, function (e) {
    console.log("完成异步分析", e)
    hideLoading()
  })

  // 加一些演示数据
  addDemoGraphic1(measure.graphicLayer)
  addDemoGraphic2(measure.graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

export function removeAll() {
  measure.clear()
}

// 空间距离
export async function measureLength() {
  const graphic = await measure.distance({
    showAddText: true,
    label: {
      // 自定义显示label的graphic类型
      type: "div",
      updateText: function (text, graphic) {
        // updateText是必须，用于动态更新 text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      // 下面是graphic对应类型本身的参数
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      // pointerEvents: false
    }
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: false //是否贴地
    // }
  })
}

// 贴地距离
export async function measureSurfaceLength() {
  const graphic = await measure.distanceSurface({
    showAddText: true,
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    // unit: 'm', //支持传入指定计量单位
    // style: {
    //   color: '#ffff00',
    //   width: 3,
    //   clampToGround: true //是否贴地
    // }
  })
}

// 水平面积
export async function measureArea() {
  const graphic = await measure.area({
    // style: {
    //   color: '#00fff2',
    //   opacity: 0.4,
    //   outline: true,
    //   outlineColor: '#fafa5a',
    //   outlineWidth: 1,
    //   clampToGround: false //贴地
    // }
  })

  // 下面代码抬升面的高度到一个平面，来示意“水平”
  if (map.scene.mode === Cesium.SceneMode.SCENE3D) {
    const oldPositions = graphic.positionsShow
    const rang = await mars3d.PolyUtil.getHeightRangeByDepth(oldPositions, map.scene)
    graphic.positions = mars3d.PointUtil.setPositionsHeight(oldPositions, rang.maxHeight)
  }
}

// 贴地面积
export async function measureSurfaceeArea() {
  const graphic = await measure.areaSurface({
    style: {
      color: "#ffff00"
    },
    splitNum: 10, // step插值分割的个数
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
  })
}
// 高度差
export async function measureHeight() {
  const graphic = await measure.height()
}

// 三角测量
export async function measureTriangleHeight() {
  const graphic = await measure.heightTriangle()
}

// 方位角
export async function measureAngle() {
  const graphic = await measure.angle()
}

// 坐标测量
export async function measurePoint() {
  const graphic = await measure.point({
    // popup: function (point, graphic) {
    //   return `<div class="mars3d-template-title">位置信息</div>
    //   <div class="mars3d-template-content">
    //       <div><label>经度</label>${point.lng}</div>
    //       <div><label>纬度</label>${point.lat}</div>
    //       <div><label>海拔</label>${point.alt}米</div>
    //   </div>`
    // }
  })
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DistanceMeasure({
    positions: [
      [116.193794, 30.994415, 654.8],
      [116.236077, 30.925154, 506.2],
      [116.314569, 30.864239, 408.7],
      [116.341924, 30.847984, 381.8],
      [116.392754, 30.854264, 581.7],
      [116.415222, 30.880092, 580.5],
      [116.567457, 30.85223, 314.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    showAddText: true,
    label: {
      // 自定义显示label的graphic类型
      type: "div",
      updateText: function (text, graphic) {
        // updateText是必须，用于动态更新 text
        graphic.html = `<div class="marsGreenGradientPnl" >${text}</div>`
      },
      // 下面是graphic对应类型本身的参数
      html: `<div class="marsGreenGradientPnl" ></div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.AreaMeasure({
    positions: [
      [116.361008, 31.128286, 802.2],
      [116.375784, 31.029192, 868.6],
      [116.497717, 31.063687, 497.5],
      [116.509114, 31.146745, 577.1],
      [116.425476, 31.184474, 676.2]
    ],
    style: {
      color: "#ff0000"
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

export function openJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json") {
    const reader = new FileReader()
    console.log("reader")
    console.log(reader)
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = JSON.parse(this.result)
      console.log("打开了json文件", json)
      measure.graphicLayer.loadJSON(json, { flyTo: true, clear: true })
    }
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

export function saveJSON() {
  if (measure.graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = measure.graphicLayer.toJSON()
  mars3d.Util.downloadFile("测量结果.json", JSON.stringify(geojson))
}
