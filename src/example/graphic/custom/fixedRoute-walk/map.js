import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
export let fixedRoute

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.824853, lng: 117.221414, alt: 1452, heading: 355, pitch: -54 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { style: { top: "10px", right: "5px" } }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.control.toolbar.container.style.bottom = "55px" // 修改toolbar控件的样式
  map.clock.multiplier = 1

  // 修改文本
  map.setLangText({
    _米: "m",
    _公里: "km",
    _秒: "s ",
    _分钟: "m ",
    _小时: "h "
  })

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // ui面板信息展示
  graphicLayer.on(
    mars3d.EventType.change,
    mars3d.Util.funThrottle((event) => {
      // 取实时信息，可以通过  fixedRoute.info
      eventTarget.fire("roamLineChange", event)
    }, 500)
  )

  bindPopup() // 绑定popup
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  addDemoGraphic1()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

function addDemoGraphic1() {
  fixedRoute = new mars3d.graphic.FixedRoute({
    name: "步行路线",
    position: {
      type: "time", // 时序动态坐标
      speed: 40,
      pauseTime: 0.5,
      list: [
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
      ]
    },
    // autoStop: true, // 到达终点自动停止
    frameRate: 1,
    clockLoop: true, // 循环播放
    camera: {
      type: "gs",
      radius: 300
    },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50,
      clampToGround: true
    },
    circle: {
      radius: 10,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#ffff00",
        opacity: 0.3,
        speed: 10,
        count: 3,
        gradient: 0.1
      },
      clampToGround: true
    },
    polyline: {
      color: "#ffff00",
      width: 2
    }
  })
  graphicLayer.addGraphic(fixedRoute)

  // 显示popup
  fixedRoute.openPopup()

  // ui面板信息展示
  fixedRoute.on(mars3d.EventType.change, (event) => {
    // 取实时信息，可以通过  fixedRoute.info
    eventTarget.fire("roamLineChange", event)
  })

  fixedRoute.on(mars3d.EventType.endItem, function (event) {
    console.log("已漫游过点：" + event.index, event)
  })
  fixedRoute.on(mars3d.EventType.end, function (event) {
    console.log("漫游结束", event)
    eventTarget.fire("endRoam")
  })

  // 不贴地时，直接开始
  // fixedRoute.start()

  // 贴地时，异步计算完成后开始
  // fixedRoute.autoSurfaceHeight({ has3dtiles: true }).then(function () {//异步计算完成贴地后再启动
  //     //贴地后的路线值为flyLine.positions
  //    fixedRoute.start()
  // });
}

// ui层使用
export function formatDistance(val) {
  return mars3d.MeasureUtil.formatDistance(val, { getLangText })
}
export function formatTime(val) {
  return mars3d.Util.formatTime(val, { getLangText })
}

function getLangText(text) {
  return map.getLangText(text)
}

// 开始绘制
export async function startDrawGraphic() {
  graphicLayer.clear()

  fixedRoute = await graphicLayer.startDraw({
    type: "fixedRoute",
    showStop: true,
    position: {
      type: "time", // 时序动态坐标
      speed: 40,
      pauseTime: 0.5
    },
    camera: {
      type: "gs",
      radius: 300
    },
    model: {
      url: "https://data.mars3d.cn/gltf/mars/man/walk.gltf",
      scale: 5,
      minimumPixelSize: 50,
      clampToGround: true
    },
    polyline: {
      color: "#ffff00",
      width: 2
    }
  })

  console.log("标绘完成", fixedRoute.toJSON())
}

export async function clear() {
  graphicLayer.clear()
  fixedRoute = null
}

function bindPopup() {
  graphicLayer.bindPopup(
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
  graphicLayer.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // popup对应的DOM
    const graphic = event.graphic
    const params = graphic?.info
    if (!params) {
      return
    }

    const lblAllLen = container.querySelector("#lblAllLen")
    if (lblAllLen) {
      lblAllLen.innerHTML = formatDistance(params.distance_all)
    }

    const lblAllTime = container.querySelector("#lblAllTime")
    if (lblAllTime) {
      lblAllTime.innerHTML = formatTime(params.second_all / map.clock.multiplier)
    }

    const lblStartTime = container.querySelector("#lblStartTime")
    if (lblStartTime) {
      lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(graphic.startTime), "yyyy-M-d HH:mm:ss")
    }

    const lblRemainTime = container.querySelector("#lblRemainTime")
    if (lblRemainTime) {
      lblRemainTime.innerHTML = formatTime((params.second_all - params.second) / map.clock.multiplier)
    }

    const lblRemainLen = container.querySelector("#lblRemainLen")
    if (lblRemainLen) {
      lblRemainLen.innerHTML = formatDistance(params.distance_all - params.distance)
    }
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "复制",
      icon: "fa fa-copy",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          map.contextmenu.copyGraphic.layerId = graphicLayer.id
        }
      }
    },
    {
      text: "剪切",
      icon: "fa fa-scissors",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          map.contextmenu.copyGraphic.layerId = graphicLayer.id

          graphic.remove(true) // 移除原有对象
        }
      }
    },
    {
      text: "还原编辑(还原到初始)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRestore(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRestore()
        }

        const graphic = event.graphic
        if (hasRestore(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRestore(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.restore) {
          graphic.editing.restore() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.restore) {
          graphic.parent.editing.restore() // 右击是编辑点时
        }
      }
    },
    {
      text: "撤销编辑(还原到上一步)",
      icon: "fa fa-pencil",
      show: (event) => {
        function hasRevoke(graphic) {
          if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
            return false
          }
          return graphic.editing?.hasRevoke()
        }

        const graphic = event.graphic
        if (hasRevoke(graphic)) {
          return true
        }
        if (graphic.isPrivate && graphic.parent) {
          return hasRevoke(graphic.parent) // 右击是编辑点时
        }
        return false
      },
      callback: (event) => {
        const graphic = event.graphic
        if (graphic.editing?.revoke) {
          graphic.editing.revoke() // 撤销编辑，可直接调用
        } else if (graphic.parent?.editing?.revoke) {
          graphic.parent.editing.revoke() // 右击是编辑点时
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy || graphic.isPrivate || graphic.graphicIds) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "查看聚合列表",
      icon: "fa fa-info",
      show: (event) => {
        const graphic = event.graphic
        if (graphic.cluster && graphic.graphics) {
          return true
        } else {
          return false
        }
      },
      callback: (e) => {
        const graphics = e.graphic?.graphics
        if (graphics) {
          const names = []
          for (let index = 0; index < graphics.length; index++) {
            const g = graphics[index]
            names.push(g.attr.name || g.attr.text || g.id)
          }
          return globalAlert(`${names.join(",")}`, `共${graphics.length}个聚合对象`)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: (event) => {
        const graphic = event.graphic
        return !graphic.isPoint
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    }
  ])
}
