const DEF_STYLE = {
  moveDomLeft: 50,
  moveDomTop: -100,
  autoPoistion: true,
  horizontalPoistion: "left",
  verticalPoistion: "bottom"
}

/**
 * 可拖拽 div
 * @param {object} options 参数对象，包括以下：
 * @param {LngLatPoint|Cesium.Cartesian3|number[]} options.position 坐标位置
 * @param {DivGraphic.StyleOptions} options.style 样式信息
 * @param {number} [options.style.moveDomTop=-100]  拖动面板的top值，单位：px
 * @param {number} [options.style.moveDomLeft=50] 拖动面板的left值，单位：px
 * @param {boolean} [options.style.autoPoistion=true]  是否自动判断连接最近的角
 * @param {string} [options.style.horizontalPoistion] 横向方向的连线位置，可以取值：left、right
 * @param {string} [options.style.verticalPoistion] 垂直方向的连线位置，可以取值：top、bottom
 *
 *
 * @param {object} [options.attr] 附件的属性信息，可以任意附加属性，导出geojson或json时会自动处理导出。
 * @class DivIndicator
 * @extends {mars3d.graphic.DivGraphic}
 */
class DivIndicator extends mars3d.graphic.DivGraphic {
  constructor(options = {}) {
    options.style = {
      ...DEF_STYLE,
      ...(options.style || {})
    }
    options.pointerEvents = options.pointerEvents ?? true
    super(options)
  }

  _appendHtmlHook() {
    this._container_drag = this._container.querySelector(".divIndicator-drag")
    this._container_fixed = this._container.querySelector(".divIndicator-fixed")
    this._container_line = this._container.querySelector(".divIndicator-line")

    if (this._container_drag) {
      this._container_drag.addEventListener("mousedown", this._dragDom_mousedown.bind(this))

      this._updateLineStyle()
    }
  }

  _removedHook() {
    if (this._container_drag) {
      this._container_drag.removeEventListener("mousedown", this._dragDom_mousedown) // 开始拖动事件
      delete this._container_drag
    }
    delete this._container_fixed
    delete this._container_line

    super._removedHook()
  }

  // 激活绘制
  _dragDom_mousedown(event) {
    event.preventDefault()
    event.stopPropagation()

    const disX = event.clientX - this._container_drag?.offsetLeft
    const disY = event.clientY - this._container_drag?.offsetTop

    addEvent(document.documentElement, "mousemove", handleMove)
    addEvent(document.documentElement, "mouseup", handleUp)
    addEvent(this.container, "mousemove", handleMove)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    function handleMove(el) {
      el.preventDefault()
      el.stopPropagation()

      that.style.moveDomLeft = el.clientX - disX
      that.style.moveDomTop = el.clientY - disY

      that._updateLineStyle()
    }

    function handleUp(e) {
      e.preventDefault()
      e.stopPropagation()

      removeEvent(document.documentElement, "mousemove", handleMove)
      removeEvent(document.documentElement, "mouseup", handleUp)
      removeEvent(that.container, "mousemove", handleMove)
    }
  }

  _updateDivPosition_Ex() {
    if (!this._line_distance && this._container_drag) {
      this._updateLineStyle()
    }
  }

  // 更新 两个 div 连线
  _updateLineStyle() {
    this._container_drag.style.left = this.style.moveDomLeft + "px"
    this._container_drag.style.top = this.style.moveDomTop + "px"

    const dragRect = this._container_drag.getBoundingClientRect()
    const fixedRect = this._container_fixed.getBoundingClientRect()

    let verticalPoistion
    let horizontalPoistion
    if (this.style.autoPoistion) {
      // 内部自动计算最近的角进行连接
      if (dragRect.left < fixedRect.left) {
        horizontalPoistion = "right"
      } else {
        horizontalPoistion = "left"
      }
      if (dragRect.top < fixedRect.top) {
        verticalPoistion = "bottom"
      } else {
        verticalPoistion = "top"
      }
    } else {
      verticalPoistion = this.style.verticalPoistion
      horizontalPoistion = this.style.horizontalPoistion
    }

    const top1 = fixedRect.y + fixedRect.height / 2
    const left1 = fixedRect.x + fixedRect.width / 2
    const top2 = dragRect[verticalPoistion]
    const left2 = dragRect[horizontalPoistion]

    const distance = usePointsDistance({ x: top1, y: left1 }, { x: top2, y: left2 }) // 线的长度
    const topValue = (left2 - left1) / 2 - 1 // 线的坐标
    const letValue = (top2 - top1) / 2 - distance / 2
    const angle = -Math.atan2(left1 - left2, top1 - top2) * (180 / Math.PI) // 线的角度

    this._line_distance = distance

    Object.assign(this._container_line.style, {
      height: `${distance}px`,
      transform: `translateX(${topValue}px) translateY(${letValue}px) scale(1) rotate(${angle}deg)`
    })
  }

  // 编辑样式时，重新刷新，将之前加载的样式赋上
  _updateStyleBaseHook(newStyle) {
    super._updateStyleBaseHook(newStyle)
    this._updateLineStyle()
  }
}

// 注册下
mars3d.GraphicUtil.register("divIndicator", DivIndicator)

// 计算两点之间的距离
function usePointsDistance(point, point2) {
  const horizontalLength = Math.abs(point.x - point2.x)
  const verticalLength = Math.abs(point.y - point2.y)

  return Number(Math.sqrt(Math.pow(horizontalLength, 2) + Math.pow(verticalLength, 2)).toFixed(2))
}

// 兼容不同浏览器，绑定事件
function addEvent(el, event, handler) {
  if (!el) {
    return
  }
  if (el.attachEvent) {
    el.attachEvent(`on${event}`, handler)
  } else if (el.addEventListener) {
    el.addEventListener(event, handler)
  } else {
    el[`on${event}`] = handler
  }
}

// 兼容不同浏览器，移除事件
function removeEvent(el, event, handler) {
  if (!el) {
    return
  }
  if (el.detachEvent) {
    el.detachEvent(`on${event}`, handler)
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler)
  } else {
    el[`on${event}`] = null
  }
}
