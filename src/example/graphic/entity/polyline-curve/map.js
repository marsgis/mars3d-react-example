import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.565291, lng: 117.294375, alt: 28796, heading: 2, pitch: -49 }
  }
}

export const eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

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
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.220337, 31.832987, 42.8],
      [117.223096, 31.818342, 29.8],
      [117.249686, 31.818964, 40.1],
      [117.286308, 31.804112, 29.2],
      [117.28621, 31.801059, 24.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 演示个性化处理graphic
  initGraphicManager(graphic)
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  // graphic.on(mars3d.EventType.click, function (event) {
  //   console.log("监听graphic，单击了矢量对象", event)
  // })
  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "开始编辑对象[graphic绑定的]",
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
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}

// 有衬色边线,附带的label演示，导出geojson，加载geojson
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.172852, 31.862736, 33.69],
      [117.211204, 31.876064, 31.9],
      [117.251461, 31.856011, 26.44]
    ],
    style: {
      width: 6,
      sharpness: 0.95, // 曲线的弯曲程度
      materialType: mars3d.MaterialType.PolylineOutline,
      materialOptions: {
        color: Cesium.Color.ORANGE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK
      },
      label: {
        text: "我是原始线",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.positions = [
    [117.172852, 31.872736, 33.69],
    [117.21087, 31.891337, 28.7],
    [117.251461, 31.866011, 26.44]
  ]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.169646, 31.769171],
      [117.164564, 31.789748],
      [117.194579, 31.806466]
    ],
    style: {
      width: 5,
      color: Cesium.Color.CYAN,

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        color: "#ff0000"
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 虚线
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.348938, 31.805369, 7.63],
      [117.391807, 31.836325, 10],
      [117.429496, 31.786715, 8.41]
    ],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.CYAN,
        dashLength: 8.0
      }
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 虚线 ，双色间隔
function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.313682, 31.7416, 10.85],
      [117.287836, 31.760026, 17],
      [117.312816, 31.780792, 10.6],
      [117.305473, 31.800304, 23.86]
    ],
    style: {
      width: 5,
      materialType: mars3d.MaterialType.PolylineDash,
      materialOptions: {
        color: Cesium.Color.BLUE,
        gapColor: Cesium.Color.YELLOW,
        dashPattern: parseInt("1111000000", 2)
      }
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 自定义材质：箭头材质(从cesium代码拷贝出来的，方便自定义修改)
function addDemoGraphic6(graphicLayer) {
  // ==================== 自定义材质 开始 ====================
  // 自定义材质的命名
  const PolylineArrow2Type = "PolylineArrow2"

  // 注册至材质，用于Primitive
  mars3d.MaterialUtil.register(PolylineArrow2Type, {
    fabric: {
      uniforms: {
        color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
      },
      source: `
        uniform vec4 color;

        float getPointOnLine(vec2 p0, vec2 p1, float x)
        {
            float slope = (p0.y - p1.y) / (p0.x - p1.x);
            return slope * (x - p0.x) + p0.y;
        }

        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);

            vec2 st = materialInput.st;

        #if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))
            float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;
        #else
            // If no derivatives available (IE 10?), 2.5% of the line will be the arrow head
            float base = 0.975;
        #endif

            vec2 center = vec2(1.0, 0.5);
            float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);
            float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);

            float halfWidth = 0.15;
            float s = step(0.5 - halfWidth, st.t);
            s *= 1.0 - step(0.5 + halfWidth, st.t);
            s *= 1.0 - step(base, st.s);

            float t = step(base, materialInput.st.s);
            t *= 1.0 - step(ptOnUpperLine, st.t);
            t *= step(ptOnLowerLine, st.t);

            // Find the distance from the closest separator (region between two colors)
            float dist;
            if (st.s < base)
            {
                float d1 = abs(st.t - (0.5 - halfWidth));
                float d2 = abs(st.t - (0.5 + halfWidth));
                dist = min(d1, d2);
            }
            else
            {
                float d1 = czm_infinity;
                if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)
                {
                    d1 = abs(st.s - base);
                }
                float d2 = abs(st.t - ptOnUpperLine);
                float d3 = abs(st.t - ptOnLowerLine);
                dist = min(min(d1, d2), d3);
            }

            vec4 outsideColor = vec4(0.0);
            vec4 currentColor = mix(outsideColor, color, clamp(s + t, 0.0, 1.0));
            vec4 outColor = czm_antialias(outsideColor, color, currentColor, dist);

            outColor = czm_gammaCorrect(outColor);
            material.diffuse = outColor.rgb;
            material.alpha = outColor.a;
            return material;
        }`
    },
    translucent: true
  })

  // 自定义属性材质，用于Entity对象
  class PolylineArrow2MaterialProperty extends mars3d.material.BaseMaterialProperty {
    // 材质名称
    getType(time) {
      return PolylineArrow2Type
    }

    // 更新属性
    getValue(time, result) {
      if (!Cesium.defined(result)) {
        result = {}
      }

      result.color = this.options.color ?? Cesium.Color.WHITE
      return result
    }
  }
  mars3d.MaterialUtil.registerPropertyClass(PolylineArrow2Type, PolylineArrow2MaterialProperty)
  // ==================== 自定义材质 结束====================

  const graphic = new mars3d.graphic.CurveEntity({
    positions: [
      [117.187515, 31.717175, 11],
      [117.199151, 31.746157, 19.4],
      [117.217799, 31.770198, 23.8],
      [117.257876, 31.748218, 19]
    ],
    style: {
      width: 10,
      materialType: PolylineArrow2Type,
      materialOptions: {
        color: Cesium.Color.BLUE
      }
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const pt1 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 225, result.radius)
    const pt2 = mars3d.PointUtil.getPositionByDirectionAndLen(position, 315, result.radius)

    const graphic = new mars3d.graphic.CurveEntity({
      positions: [pt1, position, pt2],
      style: {
        width: 3.0,
        color: Cesium.Color.fromRandom({ alpha: 1.0 })
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "curve",
    style: {
      color: "#55ff33",
      width: 3
    }
  })
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
