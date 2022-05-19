import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

let roamLine
const roamLineData = {}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  addGraphicLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addGraphicLayer() {
  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 该数据可以从 基础项目 飞行漫游功能界面操作后单个路线的 保存JSON
  const flydata = {
    name: "步行路线",
    speed: 40,
    positions: [
      [117.220356, 31.833959, 43.67],
      [117.220361, 31.835111, 44.36],
      [117.213242, 31.835863, 42.31],
      [117.211926, 31.835738, 42.14],
      [117.183103, 31.833906, 47.17],
      [117.183136, 31.833586, 47.39],
      [117.183968, 31.833637, 47.05],
      [117.184038, 31.833134, 47.39],
      [117.184364, 31.833142, 47.26],
      [117.184519, 31.833375, 47.04]
    ],
    model: {
      show: true,
      url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50
    },
    shadow: [
      {
        type: "circle",
        radius: 10,
        color: "#ffff00",
        opacity: 0.3,
        materialType: mars3d.MaterialType.CircleWave,
        speed: 10,
        count: 3,
        gradient: 0.1,
        show: true
      }
    ],
    camera: {
      type: "gs",
      radius: 300
    },
    clockRange: Cesium.ClockRange.CLAMPED, // CLAMPED到达终点后停止
    pauseTime: 0.5
  }

  roamLine = new mars3d.graphic.RoamLine(flydata)
  graphicLayer.addGraphic(roamLine)

  roamLine.on(mars3d.EventType.endItem, function (event) {
    console.log("已漫游过点：" + event.index, event)
  })
  roamLine.on(mars3d.EventType.end, function (event) {
    console.log("漫游结束", event)
  })

  roamLine.on(mars3d.EventType.change, (event) => {
    // 面板显示相关信息
    showRealTimeInfo(event, roamLine.alltimes)
    // 漫游组件
    eventTarget.fire("roamLineChange", roamLineData)
  })

  roamLine.bindPopup(
    () => {
      const html = `<div id="popupContent"  class="marsBlackPanel animation-spaceInDown">
    <div class="marsBlackPanel-text">
      <div style="width: 200px;text-align:left;">
        <div>总 距 离：<span id="lblAllLen"> </span></div>
        <div>总 时 间：<span id="lblAllTime"> </span></div>
        <div>开始时间：<span id="lblStartTime"> </span></div>
        <div>剩余时间：<span id="lblRemainTime"> </span></div>
        <div>剩余距离：<span id="lblRemainLen"> </span></div>
      </div>
    </div>
    <span class="mars3d-popup-close-button closeButton" >×</span>
    </div>`
      return html
    },
    { offsetY: -40, template: false }
  )

  // 刷新局部DOM,不影响popup面板的其他控件操作
  roamLine.on(mars3d.EventType.postRender, function (event) {
    const container = event.container // popup对应的DOM

    const params = roamLine?.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = mars3d.MeasureUtil.formatDistance(roamLine.alllen)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = mars3d.Util.formatTime(roamLine.alltimes / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(roamLine.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = mars3d.Util.formatTime((roamLine.alltimes - params.time) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(roamLine.alllen - params.len)
    }
  })

  // 不贴地时，直接开始
  startFly()

  // 贴地时，异步计算完成后开始
  // roamLine.clampToGround({ has3dtiles: true }).then(function () {//异步计算完成贴地后再启动
  //     //贴地后的路线值为flyLine.positions
  //     startFly()
  // });
}

function startFly() {
  // 启动漫游
  roamLine.start()

  // 显示popup
  roamLine.openPopup()

  // 显示基本信息，名称、总长、总时间
  roamLineData.td_alltimes = mars3d.Util.formatTime(roamLine.alltimes)
  roamLineData.td_alllength = mars3d.MeasureUtil.formatDistance(roamLine.alllen)
}

// 显示实时坐标和时间
function showRealTimeInfo(params, _alltime) {
  if (params == null) {
    return
  }

  let val = Math.ceil((params.time * 100) / _alltime)
  if (val < 1) {
    val = 1
  }
  if (val > 100) {
    val = 100
  }

  roamLineData.percent = val

  roamLineData.td_jd = params.lng
  roamLineData.td_wd = params.lat
  roamLineData.td_gd = mars3d.MeasureUtil.formatDistance(params.alt)

  roamLineData.td_times = mars3d.Util.formatTime(params.time)
  roamLineData.td_length = mars3d.MeasureUtil.formatDistance(params.len)

  if (params.hbgd) {
    roamLineData.td_dmhb = mars3d.MeasureUtil.formatDistance(params.hbgd)
  } else {
    roamLineData.td_dmhb = "未知"
  }

  if (params.ldgd) {
    roamLineData.td_ldgd = mars3d.MeasureUtil.formatDistance(params.ldgd)
  } else {
    roamLineData.td_ldgd = "未知"
  }
}
