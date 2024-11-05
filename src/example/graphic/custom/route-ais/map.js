import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 32.576038, lng: 118.586631, alt: 2296055.4, heading: 357.1, pitch: -88.5 }
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

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    cluster: {
      enabled: true, // 点的聚合配置
      pixelRange: 20
    }
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/ais.json" }).then(function (json) {
    const arr = []
    for (let i = 0; i < json.points.length; i++) {
      const item = json.points[i]
      if (item.lon < 90 || item.lon > 160 || item.lat < 0 || item.lat > 50) {
        continue
      }
      arr.push(item)
    }
    console.log("加载AIS数据", arr)

    addDemoGraphics(arr)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphics(points) {
  for (let i = 0; i < points.length; i++) {
    const item = points[i]
    const graphic = new mars3d.graphic.Route({
      point: {
        color: "#ff0000",
        pixelSize: 5,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: Number.MAX_VALUE,
        distanceDisplayCondition_near: 100000
      },
      model: {
        url: "//data.mars3d.cn/gltf/mars/ship/ship09.glb",
        minimumPixelSize: 40,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 100000
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    const point = new mars3d.LngLatPoint(item.lon, item.lat)
    graphic.addDynamicPosition(point, 0)
  }

  // 定时更新动态位置（setInterval为演示）
  const interval = 3
  changePosition(interval)
  setInterval(() => {
    changePosition(interval)
  }, interval * 1000)
}

let offset = 0
// 改变位置
function changePosition(time) {
  offset += 0.02

  graphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }

    const item = graphic.attr
    const point = new mars3d.LngLatPoint(item.lon + offset, item.lat + offset)
    graphic.addDynamicPosition(point, time)
  })

  graphicLayer._refreshCluster()// 刷新聚合
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
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
        if (graphic.graphicIds) {
          return true
        } else {
          return false
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const graphics = graphic.getGraphics() // 对应的grpahic数组，可以自定义显示
        if (graphics) {
          const names = []
          for (let index = 0; index < graphics.length; index++) {
            const g = graphics[index]
            names.push(g.attr.name || g.attr.text || g.id)
          }
          return globalAlert(`${names.join(",")}`, `共${graphics.length}个聚合对象`)
        }
      }
    }
  ])
}

export function clearGraphic() {
  graphicLayer.clear(true)
}
