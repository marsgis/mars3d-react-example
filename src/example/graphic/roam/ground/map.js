import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let roamLine
const roamLineData = {}

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

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
    name: "贴地表表面漫游",
    speed: 160,
    positions: [
      [116.043233, 30.845286, 392.48],
      [116.046833, 30.846863, 411.33],
      [116.052137, 30.848801, 439.45],
      [116.060838, 30.850918, 442.91],
      [116.069013, 30.852035, 435.14],
      [116.18739, 30.854441, 244.53],
      [116.205214, 30.859332, 300.96]
    ],
    // model: {
    //   show: true,
    //   url: '//data.mars3d.cn/gltf/mars/qiche.gltf',
    //   scale: 0.2,
    //   minimumPixelSize: 50,
    // },
    model: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      heading: 90,
      minimumPixelSize: 50,
      show: true
    },
    path: {
      color: "#ffff00",
      width: 3,
      show: true
    },
    camera: {
      type: "gs",
      pitch: -30,
      radius: 500
    },
    interpolation: true, // 是否setInterpolationOptions插值
    clockLoop: true // 是否循环播放
  }

  roamLine = new mars3d.graphic.RoamLine(flydata)
  graphicLayer.addGraphic(roamLine)

  roamLine.bindPopup(`<div style="width: 200px">
      <div>总 距 离：<span id="lblAllLen"> </span></div>
      <div>总 时 间：<span id="lblAllTime"> </span></div>
      <div>开始时间：<span id="lblStartTime"> </span></div>
      <div>剩余时间：<span id="lblRemainTime"> </span></div>
      <div>剩余距离：<span id="lblRemainLen"> </span></div>
    </div>`)

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

  roamLine.on(mars3d.EventType.change, (event) => {
    // 面板显示相关信
    showRealTimeInfo(event, roamLine.alltimes)
    // 漫游组件
    eventTarget.fire("roamLineChange", roamLineData)
  })

  // 不贴地时，直接开始
  // startFly()

  // 贴地时，异步计算完成后开始
  roamLine.clampToGround().then(function () {
    // 异步计算完成贴地后再启动
    // 贴地后的路线值为flyLine.points
    startFly()
  })
}

function startFly() {
  // 启动漫游
  roamLine.start()

  // 显示popup
  roamLine.openPopup()

  // 显示基本信息，名称、总长、总时间
  roamLineData.td_alltimes = mars3d.Util.formatTime(roamLine.alltimes)
  roamLineData.td_alllength = mars3d.MeasureUtil.formatDistance(roamLine.alllen)

  addParticleSystem(roamLine)
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

/// 添加尾气粒子效果
function addParticleSystem(target) {
  const particleSystem = new mars3d.graphic.ParticleSystem({
    modelMatrix: (time) => {
      return target.modelMatrix
    },
    style: {
      image: "./img/particle/smoke.png",
      startColor: Cesium.Color.GREY.withAlpha(0.7), // 粒子出生时的颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 当粒子死亡时的颜色
      startScale: 1.0, // 粒子出生时的比例，相对于原始大小
      endScale: 5.0, // 粒子在死亡时的比例
      minimumParticleLife: 1.2, // 设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随机生成
      maximumParticleLife: 1.2, // 设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随机生成
      minimumSpeed: 1.0, // 设置以米/秒为单位的最小界限，超过该最小界限，随机选择粒子的实际速度。
      maximumSpeed: 4.0, // 设置以米/秒为单位的最大界限，超过该最大界限，随机选择粒子的实际速度。
      emissionRate: 20.0, // 每秒要发射的粒子数。
      lifetime: 16.0 // 粒子的生命周期为（以秒为单位）。
    },
    transX: -4.0,
    transZ: 1.4,
    maxHeight: 1000 // 超出该高度后不显示粒子效果
  })
  map.graphicLayer.addGraphic(particleSystem)
}
