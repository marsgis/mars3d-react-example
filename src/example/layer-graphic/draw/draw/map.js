import * as mars3d from "mars3d"
// import kgUtil from "kml-geojson"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const mapOptions = {
  // scene: {
  //   center: { lat: 30.846849, lng: 116.335307, alt: 739, heading: 360, pitch: -45 }
  // },
  control: {
    infoBox: false
  },
  layers: [
    {
      name: "合肥市",
      type: "geojson",
      url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
      symbol: {
        styleOptions: {
          fill: true,
          randomColor: true, // 随机色
          opacity: 0.3,
          outline: true,
          outlineStyle: {
            color: "#FED976",
            width: 3,
            opacity: 1
          },
          highlight: {
            opacity: 0.9
          }
        }
      },
      popup: "{name}",
      show: true
    }
  ]
}

export const eventTarget = new mars3d.BaseClass()

let keyDownCode // 一直按着的键对应的code

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 设置编辑点样式
  // mars3d.DrawUtil.setEditPointStyle(mars3d.EditPointType.Control, {
  //   type: mars3d.GraphicType.billboardP, // 支持设置type指定编辑点类型
  //   image: "//data.mars3d.cn/img/marker/move.png",
  //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //   verticalOrigin: Cesium.VerticalOrigin.CENTER
  // })

  graphicLayer = new mars3d.layer.GraphicLayer({
    // isRestorePositions: true,
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
    // drawAddEventType: false,
    // drawEndEventType: mars3d.EventType.rightClick,
    // drawDelEventType: mars3d.EventType.middleClick
  })
  map.addLayer(graphicLayer)

  // 修改文本
  // map.setLangText({
  //   _双击完成绘制: "右击完成绘制",
  //   _右击删除点: "中键单击完成绘制"
  // })

  // map.on(mars3d.EventType.mouseOver, function (event) {
  //   console.log("mouseover")
  // })
  map.on(mars3d.EventType.mouseOut, function (event) {
    map.closeSmallTooltip()
  })

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 绑定layer标绘相关事件监听(可以自行加相关代码实现业务需求，此处主要做示例)
  graphicLayer.on(mars3d.EventType.drawStart, function (e) {
    console.log("开始绘制", e)
  })
  graphicLayer.on(mars3d.EventType.drawAddPoint, function (e) {
    console.log("绘制过程中增加了点", e)
  })
  graphicLayer.on(mars3d.EventType.drawRemovePoint, function (e) {
    console.log("绘制过程中删除了点", e)
  })
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    console.log("创建完成", e)

    // graphicLayer.stopDraw()
    // graphicLayer.startDraw(mars3d.Util.clone(e.graphic.options)) // 连续标绘时，可以代替isContinued
  })

  graphicLayer.on(mars3d.EventType.editStart, function (e) {
    console.log("开始编辑", e)
  })
  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    console.log("编辑修改了点", e)
  })
  graphicLayer.on(mars3d.EventType.editAddPoint, function (e) {
    console.log("编辑新增了点", e)
  })
  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    console.log("编辑删除了点", e)
  })
  graphicLayer.on(mars3d.EventType.editStop, function (e) {
    console.log("停止编辑", e)
  })
  graphicLayer.on(mars3d.EventType.removeGraphic, function (e) {
    console.log("删除了对象", e)
  })

  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  loadDemoData()

  // map.on(mars3d.EventType.keyup, function (e) {
  //   console.log("按下了键盘", e)

  //   // ESC按键
  //   if (e.keyCode === 27) {
  //     graphicLayer._graphic_drawing._positions_draw.pop() // 删除最后一个点
  //   }
  // })

  // 按键按下
  map.on(mars3d.EventType.keydown, function (e) {
    keyDownCode = e.keyCode // 一直按着的键对应的code
  })

  // 按键按下后释放
  map.on(mars3d.EventType.keyup, function (e) {
    keyDownCode = undefined
  })

  // 自定义提示
  // map.setLangText({
  //   _双击完成绘制: "",
  //   _单击开始绘制: "新的提示内容",
  //   _单击增加点右击删除点: "新的提示内容"
  // })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

let isEntityPrimitive = true

export function changeDrawEntity(value) {
  isEntityPrimitive = value
}

export async function drawPoint() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "point" : "pointP",
    style: {
      pixelSize: 12,
      color: "#3388ff",
      label: {
        // 不需要文字时，去掉label配置即可
        text: "可以同时支持文字",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawMarker() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "billboard" : "billboardP",
    style: {
      image: "//data.mars3d.cn/img/marker/mark-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        // 不需要文字时，去掉label配置即可
        text: "可以同时支持文字",
        font_size: 26,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -60
      }
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawLabel() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "label" : "labelP",
    style: {
      text: "火星科技三维地球",
      color: "#0081c2",
      font_size: 50,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function startDrawModel() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "model" : "modelP",
    style: {
      scale: 10,
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche.gltf"
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawPolyline(clampToGround) {
  // map.highlightEnabled = false
  // map.popup.enabled = false

  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "polyline" : "polylineP",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    },
    // 绘制时，外部自定义更新坐标,可以自定义处理特殊业务返回修改后的新坐标。
    updateDrawPosition: function (position, graphic) {
      if (keyDownCode === 67) {
        // 按下C键 ,限定在纬度线上
        position = updateDrawPosition(position, graphic.lastDrawPoint, 1)
      } else if (keyDownCode === 86) {
        // 按下V键 ,限定在经度线上
        position = updateDrawPosition(position, graphic.lastDrawPoint, 2)
      }
      return position
    }
    // 外部自定义校验坐标，return false 时坐标无效，不参与绘制
    // validDrawPosition: function (position, graphic) {
    //   const point = mars3d.LngLatPoint.fromCartesian(position)
    //   return (point.lng > 115 && point.lng < 117)
    // }
  })
  console.log("完成了draw标绘", graphic)

  // map.highlightEnabled = true
  // map.popup.enabled = true
}

function updateDrawPosition(thisPoint, lastPoint, type) {
  if (!lastPoint || !thisPoint) {
    return thisPoint
  }
  thisPoint = mars3d.LngLatPoint.fromCartesian(thisPoint)
  lastPoint = mars3d.LngLatPoint.fromCartesian(lastPoint)

  if (type === 1) {
    thisPoint.lat = lastPoint.lat
  } else {
    thisPoint.lng = lastPoint.lng
  }
  return thisPoint.toCartesian()
}

export async function drawBrushLine(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: "brushLine",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawPolygon(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "polygon" : "polygonP",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawCurve(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: "curve",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawCorridor(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "corridor" : "corridorP",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      width: 500,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawEllipse(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "circle" : "circleP",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawRectangle(clampToGround) {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "rectangle" : "rectangleP",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function draPlane() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "plane" : "planeP",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      plane_normal: "x",
      dimensions_x: 1000.0,
      dimensions_y: 1000.0
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function draWall(closure) {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "wall" : "wallP",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      diffHeight: 400,
      closure // 是否闭合
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawBox() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "box" : "boxP",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      dimensions_x: 1000.0,
      dimensions_y: 1000.0,
      dimensions_z: 1000.0
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawCylinder() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "cylinder" : "cylinderP",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6,
      length: 1000
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawEllipsoid() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "ellipsoid" : "ellipsoidP",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawExtrudedPolygon() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "polygon" : "polygonP",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawExtrudedRectangle() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "rectangle" : "rectangleP",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawExtrudedCircle() {
  const graphic = await graphicLayer.startDraw({
    type: isEntityPrimitive ? "circle" : "circleP",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
  console.log("完成了draw标绘", graphic)
}

export async function drawSatellite() {
  const graphic = await graphicLayer.startDraw({
    type: "satellite",
    style: {
      tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
      tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
      path_show: true,
      path_color: "#00ff00",
      path_width: 1,
      model_show: true,
      model_url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      model_scale: 1,
      model_minimumPixelSize: 90
    }
  })
  console.log("完成了draw标绘", graphic)

  setTimeout(() => {
    graphic.flyToPoint()
  }, 100)
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
      text: "启用按轴平移",
      icon: "fa fa-pencil",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || !graphic.hasEdit || !graphic.isEditing) {
          // || !graphic.isPoint
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
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}

export function updateOnlyVertexPosition(value) {
  map.onlyVertexPosition = value
}

/**
 * 打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件
 * @returns {void} 无
 */
export function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const geojson = JSON.parse(this.result)
      console.log("打开了json文件", geojson)
      graphicLayer.loadJSON(geojson, { flyTo: true, clear: true })
    }
  } else if (fileType === "kml") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const strkml = this.result
      kgUtil.toGeoJSON(strkml).then((geojson) => {
        console.log("kml2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, { flyTo: true })
      })
    }
  } else if (fileType === "kmz") {
    // 加载input文件控件的二进制流
    kgUtil.toGeoJSON(file).then((geojson) => {
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, { flyTo: true })
    })
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

// 点击保存JSON
export function saveJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toJSON()
  mars3d.Util.downloadFile("我的标注.json", JSON.stringify(geojson))
}

// 点击保存GeoJSON
export function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("我的标注geojson.json", JSON.stringify(geojson))
}

// 点击保存KML
export function saveKML() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }

  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const kml = kgUtil.toKml(geojsonObject, {
    name: "Mars3D标绘数据",
    documentName: "Mars3D标绘数据文件",
    documentDescription: "标绘数据 by mars3d.cn",
    simplestyle: true
  })

  mars3d.Util.downloadFile("我的标注.kml", kml)
}

// 点击保存WKT
export function saveWKT() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }
  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const arrWKT = []
  let index = 0
  geojsonObject.features.forEach((feature) => {
    const attr = feature.properties
    const style = feature.properties.style

    const wkt = Terraformer.WKT.convert(feature.geometry) // geojson转换WKT格式 ,terraformer库
    arrWKT.push({
      id: ++index,
      name: attr.name || "",
      remark: attr.remark || "",
      style,
      wkt
    })
  })
  mars3d.Util.downloadFile("我的标注wkt.txt", JSON.stringify(arrWKT))
}

// 加载演示数据
function loadDemoData() {
  // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  //   // 本地不显示历史数据
  //   return
  // }

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/mars3d-draw.json" }).then(function (json) {
    const graphics = graphicLayer.loadGeoJSON(json, { clear: true, flyTo: true, toPrimitive: true })
    console.log("加载演示数据", graphics)
  })
}
