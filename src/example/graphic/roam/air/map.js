import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let roamLine
const roamLineData = {}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 参数可以从 基础项目 飞行漫游功能界面操作后保存JSON
  roamLine = new mars3d.graphic.RoamLine({
    name: "空中漫游",
    timeField: "datatime",
    positions: [
      { lng: 117.217898, lat: 31.80021, alt: 500, datatime: "2021/3/25 0:01:00" },
      { lng: 117.217535, lat: 31.815032, alt: 500, datatime: "2021/3/25 0:01:30" },
      { lng: 117.21596, lat: 31.853067, alt: 500, datatime: "2021/3/25 0:02:10" }
    ],
    camera: {
      type: "dy",
      followedX: 50,
      followedZ: 10
    },
    clockLoop: true, // 是否循环播放
    interpolation: true // setInterpolationOptions插值
  })
  graphicLayer.addGraphic(roamLine)

  // 开始漫游
  roamLine.start()

  addDivPoint(roamLine.property)

  // 显示基本信息，名称、总长、总时间
  roamLineData.td_alltimes = mars3d.Util.formatTime(roamLine.alltimes)
  roamLineData.td_alllength = mars3d.MeasureUtil.formatDistance(roamLine.alllen)

  roamLine.on(mars3d.EventType.change, (event) => {
    // 面板显示相关信
    showRealTimeInfo(event, roamLine.alltimes)
    // 漫游组件
    eventTarget.fire("roamLineChange", roamLineData)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
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

function addDivPoint(position) {
  // 创建DIV数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const graphic = new mars3d.graphic.DivGraphic({
    position: position,
    hasCache: false,
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
                  <div class="marsTiltPanel-wrap">
                      <div class="area">
                          <div class="arrow-lt"></div>
                          <div class="b-t"></div>
                          <div class="b-r"></div>
                          <div class="b-b"></div>
                          <div class="b-l"></div>
                          <div class="arrow-rb"></div>
                          <div class="label-wrap">
                              <div class="title">创业大道</div>
                              <div class="label-content">
                                  <div class="data-li">
                                      <div class="data-label">当前位置：</div>
                                      <div class="data-value">安徽省合肥市蜀山区XX号 </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">今年产值：</div>
                                      <div class="data-value"><span class="label-num">99</span><span class="label-unit">亿元</span>
                                      </div>
                                  </div>
                                  <div class="data-li">
                                      <div class="data-label">当前照片：</div>
                                      <div class="data-value"><img src="http://marsgis.cn/img/common/logo.png"> </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="b-t-l"></div>
                      <div class="b-b-r"></div>
                  </div>
                  <div class="arrow" ></div>
              </div>`,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 100000, 0.1)
    }
  })
  graphicLayer.addGraphic(graphic)
}
