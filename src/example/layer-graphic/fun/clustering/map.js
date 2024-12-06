import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 24.688611, lng: 119.260277, alt: 1673759, heading: 348, pitch: -69 }
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

  // addGraphicLayer()
  addBusinessLayer()
}

// async function addGraphicLayer() {
//   graphicLayer = new mars3d.layer.GraphicLayer({
//     cluster: {
//       enabled: true,
//       pixelRange: 20,
//       clampToGround: false,
//       addHeight: 1000
//     },
//     popup: "all",
//     center: { lat: 31.639275, lng: 117.388877, alt: 52574.8, heading: 339.3, pitch: -65 },
//     flyTo: true
//   })
//   map.addLayer(graphicLayer)

//   // 单击事件
//   graphicLayer.on(mars3d.EventType.click, function (event) {
//     console.log("你单击了", event)
//   })

//   const res = await mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/hfty-point.json" })
//   for (let i = 0; i < res.features.length; i++) {
//     const item = res.features[i]
//     const label = new mars3d.graphic.LabelPrimitive({
//       position: item.geometry.coordinates,
//       style: {
//         show: true,
//         text: "测试",
//         font_size: 14,
//         fill: true,
//         color: "#fcfa36",
//         font_family: "楷体",
//         font_weight: "bold",
//         outline: true,
//         outlineColor: "rgba(0,0,0,0.8)",
//         outlineWidth: 3,
//         background: true,
//         backgroundColor: "#009476",
//         visibleDepth: false
//       }
//     })
//     graphicLayer.addGraphic(label)
//   }
// }

function addBusinessLayer() {
  const singleDigitPins = {}

  // 创建矢量数据图层（业务数据图层）
  graphicLayer = new mars3d.layer.BusineDataLayer({
    url: "//data.mars3d.cn/file/apidemo/mudi.json",
    dataColumn: "data", // 数据接口中对应列表所在的取值字段名
    lngColumn: "lng",
    latColumn: "lat",
    altColumn: "z",
    // 点的聚合配置
    cluster: {
      enabled: true,
      pixelRange: 20,
      image: async function (count, result) {
        const key = "type1-" + count // 唯一标识，不同图层需要设置不一样

        let image = singleDigitPins[key]
        if (image) {
          return image // 当前页面变量有记录
        }

        image = await localforage.getItem(key)
        if (image) {
          singleDigitPins[key] = image
          return image // 浏览器客户端缓存有记录
        }

        image = await getClusterImage(count) // 生成图片
        singleDigitPins[key] = image // 记录到当前页面变量，未刷新页面时可直接使用
        localforage.setItem(key, image) // 记录到浏览器客户端缓存，刷新页面后也可以继续复用

        return image
      }
    },
    symbol: {
      type: "billboardP",
      styleOptions: {
        image: "//data.mars3d.cn/img/marker/mark-blue.png",
        width: 25,
        height: 34, // billboard聚合必须有width、height
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1000, 0.7, 5000000, 0.3),
        label: {
          text: "{text}",
          font_size: 19,
          color: Cesium.Color.AZURE,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(10, 0), // 偏移量
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 80000)
        }
      }
    }
    // 自定义创建对象，可替代symbol、
    // onCreateGraphic: function (e) {
    //   const graphic = new mars3d.graphic.BillboardEntity({
    //     position: e.position,
    //     style: {
    //       image: "//data.mars3d.cn/img/marker/lace-blue.png",
    //       width: 25,
    //       height: 34, // 聚合必须有width、height
    //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //     },
    //     attr: e.attr
    //   })
    //   graphicLayer.addGraphic(graphic)
    // },
  })
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.clusterStop, function (event) {
    console.log("聚合发生了变化，并渲染完成", event)
  })

  // 单击事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("你单击了", event)

    if (map.camera.positionCartographic.height > 90000) {
      const graphic = event.graphic
      // graphic.closePopup()
      if (graphic?.graphicIds) {
        // 单击了聚合的点
        console.log("单击了聚合的点", graphic.getGraphics())
      } else {
        // 单击了具体的点对象
        const position = graphic.positionShow
        map.flyToPoint(position, {
          radius: 5000, // 距离目标点的距离
          duration: 4,
          complete: function (e) {
            // 飞行完成回调方法
            // graphic.openPopup()
          }
        })
      }
    }
  })

  graphicLayer.bindPopup(function (event) {
    if (event.graphic?.graphicIds) {
      const graphics = event.graphic.getGraphics() // 对应的grpahic数组，可以自定义显示
      if (graphics) {
        const names = []
        for (let index = 0; index < graphics.length; index++) {
          names.push(graphics[index].attr.text)
        }
        const inthtml = `单击了聚合点(${graphics.length}个):<br/>${names.join(",")}`
        return inthtml
      }
    }

    const item = event.graphic?.attr
    if (!item) {
      return false
    }
    const inthtml = `<table style="width: auto;">
                  <tr>
                    <th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.text} </th>
                  </tr>
                  <tr>
                    <td>省：</td><td>${item.province}</td>
                  </tr>
                  <tr>
                    <td>市：</td> <td>${item.city}</td>
                  </tr>
                  <tr>
                    <td>县/区：</td> <td>${item.district}</td>
                  </tr>
                  <tr>
                    <td>地址：</td> <td>${item.address}</td>
                  </tr>
                  <tr>
                    <td>视频：</td> <td><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 300px;" ></video></td>
                  </tr>
                </table>`
    return inthtml
  })
}

// 生成聚合图标，支持异步
async function getClusterImage(count) {
  let colorIn
  if (count < 10) {
    colorIn = "rgba(110, 204, 57, 0.6)"
  } else if (count < 100) {
    colorIn = "rgba(240, 194, 12,  0.6)"
  } else {
    colorIn = "rgba(241, 128, 23,  0.6)"
  }

  const radius = 40
  const thisSize = radius * 2

  const circleCanvas = document.createElement("canvas")
  circleCanvas.width = thisSize
  circleCanvas.height = thisSize
  const circleCtx = circleCanvas.getContext("2d", { willReadFrequently: true })

  circleCtx.fillStyle = "#ffffff00"
  circleCtx.globalAlpha = 0.0
  circleCtx.fillRect(0, 0, thisSize, thisSize)

  // 圆形底色
  circleCtx.globalAlpha = 1.0
  circleCtx.beginPath()
  circleCtx.arc(radius, radius, radius, 0, Math.PI * 2, true)
  circleCtx.closePath()
  circleCtx.fillStyle = colorIn
  circleCtx.fill()

  // 数字文字
  const text = count + "个"
  circleCtx.font = radius * 0.6 + "px bold normal" // 设置字体
  circleCtx.fillStyle = "#ffffff" // 设置颜色
  circleCtx.textAlign = "center" // 设置水平对齐方式
  circleCtx.textBaseline = "middle" // 设置垂直对齐方式
  circleCtx.fillText(text, radius, radius) // 绘制文字（参数：要写的字，x坐标，y坐标）

  return circleCanvas.toDataURL("image/png") // getImage方法返回任意canvas的图片即可
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  graphicLayer.remove()
  graphicLayer = null

  map = null
}

// 计算贴地高度示例代码，可以将获取到的高度更新到数据库内，后续不用重复计算。
export function getDataSurfaceHeight() {
  if (graphicLayer.length === 0) {
    globalMsg("数据尚未加载成功！")
    return
  }
  showLoading()

  // 对图层内的数据做贴地运算,自动得到贴地高度
  graphicLayer.autoSurfaceHeight({ exact: true }).then((graphics) => {
    hideLoading()

    const arr = []
    for (let i = 0, len = graphics.length; i < len; i++) {
      const graphic = graphics[i]
      const point = graphic.point
      arr.push({
        ...graphic.attr,
        lat: point.lat,
        lng: point.lng,
        z: point.alt
      })
    }
    mars3d.Util.downloadFile("point.json", JSON.stringify({ data: arr }))
  })
}

export function enabledAggressive(val) {
  graphicLayer.clusterEnabled = val
}

export function layerShowChange(val) {
  graphicLayer.show = val
}
