import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.516143, lng: 117.282937, alt: 46242, heading: 2, pitch: -49 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  const editUpdateFun = mars3d.Util.funDebounce(openGraphicOptionsWidget, 500)
  graphicLayer.on([mars3d.EventType.click, mars3d.EventType.drawCreated, mars3d.EventType.editStart, mars3d.EventType.editStyle], editUpdateFun)
  const removeFun = mars3d.Util.funDebounce(closeGraphicOptionsWidget, 500)
  graphicLayer.on(mars3d.EventType.removeGraphic, removeFun)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  if (graphicLayer) {
    graphicLayer.destroy() // 销毁内部会释放所有事件及数据
    graphicLayer = null
  }

  map = null
}

// 修改样式，修改点，删除点等操作去激活或更新面板
function openGraphicOptionsWidget(e) {
  eventTarget.fire("updateGraphicOptionsWidget", { graphicId: e.graphic.id, layerId: graphicLayer.id })
}

function closeGraphicOptionsWidget(e) {
  eventTarget.fire("updateGraphicOptionsWidget", { disable: true })
}

export async function startDrawModel(url, isProxy) {
  if (isProxy) {
    url = "//server.mars3d.cn/proxy/" + url
  }

  const graphic = await graphicLayer.startDraw({
    type: "model",
    drawShow: true, // 绘制时，是否显示模型，可避免在3dtiles上拾取坐标存在问题。
    style: {
      url,
      scale: 1
    }
  })
  console.log("标绘完成", graphic.toJSON())
}

// 地形
export function chkHasTerrain(isStkTerrain) {
  map.hasTerrain = isStkTerrain
}

// 深度检测
export function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
  if (val) {
    globalMsg("深度监测打开后，您将无法看到地下或被地形遮挡的对象。")
  }
}

export function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

/**
 *打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件名称
 * @returns {void} 无
 */
export function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    console.log("reader")
    console.log(reader)
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = this.result
      graphicLayer.loadGeoJSON(json, {
        flyTo: true
      })
    }
  } else if (fileType === "glb" || fileType === "gltf") {
    graphicLayer.clear()
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = function (e) {
      const arrayBuffer = this.result
      const graphic = new mars3d.graphic.ModelPrimitive({
        position: [117.221674, 31.823752, 34.7],
        style: {
          basePath: fileName,
          url: new Uint8Array(arrayBuffer),
          scale: 1,
          minimumPixelSize: 50
        },
        hasEdit: false
      })
      graphicLayer.addGraphic(graphic)

      graphic.flyTo({ radius: 1000 })
    }
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

export function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("我的标注.json", JSON.stringify(geojson))
}
