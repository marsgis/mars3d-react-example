import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

const storageName = "layer-tileset-manager-oneself"

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  map.onlyPickModelPosition = true
  map.basemap.show = false
  map.hasTerrain = false

  map.setSceneOptions({
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "#00FFC4",
    globe: {
      baseColor: "#00FFC4",
      showGroundAtmosphere: false,
      depthTestAgainstTerrain: false
    }
  })
  startDrawGraphic()
  bindLayerContextMenu()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function changeColor(color) {
  const clr = Cesium.Color.fromCssColorString(color)
  map.scene.backgroundColor = clr // 空间背景色
  map.scene.globe.baseColor = clr // 地表背景色

  document.body.style.backgroundColor = color
}

function removeLayer() {
  if (tiles3dLayer) {
    map.removeLayer(tiles3dLayer, true)
    tiles3dLayer = null
  }
}

// 当前页面业务相关
export function showModel(url) {
  removeLayer()
  if (!url) {
    return
  }

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: url,
    maximumScreenSpaceError: 1,
    backFaceCulling: false, // 禁用背面剔除
    flyTo: true
  })
  map.addLayer(tiles3dLayer)

  // 单击事件
  tiles3dLayer.on(mars3d.EventType.load, function (event) {
    console.log("模型加载完成", event)
    localforage.setItem(storageName, url) // 记录历史值

    // 限定缩放级别
    map.scene.screenSpaceCameraController.maximumZoomDistance = tiles3dLayer.boundingSphere.radius * 5

    // 模型不可以拖拽移动位置，可放大缩小，旋转
    // const center = tiles3dLayer.center.toCartesian()
    // const offset = new Cesium.HeadingPitchRange(0, 0, tiles3dLayer.boundingSphere.radius)
    // map.camera.lookAt(center, offset)

    // 自动贴地处理
    tiles3dLayer.clampToGround(10)
  })
}

export function flyTo() {
  tiles3dLayer.flyTo()
}

// 开始绘制
export async function startDrawGraphic() {
  const graphic = await graphicLayer.startDraw({
    type: "box",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      dimensions_x: 30.0,
      dimensions_y: 30.0,
      dimensions_z: 30.0
    }
  })
  console.log("标绘完成", graphic.toJSON())
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
      text: "启用按轴平移",
      icon: "fa fa-pencil",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return !graphic.editing?.hasMoveMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.startMoveMatrix(event.graphic, event)
      }
    },
    {
      text: "停止按轴平移",
      icon: "fa fa-pencil",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return graphic.editing?.hasMoveMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.stopMoveMatrix()
      }
    },
    {
      text: "启用按轴旋转",
      icon: "fa fa-bullseye",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        if (
          !(
            graphic.type === "model" ||
            graphic.type === "modelP" ||
            graphic.type === "box" ||
            graphic.type === "boxP" ||
            graphic.type === "cylinder" ||
            graphic.type === "cylinderP" ||
            graphic.type === "plane"
          )
        ) {
          return false
        }
        return !graphic.editing?.hasRotateMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.startRotateMatrix(event.graphic, event)
      }
    },
    {
      text: "停止按轴旋转",
      icon: "fa fa-bullseye",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          return false
        }
        return graphic.editing?.hasRotateMatrix
      },
      callback: (event) => {
        const graphic = event.graphic
        graphic.editing.stopRotateMatrix()
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
    }
  ])
}
