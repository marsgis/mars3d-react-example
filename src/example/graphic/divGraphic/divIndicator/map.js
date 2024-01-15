import * as mars3d from "mars3d"
import { DivIndicator } from "./DivIndicator"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建DIV数据图层
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 该方法演示 自定义拖拽div（定义在 DivIndicator.js 中） ，可以参考自行扩展算法
function addDemoGraphic1(graphicLayer) {
  const divIndicator = new DivIndicator({
    position: [116.115794, 30.973847, 1455.6],
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">连线位置会随拖拽自适应最近顶点</div> `,
      offsetX: -6,
      offsetY: 6
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(divIndicator)

  // divIndicator.testPoint = true //可打开对比调offsetX、offsetY的css偏移值
}

function addDemoGraphic2(graphicLayer) {
  const divIndicator = new DivIndicator({
    position: [116.377794, 30.845679, 407.1],
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">连线位置是固定的</div> `,
      offsetX: -6,
      offsetY: 6,
      autoPoistion: false,
      verticalPoistion: "bottom",
      horizontalPoistion: "left"
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(divIndicator)
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

    const graphic = new DivIndicator({
      position,
      style: {
        html: ` <div class="divIndicator-fixed"></div>
                <div class="divIndicator-line"></div>
                <div class="divIndicator-drag">文字</div> `,
        offsetX: -6,
        offsetY: 6
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
    type: "divIndicator",
    style: {
      html: ` <div class="divIndicator-fixed"></div>
              <div class="divIndicator-line"></div>
              <div class="divIndicator-drag">文字</div> `,
      offsetX: -6,
      offsetY: 6
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
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
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
    }
  ])
}
