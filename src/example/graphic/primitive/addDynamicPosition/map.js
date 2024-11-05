import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 31.754913, lng: 117.248572, alt: 6220, heading: 357, pitch: -31 }
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

  map.basemap = 2017 // 蓝色底图

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphics()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphics() {
  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.ModelPrimitive({
      // forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
      style: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        scale: 0.5,
        minimumPixelSize: 20,

        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          silhouette: true,
          silhouetteColor: "#ff0000",
          silhouetteSize: 4
        },

        label: {
          // 不需要文字时，去掉label配置即可
          text: "皖A000" + i,
          font_size: 16,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -20,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 50000,
          distanceDisplayCondition_near: 0
        }
      },
      attr: { index: i, name: "ModelPrimitive" }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.BillboardPrimitive({
      style: {
        image: "//data.mars3d.cn/img/marker/mark-blue.png",
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
      },
      attr: { index: i, name: "BillboardPrimitive" }
    })
    graphicLayer.addGraphic(graphic)
  }

  for (let i = 0; i < 10; i++) {
    const graphic = new mars3d.graphic.PointPrimitive({
      style: {
        color: "#00ffff",
        pixelSize: 6,
        outlineColor: "#ffffff",
        outlineWidth: 2
      },
      attr: { index: i, name: "PointPrimitive" }
    })
    graphicLayer.addGraphic(graphic)
  }

  // 设置动态位置
  changePosition(0)

  // 定时更新动态位置（setInterval为演示）
  const interval = 30
  changePosition(interval)
  setInterval(() => {
    changePosition(interval)
  }, interval * 1000)
}

// 改变位置
function changePosition(time) {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }
    graphic.addDynamicPosition(randomPoint(), time) // 按time秒运动至指定位置
  })
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(117.207666 * 1000, 117.287241 * 1000) / 1000
  const wd = random(31.817099 * 1000, 31.876848 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 30)
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
  let trackedGraphic
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
    },
    {
      text: "跟踪锁定",
      icon: "fa fa-lock",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }

        if (graphic.entity instanceof Cesium.Entity) {
          return true
        } else if (graphic.trackedEntity instanceof Cesium.Entity) {
          return true
        }

        return false
      },
      callback: function (e) {
        const graphic = e.graphic
        map.trackedEntity = graphic
        trackedGraphic = graphic
        if (map.scene.mode === Cesium.SceneMode.SCENE2D) {
          setTimeout(() => {
            map.flyToPoint(graphic.positionShow, {
              radius: 1000,
              lock: true,
              duration: 0
            })
          }, 10)
        }
      }
    },
    {
      text: "取消锁定",
      icon: "fa fa-unlock-alt",
      show: function (e) {
        return e.graphic === trackedGraphic && map.trackedEntity !== undefined
      },
      callback: function (e) {
        map.trackedEntity = undefined
        trackedGraphic = undefined
      }
    }
  ])
}
