/**
 * 高德POI 查询栏 （左上角）
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-01-10
 */
import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

let map: mars3d.Map // 地图对象
let graphicLayer: mars3d.layer.GraphicLayer
let queryPoi: mars3d.query.GaodePOI // GaodePOI查询
let address: any = null

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map

  queryPoi = new mars3d.query.GaodePOI({
    // city: '合肥市',
  })

  graphicLayer = new mars3d.layer.GraphicLayer({
    name: "PIO查询",
    pid: 99 // 图层管理 中使用，父节点id
  })

  graphicLayer.bindPopup(function (event: any) {
    const item = event.graphic?.attr
    if (!item) {
      return
    }
    let inHtml = `<div class="mars3d-template-titile"><a href="https://www.amap.com/detail/${item.id}"  target="_black" style="color: #ffffff; ">${item.name}</a></div><div class="mars3d-template-content" >`

    if (item.tel && item.tel.length) {
      inHtml += "<div><label>电话:</label>" + item.tel + "</div>"
    }

    if (item.address) {
      inHtml += "<div><label>地址:</label>" + item.address + "</div>"
    }
    if (item.type && item.type !== "") {
      inHtml += "<div><label>类别:</label>" + item.type + "</div>"
    }
    inHtml += "</div>"
    return inHtml
  })

  map.addLayer(graphicLayer)

  map.on(mars3d.EventType.cameraChanged, cameraChanged)
}

// 地图绑定事件 视角移动
function cameraChanged() {
  queryPoi.getAddress({
    location: map.getCenter(),
    success: (result: any) => {
      address = result
    }
  })
}

// 释放当前业务
export function onUnmounted(): void {
  map.off(mars3d.EventType.cameraChanged, cameraChanged)
  map.removeLayer(graphicLayer)

  graphicLayer = null
  queryPoi = null
  address = null
  map = null
}

// 输入的字段进行提示信息搜索
export function queryData(val: string): any {
  return queryPoi
    .autoTip({
      text: val,
      city: address?.city,
      location: map.getCenter()
    })
    .then((result: any) => {
      return result.list
    })
}

/**
 * 根据传入的字段进行关键字搜索
 *
 * @export
 * @param {string} text 根据传入的字段进行 关键字搜索
 * @param {number} [page=1] 分页操作，可以点击下一页进行查询，从0开始
 * @return {*}  {*} 返回查询到的结果列表
 */
export function queryTextData(text: string, page: number): any {
  return queryPoi
    .queryText({
      text,
      count: 6,
      page: page - 1,
      city: address?.city
    })
    .then((result: any) => {
      return result
    })
}

export function addQueryGraphic(data: any) {
  clearLayers()

  data.forEach((item: any) => {
    const jd = Number(item.lng)
    const wd = Number(item.lat)
    if (isNaN(jd) || isNaN(wd)) {
      return
    }
    // 添加实体
    const graphic = new mars3d.graphic.PointEntity({
      position: Cesium.Cartesian3.fromDegrees(jd, wd),
      style: {
        pixelSize: 10,
        color: "#3388ff",
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
        clampToGround: true, // 贴地
        visibleDepth: false, // 是否被遮挡
        label: {
          text: item.name,
          font_size: 20,
          color: "rgb(240,255,255)",
          outline: true,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffsetY: -10, // 偏移量
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
          clampToGround: true, // 贴地
          visibleDepth: false // 是否被遮挡
        }
      },
      attr: { lng: jd, lat: wd, ...item }
    })
    graphicLayer.addGraphic(graphic)

    item._graphic = graphic
  })

  if (data.length) {
    graphicLayer.flyTo({ radius: 1000 })
  }
}

/**
 * 判断是否为经纬度值，
 * 若是，加载为矢量数据且定位至该矢量数据
 * 若否，返回
 * @param {string} text 输入框输入的关键字
 * @returns {void} 无
 */
export function centerAtLonLat(text: string): void {
  const arr = text.split(",")
  if (arr.length !== 2) {
    return
  }

  const jd = Number(arr[0])
  const wd = Number(arr[1])
  if (isNaN(jd) || isNaN(wd)) {
    return
  }

  // 添加实体
  const graphic = new mars3d.graphic.PointEntity({
    position: Cesium.Cartesian3.fromDegrees(jd, wd),
    style: {
      color: "#3388ff",
      pixelSize: 10,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
      clampToGround: true, // 贴地
      visibleDepth: false // 是否被遮挡
    }
  })
  graphicLayer.addGraphic(graphic)

  graphic.bindPopup(`<div class="mars3d-template-titile">坐标定位</div>
              <div class="mars3d-template-content" >
                <div><label>经度</label> ${jd}</div>
                <div><label>纬度</label>${wd}</div>
              </div>`)

  graphic.openHighlight()

  graphic.flyTo({
    radius: 1000, // 点数据：radius控制视距距离
    scale: 1.5, // 线面数据：scale控制边界的放大比例
    complete: () => {
      graphic.openPopup()
    }
  })
}

export function clearLayers() {
  graphicLayer.closePopup()
  graphicLayer.clear()
}

export function flyToGraphic(graphic: mars3d.graphic.PointEntity) {
  map.flyToGraphic(graphic, { radius: 500, complete: () => graphicLayer.openPopup(graphic) })
}
