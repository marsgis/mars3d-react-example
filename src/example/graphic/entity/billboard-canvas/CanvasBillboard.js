// import * as mars3d from "mars3d"

// 通过Canvas绘制复杂或动态对象的图标点Graphic
class CanvasBillboard extends mars3d.graphic.BillboardPrimitive {
  /**
   * 文字
   * @type {string}
   */
  get text() {
    return this.style.text
  }

  set text(val) {
    this.style.text = val

    this.label.text = `温度:${val}℃`
  }

  /**
   * 对象添加到图层前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {Promise<object>}  无
   * @private
   */
  _addedHook(style) {
    style.image = "https://data.mars3d.cn/img/marker/bg/textPnl.png"
    style.label = {
      ...style,
      text: `温度:${this.style.text}℃`,
      font_size: 55,
      color: style.textColor ?? "#ffffff",
      hasPixelOffset: true,
      pixelOffsetX: 0,
      pixelOffsetY: -36 * (style.scale ?? 1)
    }
    if (style.scaleByDistance) {
      style.label.pixelOffsetScaleByDistance = style.scaleByDistance
    }

    super._addedHook(style)
  }

  _toJSON_Ex(json) {
    delete json.style.image
    delete json.style.label
  }
}

// 注册下
mars3d.GraphicUtil.register("canvasBillboard", CanvasBillboard)

// export { CanvasBillboard }
